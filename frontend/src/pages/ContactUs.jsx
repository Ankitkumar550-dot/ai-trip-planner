import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

function ContactUs() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Get in Touch</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Have questions or suggestions? We'd love to hear from you. Our team is here to help you plan your perfect journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-500">support@aitripplanner.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-500">+1 (555) 000-0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit Us</h3>
                    <p className="text-gray-500">123 AI Way, Tech City, TC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">Follow Our Journey</h3>
              <p className="text-indigo-100 mb-6">Stay updated with the latest AI travel trends and features.</p>
              <div className="flex gap-4">
                {/* Social icons could go here */}
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="font-bold">Tw</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="font-bold">In</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="font-bold">Fb</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">First Name</label>
                  <Input placeholder="John" className="rounded-xl border-gray-200 focus:border-indigo-500 transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Last Name</label>
                  <Input placeholder="Doe" className="rounded-xl border-gray-200 focus:border-indigo-500 transition-all" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                <Input type="email" placeholder="john@example.com" className="rounded-xl border-gray-200 focus:border-indigo-500 transition-all" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Subject</label>
                <Input placeholder="How can we help?" className="rounded-xl border-gray-200 focus:border-indigo-500 transition-all" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Message</label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-[150px] rounded-2xl border-gray-200 focus:border-indigo-500 transition-all resize-none" 
                  required 
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all font-bold text-lg flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
