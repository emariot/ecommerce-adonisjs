"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const UserTransformer = use("App/Transformers/Admin/UserTransformer");
const OrderItemTransformer = use("App/Transformers/Admin/OrderItemTransformer");
const DiscountTransformer = use("App/Transformers/Admin/DiscountTransformer");
const CouponTransformer = use("App/Transformers/Admin/CouponTransformer");

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
      status: order.status,
      date: order.created_at,
      total: order.total ? parseFloat(order.total.toFixed(2)) : 0,

      qty_items:
        order.__meta__ && order.__meta__.qty_items
          ? order.__meta__.qty_items
          : 0,

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
    return this.collection(order.getRelated("items"), OrderItemTransformer);
  }
  includeCoupons(order) {
    return this.collection(order.getRelated("coupons"), CouponTransformer);
  }
  includeDiscount(order) {
    return this.collection(order.getRelated("discounts"), DiscountTransformer);
  }
}

module.exports = OrderTransformer;
