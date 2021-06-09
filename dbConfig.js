const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@cluster0.aqvqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connection to database established');
    }).catch(err => {
    console.log(`db error ${err.message}`);
    process.exit(-1);
});