"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  image() {
    return this.belongsTo("App/Models/Image");
  }
  /**
   * Galeria de imagens do produto
   */
  images() {
    return this.belongsToMany("App/Models/Image");
  }
  /**
   * Categorias (produtos/categorias)
   */
  categories() {
    return this.belongsToMany("App/Models/Category");
  }
  /**
   * Relacionamento entre produtos e cupons de desconto
   */
  coupons() {
    return this.belongsToMany("App/Models/Coupon");
  }
}

module.exports = Product;
