const reader = require('xlsx');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');

exports.getStartPage = async function (req, res) {
    res.render('index');
};

exports.getData = async function (req, res) {
    let all = await Note.find({});
    let output = new Map();
    for await (let item of all){
        if(item.region === undefined)
            continue;
        if(output.has(item.region.trim())){
            let val = output.get(item.region.trim());
            output.set(item.region.trim(), val + 1);
        }else {
            output.set(item.region.trim(), 1);
        }
    }
    let returnArr = [];
    for (let [key, value] of output.entries()) {
        returnArr.push({region: key, count: value});
    }
    res.status(200).send(returnArr);
};

exports.postAddFile = async function (req, res) {

    console.log(req.file);
    const file = reader.readFile(path.resolve('uploads/' + req.file.originalname))

    // масив записей
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

    await Note.remove({})
    for await (let item of temp){
        await Note.create({
            group: item.Group,                    //Группа
            course: item.Course,                  //Курс
            form: item.FormOfStudy,               //Форма обучения
            specialty: item.Specialty,            //Специальность
            type: item.BasisOfTraining,           //Основание обучения
            status: item.Status,                  //Статус
            date: item.DateOfEnrollmentOrder,     //Дата приказа о зачислении
            year: item.EnrollmentYear,            //Год зачисления
            gender: item.Gender,                  //Пол
            country: item.Country,                //Страна
            region: item.Region,                  //Регион
            district: item.District,              //Район
            locality: item.Locality,              //Населенный пункт
            citizenship: item.Citizenship,        //Гражданство
            level: item.LevelOfPreparation,       //Уровень подготовки
            faculty: item.Faculty,                //Факультет
            school: item.EducationalInstitution,  //Учебное заведение
            yearOfEnding: item.YearOfGraduation,  //Год окончания учебного заведения
            mark: item.AdmissionScore             //Балл поступления
        });
    }
    // вывести все
    console.log(temp);
    fs.unlink(path.resolve('uploads/' + req.file.originalname),function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
    });
    res.send('Файл успешно загружен');
    //res.redirect('/');
};
