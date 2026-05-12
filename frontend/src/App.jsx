import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import axios from "axios";
import Header from "./components/Header";
import Home from "./pages/Home";
import CreateNewTrip from "./pages/CreateNewTrip";
import TripDetails from "./pages/TripDetails";
import MyTrips from "./pages/MyTrips";
import BookNow from "./pages/BookNow";
import Pricing from "./pages/Pricing";
import ContactUs from "./pages/ContactUs";
import { UserDetailContext } from "./context/UserDetailContext";
import { TripDetailContext } from "./context/TripDetailContext";

function App() {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const [tripDetailInfo, setTripDetailInfo] = useState(null);

  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]);

  const syncUser = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/sync`, {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
        picture: user.imageUrl,
      });
      setUserDetail(response.data);
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center font-outfit bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl mb-4 flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-12">
            <span className="text-4xl font-black text-indigo-600 -rotate-12">A</span>
          </div>
          <p className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-sm animate-bounce">your dream</p>
        </div>
      </div>
    );
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{ tripDetailInfo, setTripDetailInfo }}>
        <Router>
          <div className="min-h-screen font-outfit bg-black text-white">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact-us" element={<ContactUs />} />
                
                <Route path="/create-new-trip" element={
                  <>
                    <SignedIn>
                      <CreateNewTrip />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />

                <Route path="/trip-details/:tripId" element={
                  <>
                    <SignedIn>
                      <TripDetails />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />

                <Route path="/my-trips" element={
                  <>
                    <SignedIn>
                      <MyTrips />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />

                <Route path="/book-now" element={
                  <>
                    <SignedIn>
                      <BookNow />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </TripDetailContext.Provider>
      </UserDetailContext.Provider>
    );
  }

export default App;
