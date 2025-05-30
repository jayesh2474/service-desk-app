import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

// Sample data
const sampleTickets = [
  {
    id: 1,
    title: "Laptop not starting",
    description: "My work laptop is not booting up since morning",
    category: "IT",
    priority: "High",
    status: "Open",
    createdBy: "john.doe@company.com",
    assignedTo: "it.admin@company.com",
    createdAt: "2024-05-30T10:30:00Z",
  },
  {
    id: 2,
    title: "Payroll inquiry",
    description: "Question about overtime calculation in last paycheck",
    category: "HR",
    priority: "Medium",
    status: "In Progress",
    createdBy: "jane.smith@company.com",
    assignedTo: "hr.manager@company.com",
    createdAt: "2024-05-29T14:15:00Z",
  },
  {
    id: 3,
    title: "Expense reimbursement",
    description: "Travel expense reimbursement pending approval",
    category: "Finance",
    priority: "Low",
    status: "Resolved",
    createdBy: "mike.johnson@company.com",
    assignedTo: "finance.team@company.com",
    createdAt: "2024-05-28T09:45:00Z",
  },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState(sampleTickets);

  const login = (email, password, role = "user") => {
    // In real app, validate credentials with backend
    setUser({ email, role, name: email.split("@")[0] });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData) => {
    // In real app, register with backend
    setUser({ ...userData, role: "user" });
    return true;
  };

  const addTicket = (ticketData) => {
    const newTicket = {
      ...ticketData,
      id: Date.now(),
      status: "Open",
      createdBy: user?.email,
      assignedTo: null,
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicket = (ticketId, updates) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );
  };

  const deleteTicket = (ticketId) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  const value = {
    user,
    tickets,
    login,
    logout,
    register,
    addTicket,
    updateTicket,
    deleteTicket,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
