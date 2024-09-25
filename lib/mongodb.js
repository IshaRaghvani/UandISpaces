const mongoose = require('mongoose');

// MongoDB URI (include your database name here if not already)
const MONGODB_URI = 'mongodb+srv://isharaghvani21:Ishaaa.aa07@leads.75uqd.mongodb.net/LeadsData?retryWrites=true&w=majority';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    // Return cached connection if it exists
    return cached.conn;
  }

  if (!cached.promise) {
    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongooseInstance) => {
      console.log('Successfully connected to MongoDB');
      return mongooseInstance;
    }).catch(err => {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    });
  }

  // Await the promise to get the connection
  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectToDatabase;
