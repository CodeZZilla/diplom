//подключение модулей
const reader = require('xlsx');
const fs = require('fs');//для работы с файловой системой
const path = require('path');
const nodeGeocoder = require('node-geocoder');
const Note = require('../models/Note');//модель базы данных
let options = {
    provider: 'openstreetmap'
};
let geoCoder = nodeGeocoder(options);//геокодер

//вывод главной страницы
exports.getStartPage = async function (req, res) {
    res.render('index');
};

//вывод всех данных, которые есть на главную страницу
exports.getData = async function (req, res) {

    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = JSON.parse(data);//парсим данные з джейсона
            let output = new Map();
            //подсчет количества студентов по регионам
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
                let returnArr = [];//массив возврата
                for (let [key, value] of output.entries()) {
                    returnArr.push({region: key, count: value});
                }
                res.status(200).send(returnArr);//отправляем на view
            }
        }
    });
    //let all = await Note.find({});
};

//пост запрос сохранения информации с файла
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

    //записать массив
    fs.writeFile(path.resolve('output.json'), JSON.stringify(temp), {flag: 'w+'}, err => {
        if (err) console.error(err);
    });

    //удалить временный файл
    fs.unlink(path.resolve('uploads/' + req.file.originalname), function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
    });
    //отправить отчёт
    res.send('Файл успешно загружен');
    //res.redirect('/');
};

// гет запрос на возврат  массива уникальных годов
exports.getYears = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = JSON.parse(data);
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
                returnArr.sort();//сортировка

                res.status(200).send(returnArr);//отправка массива на view
            }
        }
    });
};

// гет запрос на возврат  массива с уникальными основаниями обучения,аналог предыдущего
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

//аналог предыдущего
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

