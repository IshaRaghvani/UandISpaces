// lib/models/LeadsData.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

let LeadsData;

// Define the schema for logs
const logEntrySchema = new Schema({
  status: String,
  comment: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

// Define the schema for comments
const commentSchema = new Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

// Define the schema for leads
const leadsDataSchema = new Schema({
  name: String,
  phone_number: String,
  alternate_phone_number: String,
  email: String,
  city: String,
  configuration: String,
  project_name: String,
  budget: Number,
  possession_type: {
    type: String,
    enum: ['In Hand', 'Not In Hand'],
   
  },
  possession_month: {
    type: Number,
    min: 1,
    max: 12,
  },
  possession_year: {
    type: Number,
  },
  requirement: String,
  lead_source: {
    type: String,
  },
  status: {
    type: String,
  },
  comments: [commentSchema], 
  follow_up_date: Date,
  follow_up_status: {
    type: String,
    // Define enum values if needed
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  designer: {
    type: {
      name: String,
      id: String,
      date: Date,
    },
  },
  logs: [logEntrySchema], // Simplified logs field
});

// Export the model
if (mongoose.models.LeadsData) {
  LeadsData = mongoose.models.LeadsData;
} else {
  LeadsData = mongoose.model('LeadsData', leadsDataSchema);
}
module.exports = mongoose.models.LeadsData || mongoose.model('LeadsData', leadsDataSchema);
