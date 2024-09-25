// services/leadsService.js

// Define the base URL for your API
const API_BASE_URL = '/api/leads';

// Function to fetch all leads with optional filters and sorting
export async function fetchLeads(queryParams = {}) {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_BASE_URL}?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

// Function to fetch a single lead by ID
export async function fetchLeadById(leadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${leadId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch lead');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }
}

// Function to create a new lead
export async function createLead(leadData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create lead');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

// Function to update lead status
export async function updateLeadStatus(leadId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/updateStatus`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update lead status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
}
// Function to update lead follow-up status
export async function updateFollowUpStatus(leadId, followUpStatus) {
    try {
      const response = await fetch(`${API_BASE_URL}/updateFollowUpStatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, followUpStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update follow-up status');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating follow-up status:', error);
      throw error;
    }
  }

// Function to upload CSV data
export async function uploadLeadsCSV(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload CSV');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
}
