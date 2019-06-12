const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');

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


// @route POST api/auth
//login
// @description Authenicate user and get token
// @access public
router.post('/', [
    // using the package express-validator, check for fields if correct. refer to documentation
    //check takes in 2 arguments, input and message.
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Password is required.'
    ).exists()

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            //check if User exists
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid email / password' }] });
            }

            //match password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid email / password' }] });

            }
            //return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })

module.exports = router;