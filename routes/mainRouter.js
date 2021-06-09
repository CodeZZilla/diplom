const express = require('express');
const startController = require('../controllers/startController');

const mainRouter = express.Router();

mainRouter.get('/', startController.getStartPage )

module.exports = mainRouter;