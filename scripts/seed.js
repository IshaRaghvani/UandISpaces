const mongoose = require('mongoose');
const LeadsData = require('../models/LeadsData'); // Adjust path if needed

const MONGODB_URI = 'mongodb+srv://isharaghvani21:Ishaaa.aa07@leads.75uqd.mongodb.net/LeadsData?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyLeads = [
  {
    name: 'John Doe',
    phone_number: '123-456-7890',
    alternate_phone_number: '098-765-4321',
    email: 'john.doe@example.com',
    city: 'New York',
    configuration: 'Config A',
    project_name: 'Project X',
    budget: 50000,
    possession_type: 'In Hand',
    possession_month: 9, // Example month
    possession_year: 2024, // Example year
    requirement: 'Requirement A',
    lead_source: 'Referral',
    status: 'Warm',
    comments: [
      {
        text: 'Initial contact made',
        date: new Date(), // Default date can be used here
      },
    ],
    follow_up_date: new Date('2024-09-20'),
    follow_up_status: 'Call Later',
    designer: {
      name: 'Designer A',
      id: 'designer123',
      date: new Date(),
    },
    logs: [
      {
        status: 'Warm',
        comment: 'Lead created',
        date: new Date(),
      },
    ],
  },
  // Add more dummy leads as needed
];

const seedDatabase = async () => {
  try {
    await LeadsData.deleteMany({});
    await LeadsData.insertMany(dummyLeads);
    console.log('Dummy data inserted successfully');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
