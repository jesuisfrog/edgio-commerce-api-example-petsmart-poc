import { catfood } from '../../catfood'
import { dogfood } from '../../dogfood'
import { catfoodCA } from '../../catfoodCA'
import { dogfoodCA } from '../../dogfoodCA'
import { allproducts } from '../../allproducts'

export const getAllProducts = (router) => {
  router.get('/products/all', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.body = JSON.stringify(allproducts)
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}

export const getAllDogFood = (router) => {
  router.get('/products/dogfood', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.body = JSON.stringify(dogfood)
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}

export const getAllCatFood = (router) => {
  router.get('/products/catfood', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.body = JSON.stringify(catfood)
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}

export const getAllCanadianDogFood = (router) => {
  router.get('/products/ca/dogfood', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.body = JSON.stringify(dogfoodCA)
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}

export const getAllCanadianCatFood = (router) => {
  router.get('/products/ca/catfood', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.body = JSON.stringify(catfoodCA)
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}

export const getSpecificProduct = (router) => {
  router.get('/products/:slug', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      const productsArray = Object.values(allproducts);
      const matchingProduct = productsArray.find((product) => product.slug === req.params.slug);
      res.body = JSON.stringify(matchingProduct);
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}
