var router = require('express').Router();

router.use('/survivalapi', require('./api'));

module.exports = router;
