"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const UserTransformer = use("App/Transformers/Admin/UserTransformer");

/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ["user", "coupons", "items", "discounts"];
  }
  transform(order) {
    order = order.toJSON();
    return {
      id: order.id,
      status: status.id,
      date: order.created_at,
      total: order.total ? parseFloat(order.total.toFixed(2)) : 0,
      qty_items:
        order.__meta__ && order.__meta__.qty_items ? order.qty_item : 0,

      discount:
        order.__meta__ && order.__meta__.discount ? order.__meta__.discount : 0,
      subtotal:
        order.__meta__ && order.__meta__.subtotal ? order.__meta__.subtotal : 0
    };
  }

  includeUser(order) {
    return this.item(order.getRelated("user"), UserTransformer);
  }
  includeItems(order) {
    return this.item(order.getRelated("items"), OrderItemTransformer);
  }
  includeCupouns(order) {
    return this.item(order.getRelated("coupons"), CouponTransformer);
  }
  includeDiscount(order) {
    return this.item(order.getRelated("discounts"), DiscountTransformer);
  }
}

module.exports = OrderTransformer;
