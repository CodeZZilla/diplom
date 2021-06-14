const express = require('express');
const startController = require('../controllers/startController');
const mainRouter = express.Router();
const multer = require("multer");

const storageConfig = multer.diskStorage({
    destination:(req,file, callback)=>{
        callback(null,'uploads');
    },
    filename:(req, file, callback)=>{
        callback(null,file.originalname);
    }
})
const upload = multer({storage:storageConfig})


mainRouter.get('/', startController.getStartPage)
mainRouter.post('/addFile',upload.single('filedata'), startController.postAddFile)
mainRouter.get('/getData', startController.getData)

module.exports = mainRouter;