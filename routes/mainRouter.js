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
mainRouter.get('/getYears', startController.getYears)
mainRouter.get('/getBasisOfTraining', startController.getBasisOfTraining)
mainRouter.get('/getFormOfStudy', startController.getFormOfStudy)
mainRouter.get('/getMinMaxMark', startController.getMinMaxMark)
mainRouter.get('/getSpecialty', startController.getSpecialty)
mainRouter.post('/postDataFilter', startController.postDataFilter)
mainRouter.post('/postGeoFromName', startController.postGeoFromName)
mainRouter.get('/getGeoSave', startController.getGeoSave)

module.exports = mainRouter;