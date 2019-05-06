"use strict";

const Database = use("Database");

class OrderService {
  constructor(model, trx = null) {
    this.model = model;
    this.trx = trx;
  }
  async syncItems(items) {
    if (!Array.isArray(items)) {
      return false;
    }
    await this.model.items().delete(this.trx);
    await this.model.items().createMany(items, this.trx);
  }

  async updateItems(items) {
    let currentItems = await this.model
      .items()
      .whereIn("id", items.map(item => item.id))
      .fetch();
    //deleta os items que o user não quer mais

    await this.model
      .items()
      .whereNotIn("id", items.map(item => item.id))
      .delete(this.trx);

    //Atualiza os valores e quantidades

    await Promise.all(
      currentItems.rows.map(async item => {
        item.fill(items.find(n => n.id === item.id));
        await item.save(this.trx);
      })
    );
  }

  async canApplyDiscount(coupon) {
    const couponProducts = await Database.from("coupon_products")
      .where("coupon_id", coupon.id)
      .pluck("product_id");

    const couponClients = await Database.from("coupon_user")
      .where("coupon_id", cooupon.id)
      .pluck("user_id");

    //Verificar se o cupom não esta associado a produtos e clientes específicos

    if (
      Array.isArray(couponProducts) &&
      couponProducts.length < 1 &&
      Array.isArray(couponClients) &&
      couponClients.length < 1
    ) {
      /**
       * Caso não esteja associado a cliente ou produto específico é de uso livre
       */
      return true;
    }

    let isAssociatedToProducts,
      isAssociatedToClient = false;

    if (Array.isArray(couponProducts) && couponProducts.length > 0) {
      isAssociatedToProducts = true;
    }
    if (Array.isArray(couponClients) && couponClients.length > 0) {
      isAssociatedToClient = true;
    }

    const productMatch = await Database.from("order_items")
      .where("order_id", this.model.id)
      .whereIn("product_id", couponProducts)
      .pluck("product_id");

    /**
     * Caso de uso 1 - O cupom esta associado a clientes & produtos
     */
    if (isAssociatedToClient && isAssociatedToProducts) {
      const clientMatch = couponClients.find(
        client => client === this.model.user_id
      );
      if (
        clientMatch &&
        Array.isArray(productMatch) &&
        productMatch.length > 0
      ) {
        return true;
      }
    }

    /**
     * Caso de uso 2 - O cupom esta apenas associado apenas a produto
     */

    if (
      isAssociatedToProducts &&
      Array.isArray(productMatch) &&
      productMatch.length > 0
    ) {
      return true;
    }

    /**
     * Caso de uso 3 - O cupom esta associado a um ou mais clientes (e nenhum produto)
     * */
    if (
      isAssociatedToClient &&
      Array.isArray(couponClients) &&
      couponClients.length > 0
    ) {
      const match = couponClients.find(client => client === this.model.user_id);
      if (match) {
        return true;
      }
    }

    /**
     * Caso nenhuma das verificações a cima deem positiva então o cupom esta associado a clientes ou produtos ou aos dois, porém nenhum dos produtos deste pedido está elegível ao desconto, e o cliente que fez a compra também não poderá utilizar este cupom
     */
    return false;
  }
}

module.exports = OrderService;
