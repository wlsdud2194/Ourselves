const { URL } = require('url');
const models = require('../../models');
const lib = require('../../lib/token');
const logger = require('../../lib/console');
const { bucketUrl } = require('../../../configs/aws');

/**
 * @description 로그인 처리
 */
exports.login = async (req, res) => {
  const { body: { id, pw } } = req;

  if (!id || !pw) {
    const result = {
      status: 400,
      message: '아이디, 비밀번호를 다시 입력해주세요',
    };
    res.status(400).json(result);
    return;
  }

  try {
    let member = await models.Member.login(id, pw);

    if (!member) {
      const result = {
        status: 403,
        message: '아이디 혹은 비밀번호가 틀렸습니다',
      };
      res.status(403).json(result);
      return;
    }

    if (member.profileImg) {
      member.profileImg = new URL(member.profileImg, bucketUrl).href;
    }

    // 토큰 생성
    const token = await lib.createToken(member.id, member.auth);
    const refreshToken = await lib.createRefreshToken(member.id, member.auth);

    if (member.auth === 0) {
      const student = await models.Student.getStudentById(member.id);

      delete member.pw;
      delete member.auth;

      const result = {
        status: 200,
        message: '로그인 성공',
        data: {
          token,
          refreshToken,
          info: {
            ...member,
            grade: student.grade,
            class: student.class,
          },
        },
      };
  
      res.status(200).json(result);
      logger.green('[auth - login] 학생 로그인 성공');
    } else {
      delete member.pw;
      delete member.auth;

      const { group } = await models.Teacher.getTeacherById(member.id);

      const result = {
        status: 200,
        message: '로그인 성공',
        data: {
          token,
          refreshToken,
          info: {
            ...member,
            group,
          },
        },
      };

      res.status(200).json(result);
      logger.green('[auth - login] 선생님 로그인 성공');
    }
  } catch (error) {
    logger.red(`[auth - login] 서버에러 : ${error}`);
    const result = {
      status: 500,
      message: '로그인에 실패했습니다'
    };

    res.status(500).json(result);
  }
};

/**
 * @description 회원가입 처리
 */
exports.signUp = async (req, res) => {
  const { body } = req;

  try {
    if (body.grade && body.class) {
      body.auth = 0;
      await models.Member.signUp(body);
      await models.Student.signUp(body);
    } else if (body.group) {
      body.auth = 1;
      await models.Member.signUp(body);
      await models.Teacher.signUp(body);
    } else {
      logger.yellow('[auth - signUp] 존재하지 않는 회원 등급');
      const result = {
        status: 400,
        message: '잘못된 회원가입 요청',
      };
      res.status(400).json(result);
      return;
    }

    const result = {
      status: 200,
      message: '회원가입 성공',
    };
    res.status(200).json(result);
    logger.green('[auth - signUp] 회원가입 성공');
  } catch (error) {
    logger.red(`[auth - signUp] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '회원가입 실패',
    };
    res.status(500).json(result);
  }
};
