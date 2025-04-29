const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docAnalysis', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Set up GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

module.exports = { connectDB, getGridFS: () => gfs };
