const reader = require('xlsx');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');
const YandexGeocoder = require("nodejs-yandex-geocoder");
const yandexGeocoder = new YandexGeocoder({apiKey: '98ff423c-6d27-4f1e-ab7f-81082a01a166'});


exports.getStartPage = async function (req, res) {
    res.render('index');
};

exports.getData = async function (req, res) {
    let all = [];
    fs.readFile('output.json', 'utf8' , (err, data) => {
        if (err) {
            console.error(err);
        }else {
            all = JSON.parse(data);
            //console.log(all);
            let output = new Map();
            for (let item of all){
                if(item.Region === undefined)
                    continue;
                if(output.has(item.Region.trim())){
                    let val = output.get(item.Region.trim());
                    output.set(item.Region.trim(), val + 1);
                }else {
                    output.set(item.Region.trim(), 1);
                }
            }
            let returnArr = [];
            for (let [key, value] of output.entries()) {
                returnArr.push({region: key, count: value});
            }

            console.log(returnArr[0].region)
            yandexGeocoder.resolve(returnArr[0].region, (err, collection) => {
                if (err) throw err;
                console.log(collection);
            });


            res.status(200).send(returnArr);
        }
    });
    //let all = await Note.find({});
};

exports.postAddFile = async function (req, res) {
    console.log(req.file);
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



    fs.writeFile(path.resolve('output.json'), JSON.stringify(temp),{ flag: 'w+' }, err => {
        if (err) console.error(err);
    });

    fs.unlink(path.resolve('uploads/' + req.file.originalname),function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
    });
    res.send('Файл успешно загружен');
    //res.redirect('/');
};
