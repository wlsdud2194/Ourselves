const router = require('express').Router();
const img = require('./image');

router.use('/img', img);

module.exports = router;
