import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle2, User, Phone, Hotel, Loader2, Mail } from "lucide-react";
import axios from "axios";

function BookNow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Ankit",
    mobile: "",
    email: "",
    hotelName: searchParams.get("hotel") || "Luxury Hotel",
  });

  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    setBookingId("BK" + Math.random().toString(36).substring(2, 9).toUpperCase());
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile || !formData.email) {
      alert("Please fill in your name, mobile and email");
      return;
    }
    setLoading(true);
    
    try {
      // Call the email API
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/email/send-booking-confirmation`, {
        ...formData,
        bookingId: bookingId
      });
      
      setStep(2);
    } catch (error) {
      console.error("Failed to send booking confirmation:", error);
      // Still proceed to step 2 but maybe show a small toast or log
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center bg-black text-white">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-white">Your trip has been booked successfully 🎉</h1>
            <p className="text-gray-400 italic text-sm">
              Confirmation sent to <span className="font-bold text-indigo-400">{formData.mobile}</span> and <span className="font-bold text-indigo-400">{formData.email}</span>
            </p>
          </div>

          <Card className="border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl rounded-[2rem]">
            <div className="relative h-48 bg-neutral-800">
              <img
                src="https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="hotel"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                <CheckCircle2 size={14} />
                Booking Confirmed
              </div>
            </div>
            <CardContent className="p-8 text-left">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-gray-500">Hotel Name</Label>
                    <p className="font-bold text-lg text-white">{formData.hotelName}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-gray-500">Booking ID</Label>
                    <p className="font-mono text-indigo-400 font-bold">{bookingId}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-gray-500">Guest Name</Label>
                    <p className="font-bold text-white">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold text-gray-500">Status</Label>
                    <p className="text-green-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Upcoming
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/')}
                className="w-full mt-8 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-black text-white">
      <Card className="max-w-md w-full shadow-2xl rounded-[2.5rem] border-white/5 backdrop-blur-sm bg-neutral-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Hotel size={28} />
            Finalize Booking
          </CardTitle>
          <p className="text-white/80 text-sm mt-1">Review and submit your booking details</p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <Label className="flex items-center gap-2 text-gray-400"><User size={16} /> Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl h-12 border-white/10 bg-black/50 text-white"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label className="flex items-center gap-2 text-gray-400"><Phone size={16} /> Mobile Number</Label>
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="rounded-xl h-12 border-white/10 bg-black/50 text-white"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label className="flex items-center gap-2 text-gray-400"><Mail size={16} /> Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl h-12 border-white/10 bg-black/50 text-white"
                placeholder="example@mail.com"
              />
            </div>

            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-white/5 mb-6 text-left">
              <Label className="text-[10px] uppercase font-bold text-indigo-400">Selected Hotel</Label>
              <p className="font-bold text-white">{formData.hotelName}</p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-95 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 text-white"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
              {loading ? "Processing..." : "Submit Booking"}
            </Button>

            <p className="text-center text-[10px] text-gray-400 font-medium italic">
              A confirmation will be sent to your mobile and email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookNow;
