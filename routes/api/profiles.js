const express = require('express');
const request = require('request')
const config = require('config')
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

// @route GET api/profiles/me
// @get current users profile
// @access private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        //populate from the user model, want the name and avatar
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in profiles.js in /me route');

    }
})


// @route DELETE api/profiles
// @get DELETE user profile, user, and posts
// @access private

router.delete('/', auth, async (req, res) => {
    try {
        //@todo -- remove user posts
        //delete profile
        const deletedProfile = await Profile.findOneAndRemove({ user: req.user.id })
        const deletedUser = await User.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: 'User deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in profiles.js Delete profiles');
    }
})


// @route GET api/profiles
// @get all profiles
// @access public

router.get('/', async (req, res) => {
    try {
        const allProfiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(allProfiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in profiles.js get ALL profiles');
    }
})

// @route GET api/profiles/user/:user_id
// @get profile by user id
// @access public

router.get('/user/:user_id', async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!foundProfile) {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.json(foundProfile);

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })

        }
        res.status(500).send('Server Error in profiles.js get profile/:id');
    }
})



// @route POST api/profiles
// @get create or update a user's profile
// @access private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required.').not().isEmpty()
]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;


    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )
            return res.json(profile);
        }
        //create Profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error in profiles.js');
    }


})

// @route PUT api/profiles/experience
// @get Add user experience
// @access private

router.put('/experience', [auth, [
    check('title', 'Title is required.').not().isEmpty(),
    check('company', 'Company is required.').not().isEmpty(),
    check('from', 'From date is required.').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const foundProfile = await Profile.findOne({ user: req.user.id })
        console.log(foundProfile);
        foundProfile.experience.unshift(newExperience);
        await foundProfile.save();
        res.json(foundProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Profiles.js in Experience ');
    }
})

// @route DELETE api/profiles/experience
// @get Delete an User education
// @access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get the removed index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Delete Experience route');
    }
})


// @route PUT api/profiles/education
// @get Add user education
// @access private

router.put('/education', [auth, [
    check('school', 'School is required.').not().isEmpty(),
    check('degree', 'Degree is required.').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required.').not().isEmpty(),
    check('from', 'From date is required.').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const foundProfile = await Profile.findOne({ user: req.user.id })
        console.log(foundProfile);
        foundProfile.education.unshift(newEducation);
        await foundProfile.save();
        res.json(foundProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in profiles.js in education ');
    }
})

// @route DELETE api/profiles/education
// @get Delete an User education
// @access private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get the removed index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        console.log(req.params, 'THIS IS REQ.PARAMS');
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Delete education route');
    }
})


// @route GET api/profiles/github/:username
// @get User Repo's from github
// @access Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per+page5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in /github/:username route')
    }
})

module.exports = router;