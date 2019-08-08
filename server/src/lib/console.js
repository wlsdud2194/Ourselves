const colors = require('colors');
const { logger } = require('../logApi/logApi.ctrl');

exports.red = (...str) => {
  const log = str.join(' ');

  logger.debug(log);
  console.log(colors.red(log));
};

exports.green = (...str) => {
  const log = str.join(' ');

  logger.debug(log);
  console.log(colors.green(log));
};

exports.yellow = (...str) => {
  const log = str.join(' ');

  logger.debug(log);
  console.log(colors.yellow(log));
};

exports.cyan = (...str) => {
  const log = str.join(' ');

  logger.debug(log);
  console.log(colors.cyan(log));
};

exports.gray = (...str) => {
  const log = str.join(' ');

  logger.debug(log);
  console.log(colors.gray(log));
};

exports.grey = (...str) => {
  const log = str.join(' ');

  logger.debug(log);
  console.log(colors.grey(log));
};
