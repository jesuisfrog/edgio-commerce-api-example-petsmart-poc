const fs = require('fs-extra')
const axios = require('axios')
const cheerio = require('cheerio')
const imageDomain = 'https://petsmart-edgio-ecommerce-api-example-petsmart-poc-default.layer0-limelight.link'

/*
    Format:
        name: String
        path: lower case string with slashes
        description: Description in ul classes
        prices: { price: { value: 80, currencyCode: 'USD' }, salePrice: null, retailPrice: null },
        images: [ { url }, { url }, ... ]
        slug: path with removed slashes
        price: { value: 80, currencyCode: 'USD' },
*/
const products = {}

const getProducts = async () => {
    const { data } = await axios.request({
        url: 'https://www.petsmart.com/dog/food/',
        method: 'get',
        // headers: {
        //     Cookie:
        //         'pcc_bpc=RLuvxSmozHSNx7c7ZMQVys+ee0dwmkvG2eqvEMA5bGn3GOnypNqaNHDxTiUFvd/lyFrUaHNn4D/bYILoDodtsqxaR0wAK5qNqT/aEcgYx9TOaAAgt5cIM2GAJuf9/e8jNORu5yxs8/LrOxNtp/R4l4lhUOohZYe22LrAeME9B9oEywZgN+NqHLa+Wyq77OqiMtX8k1c379gZVIAKqX8qOeqpxSUcUsOaO+/6VcLT3esESYI3egaewTDtXjXTJiN7l/QrZrFfRhW/jLfzgonHu6rCu0l7FN9XDWN3+kanaKgQpFOReyIGCNLpnkghuk7U8hgANt7RFjU+jrrsHPlRsqjGXNcbRgDKxSbAX/4o6787QFIzOzLPl5gYO4lq+l8rJhyGEUJQOX7wdequrBNnJRUHtYvgmc6X0BepgwXkmUmhXmrEfsN9Pqb8pEDbsTrwORWXQr5fV+nbwjZKzfnV1v2N+ArSjsJCdOAw3x1pJYkILyoAt5lofr+ZNh0C4B89PBCYdvy8LhpVe+ARsFTZdFqilOL0eGWy6WdHji1zYkF0CDKYD9E9EyeJaLBSdoRZ7ggOmP49rTtgbRUVh7mrBVMgPIoSYa3CSTLN0VvU0vM=;',
        // },
    })
    let $ = cheerio.load(data)
    let pdpLinks = {}
    $('.grid-tile').each((i, el) => {
        if(i > 15) return;
        let itemName = $(el).find('.product-name').find('h3').text()
        pdpLinks[$(el).find('a').attr('href')] = { name: itemName }
        let itemPrice = $(el).find('.price-regular').attr('data-gtm-price')
        let slug = itemName
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
        let path = `/${slug}/`
        products[itemName] = {
            path,
            slug,
            name: itemName,
            prices: {
                price: { value: itemPrice, currencyCode: "$"},
            },
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
    
        const pdpImageUrls = [`PetSmart/${sku}`, `PetSmart/${sku}_alt1`, `PetSmart/${sku}_alt2`];
        //`https://s7d2.scene7.com/is/image/PetSmart?req=set,json,UTF-8&imageSet=(PetSmart/${sku}_Imageset)`

        products[pdpLinks[i]['name']]['images'] = []
        pdpImageUrls.forEach((el, _) => {
            const imageSrc = `https://s7d2.scene7.com/is/image/${el}`;
            let imagePath = `/images/products/${products[pdpLinks[i]['name']].slug}/${_}.png`
            axios
                .get(imageSrc, {
                    responseType: 'arraybuffer',
                })
                .then((response) => Buffer.from(response.data, 'base64'))
                .then((res) => {
                    fs.outputFile(`.${imagePath}`, res)
                        .then(() => {
                            console.log('✅')
                            products[pdpLinks[i]['name']]['images'].push({ url: `${imageDomain}${imagePath}` })
                        })
                        .catch(console.log)
                }).catch((error) => {
                    console.log('Image Not Found')
                })
        })
        const productDataUrl = `https://www.petsmart.com/dw/shop/v18_8/products/${sku}?client_id=11d422c1-e017-4692-8ade-c0d36191da29`
        // const config = {
        //     Headers: {
        //         Host: 'www.petsmart.com',
        //         Accept: '*/*',
        //         'Accept-Encoding': 'gzip, deflate, br',
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
        //         Connection : 'keep-alive',
        //         Cookie: 'SSLB=1; StoreCookie=1394; ak_bmsc=98E054AB9096C08848E16EA1D1E77FB4~000000000000000000000000000000~YAAQPKbcF93IwiiGAQAAmbc8YhLXCUoKDRTG66IdJJ1Vwd0bpzuxTLOJliSODro0LuPxiE6qhVBEvhAnDAUyl9z7CCEIw8+wLwaN0Eas/6vooFZRa5qI+l4OMC9TVjU1ToeXnMc6XwB1ignBnM7bmApiQb3NVToBwZ5Mto8X9xOQeqYGq1DOIApJxonmLn21DMhD6CoCD/6RWeUJwVi3olFjjwxHtHbmxuymlmdH6hJFhN+81MVaKidIiHReoP1BDdyc/aOz65CfsqQOPDOc1A3qGGYZAO6y0r3ACNvE4+5D6SZ4OIc7mSkpTOtbWcCF+5kkLXYV5r5xAomJ0n1LbQgjJJNOMjalW/hdhOt3ST/aOH9pIcZ12XQ+cg5OD6DT1J0GzQ==; bm_mi=79303B7173E4E0C2EC38C3E53138269F~YAAQBe0BF0hFBlOGAQAAvaTvYRI/L7SiwFAC/dXgPxJ6JlLbiPi8Dw9Um7ji/Vt5TLdywuD8YZA59/qnDGp9urMemTktGLPowD99D0tQWF5+4FgOQ5lynvD0XAlGVZzkD0uzXvt58mkWcKrSu8SIt0eUueXmeyOErVTA4vSRw7//iKmyra5JJxRGE2dhfPR5zJO+H0X+N3yAGAjTLHmBHVnXYkq2HA54tiSkwtwpvnic1f8lnVBsVWfPv7wOnIOZjpBXxO9l5Pb/bffw1l+gaP2vK+xWZuGWMd4DYapRvIMQj1IUztNOqMb/kLFiu3qdGXZ9qD1QS5RIcCyUbMLS2xNSYBHD2FfyTk+1UBJ7gjtFyGAbaEsJbzjuGZPfGO1/kO+CuP6wVF/Ow59xvysVwltMQ4t5+42uyH7CW13i11mkCCtr40exTw==~1; bm_sv=1C9EE45149E2D7C105273F446BE535A1~YAAQPKbcFx4NwyiGAQAAqF1BYhJno+riSNLYiIjCrRwiNg2JqfYfIPJ9udYmMiea4AMgWJZqddYyLK39e31nceaFAixoynai4ne+l4DjmmRE3ltZkEQnVryBX2DS4XseFw0eR8pPHYHCLEPGV6coPYFK8dFiyUvwFWdk3gZEpgJ7rEirC4tXKDZtheE/UHARoC8rRBJsVJ+eciOBK07wE9gPSHkMa7ngotfr3pasoXbY3a/mRvDD2IJ/bBhBqAcSMQLe~1; __cq_dnt=0; cqcid=acUy5VHRzD0VOEBKaXAa8KZjZi; cquid=||; dw_dnt=0; dwac_8bff7774ac20a09cf0c47379d7=VjNzEdIsrw0SS-IwyiIIjfSDUSIgwq-M9rs%3D|dw-only|||USD|false|US%2FMountain|true; dwanonymous_97eb123f58861ca0e85c8ab7da0243f7=acUy5VHRzD0VOEBKaXAa8KZjZi; dwsid=RIYNCF10531ahtnaUJktz-Y2Lzuvmuf8vnYzXIBI6bVydJ9Gei7xaemwtqsdKnJWARkhJ18L6cBtcHHyhdnHSw==; sid=VjNzEdIsrw0SS-IwyiIIjfSDUSIgwq-M9rs'
        //         }
        // }
        try {
            const productData =  await axios.get(productDataUrl)
            const description = productData.data.long_description;
            products[pdpLinks[i]['name']]['description'] = description;
        } catch (error) {
            console.log("error: " + error)
        }
    }
    try {
        fs.outputFile('./data.js', `export const products= ${JSON.stringify(products)}`)
        console.log('✅')
    } catch (e) {
        console.log(e)
    }
}

getProducts()
