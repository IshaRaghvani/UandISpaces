const mongoose = require('mongoose');
const LeadsData = require('../models/LeadsData'); // Adjust the path as needed
const connectToDatabase = require('./mongodb'); // Adjust the path as needed

// Generate dummy data
const generateDummyData = () => {
  const dummyLeads = [];
  for (let i = 1; i <= 20; i++) {
    dummyLeads.push({
      name: `Lead ${i}`,
      phone_number: `888888000${i}`,
      alternate_phone_number: `999999000${i}`,
      email: `lead${i}@example.com`,
      city: `City ${i}`,
      configuration: 'Standard',
      project_name: `Project ${i}`,
      budget: Math.floor(Math.random() * 100000) + 10000, // Random budget between 10,000 and 110,000
      possession_type: Math.random() > 0.5 ? 'In Hand' : 'Not In Hand',
      possession_month: Math.floor(Math.random() * 12) + 1, // Random month between 1 and 12
      possession_year: 2024,
      requirement: 'High',
      lead_source: 'Online',
      status: 'New',
      comments: [{
        text: 'Initial contact made.',
        date: new Date(),
      }],
      follow_up_date: new Date(),
      follow_up_status: 'To be Followed',
      created_at: new Date(),
      designer: {
        name: `Designer ${i}`,
        id: `designer${i}`,
        date: new Date(),
      },
      logs: [{
        status: 'Created',
        comment: 'Lead created successfully.',
        date: new Date(),
      }],
    });
  }
  return dummyLeads;
};

async function addDummyData() {
  await connectToDatabase(); // Connect to your database

  try {
    // Generate and insert dummy data
    const dummyLeads = generateDummyData();
    const result = await LeadsData.insertMany(dummyLeads);
    console.log(`Inserted ${result.length} dummy records into the Lead collection.`);
  } catch (error) {
    console.error('Error inserting dummy records:', error);
  } finally {
    mongoose.disconnect(); // Close the database connection
  }
}

addDummyData();
