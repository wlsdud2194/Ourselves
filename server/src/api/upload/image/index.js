const path = require('path');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const router = require('express').Router();
const imgCtrl = require('./image.ctrl');
const {
  accessKeyId,
  secretAccessKey,
  region
} = require('../../../../configs/aws');

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'ano-community',
    acl: 'public-read',
    key: (req, file, cb) => {
      console.log(`${uuid()}${path.extname(file.originalname)}`);
      cb(null, `${uuid()}${path.extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 500000,
  },
});

router.route('/:type').post(upload.array('img'), imgCtrl.imgUpload);
router.route('/').post(upload.array('img'), imgCtrl.imgUpload);

module.exports = router;
