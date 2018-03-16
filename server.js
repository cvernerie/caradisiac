const express = require('express');
const app = express();

const carApi = require('./node-car-api');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/populate', function (req, res) {
    carApi.getModelsForAllBrands(function (models) {
        res.send(models);
    })
})

app.listen(6969, function () {
    console.log('Express server is listening on port 6969!')
});
