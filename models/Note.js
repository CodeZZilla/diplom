const {Schema, model} = require("mongoose");

//Схема(модель) одной записи в базе данных
const schema = new Schema({
    group: {type: String},       //Группа
    course: {type: String},      //Курс
    form: {type: String},        //Форма обучения
    specialty: {type: String},   //Специальность
    type: {type: String},        //Основание обучения
    status: {type: String},      //Статус
    date: {type: String},        //Дата приказа о зачислении
    year: {type: String},        //Год зачисления
    gender: {type: String},      //Пол
    country: {type: String},     //Страна
    region: {type: String},      //Регион
    district: {type: String},    //Район
    locality: {type: String},    //Населенный пункт
    citizenship: {type: String}, //Гражданство
    level: {type: String},       //Уровень подготовки
    faculty: {type: String},     //Факультет
    school: {type: String},      //Учебное заведение
    yearOfEnding: {type: String},//Год окончания учебного заведения
    mark: {type: String}         //Балл поступления
});

module.exports = model("Note", schema);