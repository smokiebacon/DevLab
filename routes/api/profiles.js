const express = require('express');
const router = express.Router();

// @route GET api/users
// @access public
router.get('/', (req, res) =>
    res.send('Profile route working')
)


module.exports = router;