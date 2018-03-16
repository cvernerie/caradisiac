const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

async function getApiBrands() {
    const brands = await getBrands();
    return brands;
}

async function getModelsForBrands(brands) {
    var modelsByBrand = [];
    for (let brand of brands) {
        console.log(brand);
        const models = await getModels(brand);
        modelsByBrand.push({
            brand: brand,
            models: models
        });
    }
    return modelsByBrand;
}

function getModelsForAllBrands() {
    getApiBrands().then(function (brands) {
        getModelsForBrands(brands).then(function (result) {
            return result;
        })
    });
}

getModelsForAllBrands().then(function (result) {
    console.log(result);
})

