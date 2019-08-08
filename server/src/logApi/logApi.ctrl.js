const fs = require('fs');
const winston = require('winston');

exports.getLog = (req, res) => {
  try {
    const data = fs.readFileSync('./log/req-res.log').toString();

    const content = `------- log 조회 ------- 조회 시간: ${new Date()}\n\n\n${data}`;

    res.status(200).set('Content-Type', 'text/plain').send(content);
  } catch (error) {
    res.status(200).set('Content-Type', 'text/plain').send('조회에 실패했습니다\n관리자 한테 가서 따지세요');
  }
};

exports.logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.File({ filename: 'log/req-res.log', level: 'debug' }),
  ],
});
