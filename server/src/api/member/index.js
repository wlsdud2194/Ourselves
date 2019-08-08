const router = require('express').Router();
const memberCtrl = require('./member.ctrl');

router.route('/').get(memberCtrl.getStudentList);
router.route('/:memberId').get(memberCtrl.getStudent);
router.route('/study/:studyIdx').get(memberCtrl.getStudyMemberList);

module.exports = router;
