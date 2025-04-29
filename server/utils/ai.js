const axios = require('axios');

// Helper function for delay (used in retry logic)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to call AI API with exponential backoff retry
async function callAIWithRetry(prompt, apiKey, retries = 2, backoff = 300) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.candidates && 
        response.data.candidates.length > 0 && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else if (response.data.promptFeedback && response.data.promptFeedback.blockReason) {
      throw new Error(`Gemini API blocked the request: ${response.data.promptFeedback.blockReason}`);
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    if (retries > 0) {
      console.log(`AI API call failed, retrying in ${backoff}ms... (${retries} retries left)`);
      await delay(backoff);
      return callAIWithRetry(prompt, apiKey, retries - 1, backoff * 2);
    } else {
      throw error;
    }
  }
}

module.exports = { callAIWithRetry, delay };
