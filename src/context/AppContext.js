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
  setDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
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

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get additional user data from Firestore (like name)
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const unsubscribeUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              // Combine auth user with Firestore user data
              setUser({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                ...doc.data(),
              });
            } else {
              setUser({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
              });
            }
          });

          return () => {
            unsubscribeUser();
          };
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
          });
        }
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

    let ticketsQuery;
    try {
      ticketsQuery = query(
        collection(db, "tickets"),
        where("createdBy", "==", user.email),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        ticketsQuery,
        (querySnapshot) => {
          const ticketsData = [];
          querySnapshot.forEach((doc) => {
            ticketsData.push({ id: doc.id, ...doc.data() });
          });
          console.log(`Fetched ${ticketsData.length} tickets from Firestore`);
          setTickets(ticketsData);
        },
        (error) => {
          console.error("Error fetching tickets:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up tickets listener:", error);
      setTickets([]);
    }
  }, [user]);

  // Register user with name
  const register = async (email, password, name) => {
    try {
      // Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName: name });

      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        createdAt: new Date().toISOString(),
        role: "user",
      });

      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

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
        createdByName:
          user.name || user.displayName || user.email.split("@")[0],
        assignedTo: null,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error adding ticket:", error);
      return false;
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
      return true;
    } catch (error) {
      console.error("Error updating ticket:", error);
      return false;
    }
  };

  // Delete ticket from Firestore
  const deleteTicket = async (id) => {
    try {
      const ticketRef = doc(db, "tickets", id);
      await deleteDoc(ticketRef);
      return true;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return false;
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
