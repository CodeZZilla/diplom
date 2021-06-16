const reader = require('xlsx');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');


exports.getStartPage = async function (req, res) {
    res.render('index');
};

exports.getData = async function (req, res) {

    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = [];
            all = JSON.parse(data);
            let output = new Map();
            if (all.length !== 0) {
                for (let item of all) {
                    if (item.Region === undefined) {
                        continue;
                    } else {
                        if (output.has(item.Region.trim().split(' ')[0])) {
                            let val = output.get(item.Region.trim().split(' ')[0]);
                            output.set(item.Region.trim().split(' ')[0], val + 1);
                        } else {
                            output.set(item.Region.trim().split(' ')[0], 1);
                        }
                    }

                }
                let returnArr = [];
                for (let [key, value] of output.entries()) {
                    returnArr.push({region: key, count: value});
                }
                res.status(200).send(returnArr);
            }
        }
    });
    //let all = await Note.find({});
};

exports.postAddFile = async function (req, res) {
    const file = reader.readFile(path.resolve('uploads/' + req.file.originalname))

    // масив записей
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

    // await Note.remove({})
    // for await (let item of temp){
    //     await Note.create({
    //         group: item.Group,                    //Группа
    //         course: item.Course,                  //Курс
    //         form: item.FormOfStudy,               //Форма обучения
    //         specialty: item.Specialty,            //Специальность
    //         type: item.BasisOfTraining,           //Основание обучения
    //         status: item.Status,                  //Статус
    //         date: item.DateOfEnrollmentOrder,     //Дата приказа о зачислении
    //         year: item.EnrollmentYear,            //Год зачисления
    //         gender: item.Gender,                  //Пол
    //         country: item.Country,                //Страна
    //         region: item.Region,                  //Регион
    //         district: item.District,              //Район
    //         locality: item.Locality,              //Населенный пункт
    //         citizenship: item.Citizenship,        //Гражданство
    //         level: item.LevelOfPreparation,       //Уровень подготовки
    //         faculty: item.Faculty,                //Факультет
    //         school: item.EducationalInstitution,  //Учебное заведение
    //         yearOfEnding: item.YearOfGraduation,  //Год окончания учебного заведения
    //         mark: item.AdmissionScore             //Балл поступления
    //     });
    // }
    // вывести все


    fs.writeFile(path.resolve('output.json'), JSON.stringify(temp), {flag: 'w+'}, err => {
        if (err) console.error(err);
    });

    fs.unlink(path.resolve('uploads/' + req.file.originalname), function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
    });
    res.send('Файл успешно загружен');
    //res.redirect('/');
};

exports.getYears = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = [];
            all = JSON.parse(data);
            let output = new Set();
            if (all.length !== 0) {
                for (let item of all) {
                    try {
                        if (item.EnrollmentYear.trim() === '')
                            continue;
                        output.add(item.EnrollmentYear.trim());
                    } finally {
                        continue;
                    }
                }

                let returnArr = [];
                for (let value of output) {
                    returnArr.push(value);
                }
                returnArr.sort();

                res.status(200).send(returnArr);
            }
        }
    });
};

exports.getBasisOfTraining = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = [];
            all = JSON.parse(data);
            let output = new Set();
            if (all.length !== 0) {
                for (let item of all) {
                    try {
                        output.add(item.BasisOfTraining.trim());
                    } finally {
                        continue;
                    }
                }

                let returnArr = [];
                for (let value of output) {
                    returnArr.push(value);
                }
                returnArr.sort();

                res.status(200).send(returnArr);
            }
        }
    });
};

exports.getFormOfStudy = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = [];
            all = JSON.parse(data);
            let output = new Set();
            if (all.length !== 0) {
                for (let item of all) {
                    try {
                        if (item.FormOfStudy === undefined) {
                            continue;
                        }
                        output.add(item.FormOfStudy.trim());
                    } finally {
                        continue;
                    }
                }


                let returnArr = [];
                for (let value of output) {
                    returnArr.push(value);
                }
                returnArr.sort();

                res.status(200).send(returnArr);
            }
        }
    });
};

exports.getMinMaxMark = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = [];
            all = JSON.parse(data);
            let output = [];
            if (all.length !== 0) {
                for (let item of all) {
                    if (item === undefined)
                        continue;
                    if (isNaN(item.AdmissionScore * 1))
                        continue;
                    output.push(item.AdmissionScore * 1);
                }
                res.status(200).send([Math.min.apply(null, output), Math.max.apply(null, output)]);
            }
        }
    });
};

exports.postDataFilter = async function (req, res) {
    let year = req.body.year === '' ? [] : req.body.year;
    let basisOfTraining = req.body.basisOfTraining === '' ? [] : req.body.basisOfTraining;
    let formOfStudy = req.body.formOfStudy === '' ? [] : req.body.formOfStudy;
    let gender = req.body.gender === '' ? [] : req.body.gender;
    let min = req.body.min;
    let max = req.body.max;
    console.log(req.body);
    //res.send('ok');
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) console.error(err);
        let all = JSON.parse(data);
        let output = new Map();
        if (all.length !== 0) {
            let findArr = [];

            if(year.length === 0){
                findArr = all;
            }else {
                for (let item of all){
                    if(item.EnrollmentYear === undefined) continue;
                    for (let el of year){
                        if (item.EnrollmentYear === el){
                            findArr.push(item);
                        }
                    }
                }
            }

            if(basisOfTraining.length !== 0){
                let tmps = [];
                for (let item of findArr){
                    if(item.BasisOfTraining === undefined) continue;
                    for (let el of basisOfTraining){
                        if (item.BasisOfTraining === el){
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if(formOfStudy.length !== 0){
                let tmps = [];
                for (let item of findArr){
                    if(item.FormOfStudy === undefined) continue;
                    for (let el of formOfStudy){
                        if (item.FormOfStudy === el){
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if(gender.length !== 0){
                let tmps = [];
                for (let item of findArr){
                    if(item.Gender === undefined) continue;
                    for (let el of gender){
                        if (item.Gender === el){
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            for (let item of findArr){
                if(isNaN(item.AdmissionScore * 1) || item.Region === undefined) continue;

                if((item.AdmissionScore * 1) >= min && (item.AdmissionScore * 1) <= max){
                    if (output.has(item.Region.trim().split(' ')[0])) {
                        let val = output.get(item.Region.trim().split(' ')[0]);
                        output.set(item.Region.trim().split(' ')[0], val + 1);
                    } else {
                        output.set(item.Region.trim().split(' ')[0], 1);
                    }
                }
            }
        }
        let returnArr = [];
        for (let [key, value] of output.entries()) {
            returnArr.push({region: key, count: value});
        }
        res.status(200).send(returnArr);
    });
};

exports.getGeoFromName = async function(req, res){
    let name = req.query.name;
    console.log(name);
    res.send('ok');
}