require('dotenv').config();

const { URL } = require('url');
const models = require('../../models');
const logger = require('../../lib/console');
const { bucketUrl } = require('../../../configs/aws');
const { getServerIp } = require('../../lib/method');
const { PORT: port } = process.env;

const getFileAndLocationOfStudy = async (studies) => {
  try {
    if (Array.isArray(studies)) {
      for (study of studies) {
        let imgs = [];
        const [member] = await models.Member.getStudentById(study.memberId);
        const files = await models.File.getFileByStudyIdx(study.idx);
        const currentPerson = await models.StudyPerson.getStudyPersonByIdx(study.idx);
        const location = await models.Location.getLocationByIdx(study.locationIdx);

        files.forEach(file => imgs.push(new URL(file.url, bucketUrl).href));

        study.memberName = member.name;
        study.location = location.place;
        study.currentPerson = currentPerson.length;
        study.imgs = imgs;
      }

      return studies;
    }

    let imgs = [];
    const [member] = await models.Member.getStudentById(studies.memberId);
    const files = await models.File.getFileByStudyIdx(studies.idx);
    const currentPerson = await models.StudyPerson.getStudyPersonByIdx(studies.idx);
    const location = await models.Location.getLocationByIdx(studies.locationIdx);

    files.forEach(file => imgs.push(new URL(file.url, bucketUrl).href));

    studies.memberName = member.name;
    studies.location = location.place;
    studies.currentPerson = currentPerson.length;
    studies.imgs = imgs;
    
    return studies;
  } catch (error) {
    throw error;
  }
};

