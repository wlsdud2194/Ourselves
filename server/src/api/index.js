const api = require('express').Router();

const authMiddleware = require('../middleware/auth');

const auth = require('./auth');
const study = require('./study');
const location = require('./location');
const member = require('./member');
const upload = require('./upload');

api.use('/auth', auth);
api.use('/study', authMiddleware, study);
api.use('/location', authMiddleware, location);
api.use('/member', authMiddleware, member);
api.use('/upload', upload);

module.exports = api;
