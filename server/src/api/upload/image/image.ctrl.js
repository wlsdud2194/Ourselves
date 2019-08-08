const path = require('path');
const models = require('../../../models');
const logger = require('../../../lib/console');

exports.imgUpload = async (req, res) => {
  const { files } = req;
  const { type } = req.params;
  let imgs = [];

  try {
    console.log(files, type);
    if (type === 'post') {
      for (file of files) {
        const extname = path.extname(file.originalname).substr(1);
        await models.File.createFile(extname, file.key);

        imgs.push(file.key); 
      }
    } else if (Array.isArray(files)) {
      files.forEach((file) => {
        imgs.push(file.key); 
      });
    } else {
      const result = {
        status: 400,
        message: '존재하지 않는 이미지 업로드 형식',
      };
      res.status(400).json(result);
      return;
    }

    const result = {
      status: 200,
      message: '이미지 업로드 성공',
      data: imgs,
    };
    res.status(200).json(result);
    logger.green('이미지 업로드 성공');
  } catch (error) {
    logger.red('이미지 업로드 실패', error);
    const result = {
      status: 500,
      message: '이미지 업로드 실패',
    };
    res.status(500).json(result);
  }
};
