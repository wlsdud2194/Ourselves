const router = require('express').Router()
const studyCtrl = require('./study.ctrl');

router.route('/').get(studyCtrl.getStudyList);
router.route('/me').get(studyCtrl.getMyStudyList);
router.route('/past').get(studyCtrl.getPastStudyList);
router.route('/').post(studyCtrl.makeStudy);
router.route('/past').post(studyCtrl.closeStudy);
router.route('/apply').post(studyCtrl.applyStudy);
router.route('/end').post(studyCtrl.endStudy);
router.route('/apply').delete(studyCtrl.fireStudyPerson);
router.route('/:studyIdx/:applyId').post(studyCtrl.checkStudyPerson);

module.exports = router;
