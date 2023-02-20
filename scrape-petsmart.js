const fs = require('fs-extra')
const axios = require('axios')
const cheerio = require('cheerio')
const imageDomain = 'https://petsmart-edgio-ecommerce-api-example-petsmart-poc-default.layer0-limelight.link'

/*
    Format:
        name: String
        path: lower case string with slashes
        description: Description in ul classes
        images: [ { url }, { url }, ... ]
        slug: path with removed slashes
        price: { value: 80, currencyCode: 'USD' },
*/
const dogfood = {}
const catfood = {}
let allproducts = {}

const getDogFood = async () => {
    const { data } = await axios.request({
        url: 'https://www.petsmart.com/dog/food/',
        method: 'get',
    })
    let $ = cheerio.load(data)
    let pdpLinks = {}
    $('.grid-tile').each((i, el) => {
        if(i > 17) return;
        let itemName = $(el).find('.product-name').find('h3').text()
        pdpLinks[$(el).find('a').attr('href')] = { name: itemName }
        let itemPrice = $(el).find('.price-regular').attr('data-gtm-price')
        let slug = itemName
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
        let path = `/${slug}/`
        dogfood[itemName] = {
            path,
            slug,
            name: itemName,
            price: {
                value: itemPrice,
                currencyCode: "$",
            },
        }
    })

    for (const i of Object.keys(pdpLinks)) {
        let url = i.split('?')[0]

        if (url.includes('http')) {
        } else {
            url = `https://www.petsmart.com${url}`
        }
        const { data } = await axios.request({
            url,
            method: 'get',
        })
        $ = cheerio.load(data)
        //Only grab the first product images for demo purposes
        const pdpJson = JSON.parse($('script[type="application/ld+json"]').first().html())
        const sku = pdpJson.sku;
    
        let pdpImageUrls = [];
        //`https://s7d2.scene7.com/is/image/PetSmart?req=set,json,UTF-8&imageSet=(PetSmart/${sku}_Imageset)`
        try {
            const imagesData = await axios.get(`https://s7d2.scene7.com/is/image/PetSmart?req=set,json,UTF-8&imageSet=(PetSmart/${sku}_Imageset)`)
            let imagesJson = imagesData.data.substring(imagesData.data.indexOf('{'), imagesData.data.lastIndexOf('}')+1);
            imagesJson = JSON.parse(imagesJson);
            pdpImageUrls = imagesJson.set.item.map(item => item.i.n)
        } catch (error) {
            console.log("error: " + error)
        }
        dogfood[pdpLinks[i]['name']]['images'] = []
        pdpImageUrls.forEach((el, _) => {
            const imageSrc = `https://s7d2.scene7.com/is/image/${el}`;
            let imagePath = `/images/products/${dogfood[pdpLinks[i]['name']].slug}/${_}.png`
            axios
                .get(imageSrc, {
                    responseType: 'arraybuffer',
                })
                .then((response) => Buffer.from(response.data, 'base64'))
                .then((res) => {
                    fs.outputFile(`.${imagePath}`, res)
                        .then(() => {
                            console.log('✅')
                            dogfood[pdpLinks[i]['name']]['images'].push({ url: `${imageDomain}${imagePath}` })
                        })
                        .catch(console.log)
                }).catch((error) => {
                    console.log('Image Not Found')
                })
        })
        const productDataUrl = `https://www.petsmart.com/dw/shop/v18_8/products/${sku}?client_id=11d422c1-e017-4692-8ade-c0d36191da29`
        try {
            const productData =  await axios.get(productDataUrl)
            const description = productData.data.long_description;
            dogfood[pdpLinks[i]['name']]['description'] = description;
        } catch (error) {
            console.log("error: " + error)
        }
    }
    try {
        fs.outputFile('./dogfood.js', `export const dogfood= ${JSON.stringify(dogfood)}`)
        console.log('✅')
    } catch (e) {
        console.log(e)
    }
}

const getCatFood = async () => {
    const { data } = await axios.request({
        url: 'https://www.petsmart.com/cat/food-and-treats/',
        method: 'get',
    })
    let $ = cheerio.load(data)
    let pdpLinks = {}
    $('.grid-tile').each((i, el) => {
        if (i > 17) return;
        let itemName = $(el).find('.product-name').find('h3').text()
        pdpLinks[$(el).find('a').attr('href')] = { name: itemName }
        let itemPrice = $(el).find('.price-regular').attr('data-gtm-price')
        let slug = itemName
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
        let path = `/${slug}/`
        catfood[itemName] = {
            path,
            slug,
            name: itemName,
            price: {
                value: itemPrice,
                currencyCode: "$",
            },
        }
    })

    for (const i of Object.keys(pdpLinks)) {
        let url = i.split('?')[0]

        if (url.includes('http')) {
        } else {
            url = `https://www.petsmart.com${url}`
        }
        const { data } = await axios.request({
            url,
            method: 'get',
        })
        $ = cheerio.load(data)
        //Only grab the first product images for demo purposes
        const pdpJson = JSON.parse($('script[type="application/ld+json"]').first().html())
        const sku = pdpJson.sku;

        let pdpImageUrls = [];
        //`https://s7d2.scene7.com/is/image/PetSmart?req=set,json,UTF-8&imageSet=(PetSmart/${sku}_Imageset)`
        try {
            const imagesData = await axios.get(`https://s7d2.scene7.com/is/image/PetSmart?req=set,json,UTF-8&imageSet=(PetSmart/${sku}_Imageset)`)
            let imagesJson = imagesData.data.substring(imagesData.data.indexOf('{'), imagesData.data.lastIndexOf('}') + 1);
            imagesJson = JSON.parse(imagesJson);
            pdpImageUrls = imagesJson.set.item.map(item => item.i.n)
        } catch (error) {
            console.log("error: " + error)
        }
        catfood[pdpLinks[i]['name']]['images'] = []
        pdpImageUrls.forEach((el, _) => {
            const imageSrc = `https://s7d2.scene7.com/is/image/${el}`;
            let imagePath = `/images/products/${catfood[pdpLinks[i]['name']].slug}/${_}.png`
            axios
                .get(imageSrc, {
                    responseType: 'arraybuffer',
                })
                .then((response) => Buffer.from(response.data, 'base64'))
                .then((res) => {
                    fs.outputFile(`.${imagePath}`, res)
                        .then(() => {
                            console.log('✅')
                            catfood[pdpLinks[i]['name']]['images'].push({ url: `${imageDomain}${imagePath}` })
                        })
                        .catch(console.log)
                }).catch((error) => {
                    console.log('Image Not Found')
                })
        })
        const productDataUrl = `https://www.petsmart.com/dw/shop/v18_8/products/${sku}?client_id=11d422c1-e017-4692-8ade-c0d36191da29`
        try {
            const productData = await axios.get(productDataUrl)
            const description = productData.data.long_description;
            catfood[pdpLinks[i]['name']]['description'] = description;
        } catch (error) {
            console.log("error: " + error)
        }
    }
    try {
        fs.outputFile('./catfood.js', `export const catfood= ${JSON.stringify(catfood)}`)
        console.log('✅')
    } catch (e) {
        console.log(e)
    }
    allproducts = Object.assign({}, catfood, dogfood);
    try {
        fs.outputFile('./allproducts.js', `export const allproducts= ${JSON.stringify(allproducts)}`)
        console.log('✅')
    } catch (e) {
        console.log(e)
    }
}


getDogFood()
getCatFood()
