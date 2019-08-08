const models = require('../../models');
const logger = require('../../lib/console');

exports.getLocationList = async (req, res) => {
  try {
    let locationList = await models.Location.getAvailableLocation();

    locationList.forEach((location) => {
      console.log(new Date(location.endTerm) < new Date());

      if (new Date(location.endTerm) < new Date()) {
        location.status = 0;
      } else if (!location.status) {
        location.status = 0;
      } else {
        location.status = 1;
      }
    });

    const result = {
      status: 200,
      message: '위치정보 조회 성공',
      data: locationList,
    };
    res.status(200).json(result);
    logger.green('[location - get] 위치정보 조회 성공');
  } catch (error) {
    logger.red(`[location - get] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '위치 조회 실패',
    };
    res.status(500).json(result);
  }
};

exports.createLocation = async (req, res) => {
  const { place } = req.body;
  const { auth } = req.decoded;

  if (auth !== 1) {
    const result = {
      status: 403,
      message: '위치정보를 생성할 권한이 없습니다',
    };
    res.status(403).json(result);
    return;
  }

  try {
    await models.Location.create({ place });

    const result = {
      status: 200,
      message: '위치정보 생성 성공',
    };
    res.status(200).json(result);
    logger.green('[location - create] 위치정보 생성 성공');
  } catch (error) {
    logger.red(`[location - create] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '위치정보 생성 실패',
    };
    res.status(500).json(result);
  }
};

exports.updateLocation = async (req, res) => {
  const { auth } = req.decoded;
  const { place, placeIdx } = req.body;

  if (auth !== 1) {
    const result = {
      status: 403,
      message: '위치정보를 수정할 권한이 없습니다',
    };
    res.status(403).json(result);
    return;
  }

  try {
    const location = await models.Location.findOne({ where: { idx: placeIdx }, raw: true });

    if (!location) {
      const result = {
        status: 404,
        message: '존재하지 않는 장소입니다',
      };
      res.status(404).json(result);
      return;
    }

    await models.Location.update({
      place,
    }, {
      where: {
        idx: placeIdx,
      },
    });

    const result = {
      status: 200,
      message: '장소 수정 성공',
    };
    res.status(200).json(result);
    logger.green('[location - update] 장소 수정 성공');
  } catch (error) {
    logger.red(`[location - update] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '스터디 신청 실패',
    };
    res.status(500).json(result);
  }
};

exports.deleteLocation = async (req, res) => {
  const { auth } = req.decoded;
  const { placeIdx } = req.body;

  if (auth !== 1) {
    const result = {
      status: 403,
      message: '위치정보를 삭제할 권한이 없습니다',
    };
    res.status(403).json(result);
    return;
  }

  try {
    await models.Location.update({
      status: 0,
    }, {
      where: {
        idx: placeIdx,
      },
    });

    const result = {
      status: 200,
      message: '장소 삭제 성공',
    };
    res.status(200).json(result);
    logger.green('[location - delete] 장소 삭제 성공');
  } catch (error) {
    logger.red(`[location - delete] 서버에러 : ${error}`);

    const result = {
      status: 500,
      message: '위치 삭제 실패',
    };
    res.status(500).json(result);
  }
};
