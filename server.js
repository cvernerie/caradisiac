const express = require('express');
const app = express();

const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200'
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/populate', function (req, res) {

    async function getApiBrands() {
        const brands = await getBrands();
        return brands;
    }

    console.log("Indexing models from node-car-api in ES index...")

    getApiBrands().then(brands => {
        brands.forEach(async brand => {
            const models = await getModels(brand)
            models.forEach(model => {
                client.create({
                    index: 'caradisiac',
                    type: 'model',
                    id: model.uuid,
                    body: model
                }, function (error, response) {
                    if(error) {
                        console.log(error);
                    }
                })
            })
        })
    }).catch(error => {
        console.log(error)
    })
})

app.get('/suv/:size/:offset', function (req, res) {
    var results = []
    client.search({
        index: 'caradisiac',
        type: 'model',
        body: {
            size: req.params.size,
            offset: req.params.offset,
            query: {
                match_all: {},
            },
            sort: {
                "volume.keyword": {
                    order: "desc"
                }
            }
        }
    }).then(res => {
        res.hits.hits.forEach(model => {
            results.push(model['_source']);
        });
    }, err => {
        console.log(err.message);
    }).then(() => {
        res.json(results);
    });
})

app.listen(9292, function () {
    console.log('Express server is listening on port 9292!')
});
