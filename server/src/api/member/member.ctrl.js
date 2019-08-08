const { URL } = require('url');
const models = require('../../models');
const logger = require('../../lib/console');
const { bucketUrl } = require('../../../configs/aws');

exports.getStudent = async (req, res) => {
  const { memberId } = req.params;

  if (!memberId) {
    const result = {
      status: 400,
      message: '조회할 학생의 아이디가 없습니다',
    };
    res.status(400).json(result);
    return;
  }

  try {
    const students = await models.Member.getStudentById(memberId);

    const result = {
      status: 200,
      message: '학생 조회 성공',
      data: students,
    };
    res.status(200).json(result);
    logger.green('[member - getStudent] 학생 조회 성공');
  } catch (error) {
    logger.red(`[member - getStudent] 서버에러 : ${error}`);
    const result = {
      status: 500,
      message: '학생 조회 실패',
    };
    res.status(500).json(result);
  }
}

exports.getStudentList = async (req, res) => {
  const { auth } = req.decoded;
  
  if (auth !== 1) {
    const result = {
      status: 403,
      message: '학생을 조회할 권한이 없습니다.',
    };
    res.status(403).json(result);
    return;
  }

  try {
    const students = await models.Member.getStudents();
    let first = [], second = [], third = [], admin = [];

    for (let student of students) {
      if (student.grade === 1) {
        first.push(student);
      } else if (student.grade === 2) {
        second.push(student);
      } else if (student.grade === 3) {
        third.push(student);
      } else {
        admin.push(student);
      }
    }

    const result = {
      status: 200,
      message: '학생 리스트 조회 성공',
      data: {
        first,
        second,
        third,
      },
    };
    res.status(200).json(result);
    logger.green('[member - getStudentList] 학생 리스트 조회 성공');
  } catch (error) {
    console.log(error);
    logger.red(`[member - getStudentList] 서버에러 : ${error}`);
    const result = {
      status: 500,
      message: '학생 리스트 조회 실패',
    };
    res.status(500).json(result);
  }
};

exports.getStudyMemberList = async (req, res) => {
  try {
    let students = [];
    const studyIdx = parseInt(req.params.studyIdx, 10);
    const studyPerson = await models.StudyPerson.getStudyPersonByIdx(studyIdx);

    for (let student of studyPerson) {
      let [member] = await models.Member.getStudentById(student.memberId);
      member.status = student.status;

      if (member.profileImg) {
        member.profileImg = new URL(member.profileImg, bucketUrl).href;
      }

      students.push(member);
    }

    const result = {
      status: 200,
      message: '스터디 신청 학생 목록조회 성공',
      data: students,
    };
    res.status(200).json(result);
    logger.green('[member - getStudyMemberList] 스터디 신청 학생 목록조회 성공');
  } catch (error) {
    logger.red(`[member - getStudyMemberList] 서버에러 : ${error}`);
    const result = {
      status: 500,
      message: '스터디 신청 학생 목록조회 실패',
    };
    res.status(500).json(result);
  }
};

