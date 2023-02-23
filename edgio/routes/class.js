import { getImage } from './images'
import PluginBase from '@edgio/core/plugins/PluginBase'
import { getAllProducts, getAllCatFood, getAllDogFood, getSpecificProduct, getAllCanadianCatFood, getAllCanadianDogFood } from './products'

export default class CustomRoutes extends PluginBase {
  onRegister(router) {
    getImage(router)
    getAllProducts(router)
    getAllCatFood(router)
    getAllDogFood(router)
    getAllCanadianCatFood(router)
    getAllCanadianDogFood(router)
    getSpecificProduct(router)
  }
}
