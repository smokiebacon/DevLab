const express = require('express');
const router = express.Router();

// @route GET api/users
// @access public
router.get('/', (req, res) =>
    res.send('Posts route working')
)

module.exports = router;