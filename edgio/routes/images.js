import { allproducts } from '../../allproducts'

export const getImage = (router) => {
  router.get('/images/:path*', ({ cache, serveStatic, setResponseHeader }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    setResponseHeader('Access-Control-Allow-Origin', '*')
    setResponseHeader('Access-Control-Allow-Methods', 'GET')
    setResponseHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    serveStatic('images/:path*')
  })
  router.get('/product-images/:slug', ({ compute, cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 }, browser: false })
    compute((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      res.body = JSON.stringify(allproducts.find((i) => i.slug === req.params.slug).images)
      res.statusCode = 200
      res.statusMessage = 'OK'
    })
  })
}
