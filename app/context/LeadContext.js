// context/LeadContext.js
'use client';
import React, { createContext, useContext, useState } from 'react';

// Create a Context for Lead Data
const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);

  const updateLead = (updatedLead) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
    );
  };

  return (
    <LeadContext.Provider value={{ leads, setLeads, updateLead }}>
      {children}
    </LeadContext.Provider>
  );
};

// Custom hook to use LeadContext
export const useLeads = () => {
  return useContext(LeadContext);
};
