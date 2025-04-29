const { callAIWithRetry } = require('../utils/ai');
const Document = require('../models/Document');

/**
 * Analyze document content using AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const analyzeDocument = async (req, res) => {
  const { content, prompts } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g";

  if (!content || !Array.isArray(prompts) || prompts.length === 0) {
    return res.status(400).json({ error: 'Missing document content or prompts.' });
  }

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured in the backend.' });
  }

  try {
    let currentContext = content;
    const intermediateResults = [];
    let finalResult = '';
    let structuredData = {};

    // Chain of prompts execution
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      
      // Construct a contextual prompt that passes previous results
      let aiPrompt = `Context Document:\n"${currentContext}"\n\n`;
      
      // Include intermediate results in the prompt for context
      if (intermediateResults.length > 0) {
        aiPrompt += "Previously extracted information:\n";
        for (let j = 0; j < intermediateResults.length; j++) {
          aiPrompt += `Step ${j+1}: ${intermediateResults[j]}\n\n`;
        }
      }
      
      aiPrompt += `Instructions:\n${prompt}\n\nAnswer:`;

      try {
        const aiResponse = await callAIWithRetry(aiPrompt, geminiApiKey);
        intermediateResults.push(aiResponse);
        currentContext = aiResponse; // Chain the output
        finalResult = aiResponse;
        
        // Try to extract structured data if the prompt requests it
        if (prompt.toLowerCase().includes('json') || 
            prompt.toLowerCase().includes('structured') ||
            prompt.toLowerCase().includes('extract')) {
          try {
            // Try to find a JSON object in the response
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                            aiResponse.match(/\{[\s\S]*\}/);
                            
            if (jsonMatch) {
              const jsonStr = jsonMatch[1] || jsonMatch[0];
              const parsedData = JSON.parse(jsonStr);
              structuredData[`step${i+1}`] = parsedData;
            }
          } catch (jsonError) {
            console.log('Could not extract structured data from response');
          }
        }
      } catch (error) {
        return res.status(500).json({ 
          error: `Error during step ${i+1} of document analysis: ${error.message}`,
          partialResults: intermediateResults.length > 0 ? intermediateResults : null
        });
      }
    }

    // Save analysis results if fileId is provided
    if (req.body.fileId) {
      try {
        await Document.findOneAndUpdate(
          { fileId: req.body.fileId },
          { 
            $push: { 
              analysisResults: { 
                date: new Date(),
                results: {
                  finalResult,
                  intermediateResults,
                  structuredData: Object.keys(structuredData).length > 0 ? structuredData : null
                }
              } 
            } 
          }
        );
      } catch (dbError) {
        console.error('Error saving analysis results:', dbError);
      }
    }

    res.json({ 
      results: { 
        finalResult, 
        intermediateResults,
        structuredData: Object.keys(structuredData).length > 0 ? structuredData : null
      }
    });

  } catch (error) {
    console.error('Error in analysis chain:', error.message);
    res.status(500).json({ 
      error: `Error during document analysis: ${error.message}`,
      partialResults: intermediateResults && intermediateResults.length > 0 ? intermediateResults : null
    });
  }
};

module.exports = {
  analyzeDocument
};
