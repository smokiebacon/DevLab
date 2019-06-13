const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @get current users profile
// @access private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        //populate from the user model, want the name and avatar
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in profiles.js');

    }
})


module.exports = router;