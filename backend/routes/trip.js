const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

router.post('/', async (req, res) => {
  try {
    const { tripId, userEmail, tripPlan, destination } = req.body;
    const newTrip = new Trip({
      tripId,
      userEmail,
      tripDetail: typeof tripPlan === 'string' ? tripPlan : JSON.stringify(tripPlan),
      destination: destination || ''
    });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const trips = await Trip.find({ userEmail: req.params.email });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findOne({ tripId: req.params.tripId });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
