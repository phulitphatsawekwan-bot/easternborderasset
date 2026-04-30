const express = require('express');
const router = express.Router()
// Controllers
const { createProfile, readProfile } =  require('../controllers/profile');
const { authCheck } = require('../middlewares/auth');

// @ENDPOINT http://localhost:5000/api/profile
router.get('/profile', authCheck, readProfile);
router.post('/profile', authCheck, createProfile);

module.exports = router
