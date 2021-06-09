const xlsx = require('node-xlsx');

exports.getStartPage = async function (req,res){
    res.render('index');
};

exports.postAddFile = async function (req,res){
    console.log(req.file);
};
