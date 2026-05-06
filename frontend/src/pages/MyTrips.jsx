import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Wallet } from "lucide-react";

function MyTrips() {
  const { user } = useUser();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserTrips();
    }
  }, [user]);

  const fetchUserTrips = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/trips/user/${user.primaryEmailAddress.emailAddress}`
      );
      setUserTrips(response.data);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-500 font-medium">
        Loading your adventures...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-20 bg-gray-50 font-outfit">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Trips 🌍</h2>
        <p className="text-gray-500 mb-10">Your collection of personalized AI travel plans</p>

        {userTrips.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-700">No trips found yet!</h3>
            <p className="text-gray-500 mt-2 mb-8">Start your first adventure with our AI Trip Assistant.</p>
            <Link to="/create-new-trip">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
                Create New Trip
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTrips.map((trip, index) => (
              <TripCardItem key={index} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TripCardItem({ trip }) {
  const plan = JSON.parse(trip.tripDetail);
  
  return (
    <Link to={`/trip-details/${trip.tripId}`}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] border border-gray-100 group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src="https://wallpapers.com/images/hd/adventure-background-s0t6dibysfddsgfi.jpg"
            alt="trip"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
            AI Generated
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
              {trip.destination}
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Calendar className="w-4 h-4 text-pink-500" />
                {plan?.duration || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Wallet className="w-4 h-4 text-orange-500" />
                {plan?.budget || "N/A"} Budget
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">View Details</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MyTrips;
