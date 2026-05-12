const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

router.post('/', async (req, res) => {
  try {
    const { tripId, userEmail, tripPlan, destination } = req.body;
    console.log(`📝 Saving trip: ${tripId} for user: ${userEmail}`);
    
    const newTrip = new Trip({
      tripId,
      userEmail,
      tripDetail: typeof tripPlan === 'string' ? tripPlan : JSON.stringify(tripPlan),
      destination: destination || ''
    });
    await newTrip.save();
    console.log(`✅ Trip saved successfully: ${tripId}`);
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("❌ Error saving trip:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    console.log(`🔍 Fetching trips for user: ${req.params.email}`);
    const trips = await Trip.find({ userEmail: req.params.email });
    res.json(trips);
  } catch (error) {
    console.error("❌ Error fetching user trips:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    console.log(`🔍 Fetching trip details for ID: ${req.params.tripId}`);
    const trip = await Trip.findOne({ tripId: req.params.tripId });
    if (!trip) {
      console.warn(`⚠️ Trip not found: ${req.params.tripId}`);
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    console.error("❌ Error fetching trip details:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