//аналог предыдущего
exports.getSpecialty = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = JSON.parse(data);
            let output = new Set();
            if (all.length !== 0) {
                for (let item of all) {
                    try {
                        if (item.Specialty === undefined) continue;
                        output.add(item.Specialty.trim());
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

//гет запрос на возврат минимального и максимального бала
exports.getMinMaxMark = async function (req, res) {
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let all = JSON.parse(data);
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

//пост запрос фильтр , возврат отфильтрованых геоданных
exports.postDataFilter = async function (req, res) {
    let year = req.body.year === '' ? [] : req.body.year;
    let basisOfTraining = req.body.basisOfTraining === '' ? [] : req.body.basisOfTraining;
    let formOfStudy = req.body.formOfStudy === '' ? [] : req.body.formOfStudy;
    let gender = req.body.gender === '' ? [] : req.body.gender;
    let specialty = req.body.specialty === '' ? [] : req.body.specialty;
    let min = req.body.min;
    let max = req.body.max;
    console.log(req.body);
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) console.error(err);
        let all = JSON.parse(data);
        let output = new Map();
        if (all.length !== 0) {
            let findArr = [];

            if (year.length === 0) {
                findArr = all;
            } else {
                for (let item of all) {
                    if (item.EnrollmentYear === undefined) continue;
                    for (let el of year) {
                        if (item.EnrollmentYear === el) {
                            findArr.push(item);
                        }
                    }
                }
            }

            if (basisOfTraining.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.BasisOfTraining === undefined) continue;
                    for (let el of basisOfTraining) {
                        if (item.BasisOfTraining === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if (specialty.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.Specialty === undefined) continue;
                    for (let el of specialty) {
                        if (item.Specialty === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if (formOfStudy.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.FormOfStudy === undefined) continue;
                    for (let el of formOfStudy) {
                        if (item.FormOfStudy === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if (gender.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.Gender === undefined) continue;
                    for (let el of gender) {
                        if (item.Gender === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            for (let item of findArr) {
                if (isNaN(item.AdmissionScore * 1) || item.Region === undefined) continue;

                if ((item.AdmissionScore * 1) >= min && (item.AdmissionScore * 1) <= max) {
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

//пост запрос фильтр , возврат отфильтрованых геоданных по региону
exports.postGeoFromName = async function (req, res) {
    let year = req.body.year === '' ? [] : req.body.year;
    let name = req.body.nameRegion;
    let basisOfTraining = req.body.basisOfTraining === '' ? [] : req.body.basisOfTraining;
    let formOfStudy = req.body.formOfStudy === '' ? [] : req.body.formOfStudy;
    let gender = req.body.gender === '' ? [] : req.body.gender;
    let specialty = req.body.specialty === '' ? [] : req.body.specialty;
    let min = req.body.min;
    let max = req.body.max;

    fs.readFile('output.json', 'utf8', async (err, data) => {
        if (err) console.error(err);
        let all = JSON.parse(data);
        let output = new Map();
        if (all.length !== 0) {
            let findArr = [];

            if (year.length === 0) {
                findArr = all;
            } else {
                for (let item of all) {
                    if (item.EnrollmentYear === undefined) continue;
                    for (let el of year) {
                        if (item.EnrollmentYear === el) {
                            findArr.push(item);
                        }
                    }
                }
            }

            if (basisOfTraining.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.BasisOfTraining === undefined) continue;
                    for (let el of basisOfTraining) {
                        if (item.BasisOfTraining === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if (specialty.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.Specialty === undefined) continue;
                    for (let el of specialty) {
                        if (item.Specialty === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if (formOfStudy.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.FormOfStudy === undefined) continue;
                    for (let el of formOfStudy) {
                        if (item.FormOfStudy === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            if (gender.length !== 0) {
                let tmps = [];
                for (let item of findArr) {
                    if (item.Gender === undefined) continue;
                    for (let el of gender) {
                        if (item.Gender === el) {
                            tmps.push(item);
                        }
                    }
                }
                findArr = tmps;
            }

            for (let item of findArr) {
                if (isNaN(item.AdmissionScore * 1) || item.Region === undefined) continue;

                if (item.Region.trim().split(' ')[0] === name) {
                    if ((item.AdmissionScore * 1) >= min && (item.AdmissionScore * 1) <= max) {

                        let adress = (item.Region.trim().split(' ')[0]) +
                            (item.District !== undefined ? (', ' + item.District.trim()) : '') +
                            (item.Locality !== undefined ? (', ' + item.Locality.trim()) : '');

                        if (output.has(adress)) {
                            let val = output.get(adress);
                            output.set(adress, val + 1);
                        } else {
                            output.set(adress, 1);
                        }
                    }
                }
            }
        }

        let fileData = fs.readFileSync("geoInfoMap.json", "utf8");
        let allDataGeo = JSON.parse(fileData);
        let mapGeoSaveData = new Map();
        for (let item of allDataGeo) {
            mapGeoSaveData.set(item.key, item.value);
        }

        let returnArr = [];
        let j = 1;
        for (let [key, value] of output.entries()) {
            let el = '';
            if (mapGeoSaveData.has(key) && mapGeoSaveData.get(key) !== '') {
                el = mapGeoSaveData.get(key);
                returnArr.push({region: key, geo: el, count: value});
                console.log(j++);
            } else {
                try {
                    el = await geoCoder.geocode(key);
                } finally {
                    returnArr.push({region: key, geo: el, count: value});
                    console.log(j++);
                }
            }
        }

        res.status(200).send(returnArr);
    });
}

//сохранение гео-данных в програме (серелизация уникальных данных)
exports.getGeoSave = function (req, res) {

    fs.readFile('output.json', 'utf8', async (err, data) => {
        if (err) console.error(err);

        let fileData = fs.readFileSync("geoInfoMap.json", "utf8");
        let allDataGeo = JSON.parse(fileData);
        let mapGeoSaveData = new Map();
        for (let item of allDataGeo) {
            mapGeoSaveData.set(item.key, item.value);
        }

        let all = JSON.parse(data);
        let output = new Set();
        if (all.length !== 0) {
            for (let item of all) {
                if (item.Region === undefined) continue;

                let adress = (item.Region.trim().split(' ')[0]) +
                    (item.District !== undefined ? (', ' + item.District.trim()) : '') +
                    (item.Locality !== undefined ? (', ' + item.Locality.trim()) : '');

                if (mapGeoSaveData.has(adress)) {
                    continue;
                }

                if (output.has(adress)) {
                    output.add(adress);
                } else {
                    output.add(adress);
                }
            }
            console.log(output);
        }

        let returnMap = new Map();
        let j = 1;
        for (let item of output.values()) {
            let el = '';
            try {
                el = await geoCoder.geocode(item);
            } finally {
                returnMap.set(item, el);
                console.log(j++);
            }
        }

        let merged = new Map([...mapGeoSaveData, ...returnMap]);

        let returnArr = [];
        for (let [key, value] of merged.entries()) {
            returnArr.push({key: key, value: value});
        }

        fs.writeFileSync(path.resolve('geoInfoMap.json'), JSON.stringify(merged), {flag: 'w+'});
        res.status(200).send(returnArr);
    });

}

//данные для круглого графика (возвращает массив масивов)
exports.getDataPie = function (req, res) {
    fs.readFile('output.json', 'utf8', async (err, data) => {
        if (err) console.error(err);
        let all = JSON.parse(data);
        let output = new Map();
        //подсчет количества студентов по регионам
        if (all.length !== 0) {
            for (let item of all) {
                if (item.Region === undefined) {
                    continue;
                } else {
                    if (output.has(item.Region.trim())) {
                        let val = output.get(item.Region.trim());
                        output.set(item.Region.trim(), val + 1);
                    } else {
                        output.set(item.Region.trim(), 1);
                    }
                }

            }

            let returnTmpArr = [];//массив возврата
            for (let [key, value] of output.entries()) {
                returnTmpArr.push([key, value]);
            }
            returnTmpArr.sort = function (a, b) {
                return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
            }

            let returnArr = [];
            let tempItemCount = 0;
            for (let i = 0; i < returnTmpArr.length; i++) {
                if (i < 4) {
                    returnArr.push(returnTmpArr[i]);
                } else {
                    tempItemCount += returnTmpArr[i][1];
                }
            }
            returnArr.push(['Другие', tempItemCount]);

            res.status(200).send(returnArr);//отправляем на view
        }

    });
}

//данные для bar графика (возвращает массив масивов) - рейтинг балов по годам
exports.getDataBar = function (req, res) {
    fs.readFile('output.json', 'utf8', async (err, data) => {
        if (err) console.error(err);
        let all = JSON.parse(data);

        let years = new Set();
        let yearsArr = [];
        if (all.length !== 0) {
            for (let item of all) {
                try {
                    if (item.EnrollmentYear.trim() === '')
                        continue;
                    years.add(item.EnrollmentYear.trim());
                } finally {
                    continue;
                }
            }

            for (let value of years) {
                yearsArr.push(value);
            }
            yearsArr.sort();//сортировка
        }


        let output = new Map();
        //подсчет  средних балов по годам
        if (all.length !== 0) {
            for (let year of yearsArr) {
                let count = 0;
                let sum = 0;
                for (let item of all) {
                    try {
                        if (isNaN(item.AdmissionScore * 1) || item.EnrollmentYear.trim() === '') continue;

                        if (item.EnrollmentYear.trim() === year) {
                            sum += item.AdmissionScore * 1;
                            count += 1;
                        }
                    }catch{
                        continue;
                    }

                }
                try {
                    output.set(year, sum / count);
                } finally {
                    continue;
                }
            }

            let returnArr = [];//массив возврата
            for (let [key, value] of output.entries()) {
                if(isNaN(value)) continue;
                returnArr.push([key, Math.round(value)]);
            }

            res.status(200).send(returnArr);//отправляем на view
        }

    });
}

//данные для area графика (возвращает массив масивов) - поступившие по годам
exports.getDataArea = function (req, res) {
    fs.readFile('output.json', 'utf8', async (err, data) => {
        if (err) console.error(err);
        let all = JSON.parse(data);

        let years = new Set();
        let yearsArr = [];
        if (all.length !== 0) {
            for (let item of all) {
                try {
                    if (item.EnrollmentYear.trim() === '')
                        continue;
                    years.add(item.EnrollmentYear.trim());
                } finally {
                    continue;
                }
            }

            for (let value of years) {
                yearsArr.push(value);
            }
            yearsArr.sort();//сортировка
        }


        let output = new Map();
        //подсчет количества поступивших по годам
        if (all.length !== 0) {
            for (let year of yearsArr) {
                let count = 0;
                for (let item of all) {
                    try {
                        if (item.EnrollmentYear.trim() === '') continue;

                        if (item.EnrollmentYear.trim() === year) {
                            count += 1;
                        }
                    }catch {
                        continue;
                    }
                }
                try {
                    output.set(year, count);
                } finally {
                    continue;
                }
            }

            let returnArr = [];//массив возврата
            for (let [key, value] of output.entries()) {
                if(isNaN(value)) continue;
                returnArr.push([key, value]);
            }

            res.status(200).send(returnArr);//отправляем на view
        }

    });
}