// 내가 개설한 것, 내가 들어가 있는 스터디 조회
exports.getMyStudyList = async (req, res) => {
  const { memberId } = req.decoded;

  try {
    let foundStudyByMe = await models.Study.getStudyByMemberId(memberId);
    const applyPersonListByMe = await models.StudyPerson.getStudyPersonByMemberId(memberId); // 미완
    const applyStudyByMe = [];
    foundStudyByMe = await getFileAndLocationOfStudy(foundStudyByMe);

    for (personByMe of applyPersonListByMe) {
      let study = await models.Study.getStudyByIdx(personByMe.studyIdx);
      study = await getFileAndLocationOfStudy(study);
      applyStudyByMe.push(study);
    }
    
    const result = {
      status: 200,
      message: '나와 관련된 스터디 목록조회 성공',
      data: {
        foundStudies: foundStudyByMe,
        applyStudies: applyStudyByMe,
      },
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    logger.red(`[study - getMyStudyList] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '나의 스터디 목록조회 실패',
    };
    res.status(500).json(result);
  }
};

// 스터디 조회할때 스터디 위치와 현재까지 신청 학생수도 같이 조회
exports.getStudyList = async (req, res) => {
  try {
    let studies = await models.Study.getStudies();

    studies = await getFileAndLocationOfStudy(studies);

    const result = {
      status: 200,
      message: '모집중인 스터디 목록조회 성공',
      data: studies,
    };
    res.status(200).json(result);
    logger.green('[study - getStudyList] 모집중인 스터디 목록조회 성공');
  } catch (error) {
    logger.red(`[study - getStudyList] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 목록조회 실패',
    };
    res.status(500).json(result);
  }
};

// 지난 스터디 조회
exports.getPastStudyList = async (req, res) => {
  try {
    let studies = await models.Study.getPastStudies();

    studies = await getFileAndLocationOfStudy(studies);

    const result = {
      status: 200,
      message: '진행중인 스터디 목록조회 성공',
      data: studies,
    };
    res.status(200).json(result);
    logger.green('[study - getStudyList] 진행중인 스터디 목록조회 성공');
  } catch (error) {
    logger.red(`[study - getStudyList] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 목록조회 실패',
    };
    res.status(500).json(result);
  }
};

// 스터디 생성
exports.makeStudy = async (req, res) => {
  // title, description, startTerm, endTerm,
  // startTime, endTime, personnel, locationIdx, imgs: ['1234.jpg']
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    const { dataValues: study } = await models.Study.makeStudy(memberId, body);

    if (Array.isArray(body.imgs) && body.imgs.length > 0) {
      for (img of body.imgs) {
        await models.File.matchingFile(study.idx, img);
      }
    }

    // 자기자신 스터디 신청
    await models.StudyPerson.applyStudy(memberId, study.idx);

    const result = {
      status: 200,
      message: '스터디 생성 성공',
    };
    res.status(200).json(result);
    logger.green('[study - makeStudy] 스터디 생성 성공');
  } catch (error) {
    logger.red(`[study - makeStudy] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 생성 실패',
    };
    res.status(500).json(result);
  }
};

// 스터디 멤버 강퇴
exports.fireStudyPerson = async (req, res) => {
  const { memberId } = req.decoded;
  const { applyId, studyIdx } = req.body;

  try {
    const study = await models.Study.getStudyByIdx(studyIdx);
    const studyPerson = await models.StudyPerson.checkMember(studyIdx, applyId);

    if (memberId !== study.memberId) {
      const result = {
        status: 403,
        message: '스터디 개설자만 스터디 회원을 강퇴할 수 있습니다',
      };
      res.status(403).json(result);
      return;
    }

    if (!studyPerson) {
      const result = {
        status: 403,
        message: '해당 스터디의 회원이 아닙니다',
      };
      res.status(403).json(result);
      return;
    }

    await models.StudyPerson.destroy({ where: { memberId: applyId } });

    const result = {
      status: 200,
      message: '스터디 회원 강퇴 성공',
    };

    res.status(200).json(result);
    logger.green('[study - checkStudyPerson] 스터디 회원 강퇴 성공');
  } catch (error) {
    logger.red(`[study - checkStudyPerson] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 강퇴 실패',
    };
    res.status(500).json(result);
  }
};

// 스터디 참여 체크
exports.checkStudyPerson = async (req, res) => {
  const { memberId } = req.decoded;
  const { studyIdx, applyId } = req.params;

  try {
    const applicant = await models.Member.getMemberById(applyId); // 신청자, 지원자
    const study = await models.Study.getStudyByIdx(studyIdx);
    const studyPerson = await models.StudyPerson.checkMember(studyIdx, applicant.id);

    if (memberId !== study.memberId) {
      const result = {
        status: 403,
        message: '스터디 개설자만 스터디 회원 체크를 할 수 있습니다',
      };
      res.status(403).json(result);
      return;
    }

    // 참여 학생 확인
    if (applicant.status === 1) {
      const result = {
        status: 403,
        message: '이미 스터디에 참여한 학생입니다',
      };
      res.status(403).json(result);
      return;
    }

    if (!studyPerson) {
      const result = {
        status: 403,
        message: '해당 스터디의 회원이 아닙니다',
      };
      res.status(403).json(result);
      return;
    }

    // 출석 체크
    await models.StudyPerson.update({
      status: 1,
    }, {
      where: {
        studyIdx: study.idx,
        memberId: applicant.id,
      },
    });
    
    const result = {
      status: 200,
      message: '스터디 회원이 확인 성공',
    };
    res.status(200).json(result);
    logger.green('[study - checkStudyPerson] 스터디 회원 확인 성공');
  } catch (error) {
    logger.red(`[study - checkStudyPerson] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 회원 체크 실패',
    };
    res.status(500).json(result);
  }
};

// 스터디 모집 마감
exports.closeStudy = async (req, res) => {
  const { memberId } = req.decoded;
  const { studyIdx } = req.body;

  try {
    const study = await models.Study.findOne({ where: { idx: studyIdx }, raw: true });

    if (memberId !== study.memberId) {
      const result = {
        status: 403,
        message: '스터디 개설자만 스터디를 마감할 수 있습니다',
      };
      res.status(403).json(result);
      return;
    }

    await models.Study.closeStudy(study.idx);

    const result = {
      status: 200,
      message: '스터디 마감 성공',
    };
    res.status(200).json(result);
    logger.green('[study - closeStudy] 스터디 마감 성공');
  } catch (error) {
    logger.red(`[study - closeStudy] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 마감 실패',
    };
    res.status(500).json(result);
  }
};

// 오늘 스터디를 끝넴
exports.endStudy = async (req, res) => {
  const { memberId } = req.decoded;
  const { studyIdx } = req.body;

  try {
    const study = await models.Study.getStudyByIdx(studyIdx);

    if (memberId !== study.memberId) {
      logger.yellow('[study - endStudy] 스터디 개설자가 아님');

      const result = {
        status: 403,
        message: '스터디 개설자만 스터디를 종료할 수 있습니다',
      };
      res.status(403).json(result);
      return;
    }

    // 참여 초기화
    await models.StudyPerson.update({
      status: 0,
    }, {
      where: {
        studyIdx: study.idx,
      },
    });

    const result = {
      status: 200,
      message: '스터디 종료 성공',
    };
    res.status(200).json(result);
    logger.green('[study - endStudy] 스터디 종료 성공');
  } catch (error) {
    console.log(error);
    logger.red(`[study - endStudy] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 종료 실패',
    };
    res.status(500).json(result);
  }
};

// 스터디 신청
exports.applyStudy = async (req, res) => {
  const { memberId } = req.decoded;
  const { studyIdx } = req.body;

  try {
    const study = await models.Study.findOne({ where: { idx: studyIdx }, raw: true });
    const studyPerson = await models.StudyPerson.getStudyPersonByIdx(studyIdx);

    if (study.personnel <= studyPerson.length) {
      const result = {
        status: 403,
        message: '이미 풀방인 스터디입니다',
      };
      res.status(403).json(result);
      return;
    }

    if (study.status === 1) {
      const result = {
        status: 403,
        message: '이미 진행중인 혹은 마감된 스터디입니다',
      };
      res.status(403).json(result);
      return;
    }

    for (person of studyPerson) {
      if (memberId === person.memberId) {
        const result = {
          status: 403,
          message: '이미 신청을 한 스터디입니다',
        };
        res.status(403).json(result);
        return;
      }
    }

    await models.StudyPerson.applyStudy(memberId, study.idx);

    const result = {
      status: 200,
      message: '스터디 신청 성공',
      data: `/study/${study.idx}/${memberId}`,
    };
    res.status(200).json(result);
    logger.green('[study - applyStudy] 스터디 신청 성공');
  } catch (error) {
    logger.red(`[study - applyStudy] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 신청 실패',
    };
    res.status(500).json(result);
  }
};
