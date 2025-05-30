import { db, auth } from "../firebase"; // Your firebase config file
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [tickets, setTickets] = useState([]);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ email: currentUser.email, uid: currentUser.uid });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Listen to tickets collection realtime
  useEffect(() => {
    if (!user) {
      setTickets([]);
      return;
    }

    // Optionally filter tickets by user role or email here
    // For example, admin sees all tickets; user sees only theirs:
    let ticketsQuery = collection(db, "tickets");

    // Example: user sees only their tickets
    ticketsQuery = query(
      ticketsQuery,
      where("createdBy", "==", user.email),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(ticketsQuery, (querySnapshot) => {
      const ticketsData = [];
      querySnapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() });
      });
      setTickets(ticketsData);
    });

    return unsubscribe;
  }, [user]);
  // Login using Firebase Auth
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register user
  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Add new ticket to Firestore
  const addTicket = async (ticketData) => {
    try {
      await addDoc(collection(db, "tickets"), {
        ...ticketData,
        status: "Open",
        createdBy: user.email,
        assignedTo: null,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
  };

  // Update ticket status & solution in Firestore
  const updateTicket = async (id, newStatus, solution = "") => {
    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, {
        status: newStatus,
        ...(newStatus === "Resolved" && { solution }),
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // Delete ticket from Firestore
  const deleteTicket = async (id) => {
    try {
      const ticketRef = doc(db, "tickets", id);
      await deleteDoc(ticketRef);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
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
