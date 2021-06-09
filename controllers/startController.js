const reader = require('xlsx');
const fs = require('fs');
const path = require('path');

exports.getStartPage = async function (req, res) {
    res.render('index');
};

exports.postAddFile = async function (req, res) {
    const file = reader.readFile(path.resolve('uploads/' + req.file.originalname))

    // масив записей
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

    // вывести все
    console.log(temp);

    fs.unlink(path.resolve('uploads/' + req.file.originalname),function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
    });
};
