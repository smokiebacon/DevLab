const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route POST api/users
// @description Register users
// @access public
router.post('/', [
    // using the package express-validator, check for fields if correct. refer to documentation
    //check takes in 2 arguments, input and message.
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            //check if User exists
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
            //grabs users Gravatar
            const avatar = gravatar.url(email, {
                s: '200', //size of 200
                r: 'pg', //sets gravatar to PG. no naked!
                d: 'mm' //sets default image
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })
            //encrypt Password with Bcrypt
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
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