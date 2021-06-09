const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    group: {type: String},
    course: {type: String},
    form: {type: String},
    specialty: {type: String},
    type: {type: String},
    status: {type: String},
    date: {type: Date},
    year: {type: String},
    gender: {type: String},
    country: {type: String},
    region: {type: String},
    district: {type: String},
    locality: {type: String}
});

module.exports = model("Note", schema);