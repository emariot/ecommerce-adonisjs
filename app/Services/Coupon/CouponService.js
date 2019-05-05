"use strict";
//Camada de Serviços

class CouponService {
  constructor(model, trx = null) {
    this.model = model;
    this.trx = trx;
  }

  async syncUsers(users) {
    if (!Array.isArray(users)) {
      return false;
    }
    await this.model.users().sync(users, null, this.trx);
  }

  async syncOrders(ordens) {
    if (!Array.isArray(ordens)) {
      return false;
    }
    await this.model.ordens().sync(ordens, null, this.trx);
  }
  async syncProducts(products) {
    if (!Array.isArray(products)) {
      return false;
    }
    await this.model.products().sync(products, null, this.trx);
  }
}

module.exports = CouponService;
