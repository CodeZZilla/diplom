const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dbDiplom', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connection to database established');
    }).catch(err => {
    console.log(`db error ${err.message}`);
    process.exit(-1);
});