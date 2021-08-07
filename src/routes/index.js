const router = require('express').Router();


router.use('/User', require('./User'));

module.exports = router;