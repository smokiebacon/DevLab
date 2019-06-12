const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route GET api/auth
// @access public

//including auth as second argument makes the route protected.
router.get('/', auth, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');
        //have access to req.user.id because in our middleware, we used req.user = decoded.user;
        //adding .select() will leave off the password in the data
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error in auth.js');

    }
    res.send('Auth route working')
}
)

module.exports = router;