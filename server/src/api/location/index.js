const router = require('express').Router();
const locationCtrl = require('./location.ctrl');

router.route('/').get(locationCtrl.getLocationList);
router.route('/').post(locationCtrl.createLocation);
router.route('/').put(locationCtrl.updateLocation);
router.route('/').delete(locationCtrl.deleteLocation);

module.exports = router;
