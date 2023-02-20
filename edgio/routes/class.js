import { getImage } from './images'
import PluginBase from '@edgio/core/plugins/PluginBase'
import { getAllProducts, getAllCatFood, getAllDogFood, getSpecificProduct } from './products'

export default class CustomRoutes extends PluginBase {
  onRegister(router) {
    getImage(router)
    getAllProducts(router)
    getAllCatFood(router)
    getAllDogFood(router)
    getSpecificProduct(router)
  }
}
