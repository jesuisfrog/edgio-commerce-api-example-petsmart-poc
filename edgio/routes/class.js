import { getImage } from './images'
import PluginBase from '@edgio/core/plugins/PluginBase'
import { getAllProducts, getSpecificProduct } from './products'

export default class CustomRoutes extends PluginBase {
  onRegister(router) {
    getImage(router)
    getAllProducts(router)
    getSpecificProduct(router)
  }
}
