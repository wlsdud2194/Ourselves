const router = require('express').Router();
const logCtrl = require('./logApi.ctrl');

router.route('/').get(logCtrl.getLog);

module.exports = router;
