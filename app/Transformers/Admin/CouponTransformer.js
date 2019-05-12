"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const UserTransformer = use("App/Transformers/Admin/UserTransformer");
const ProductTransformer = use("App/Transformers/Admin/ProductTransformer");
const OrderTransformer = use("App/Transformers/Admin/OrderTransformer");

/**
 * CouponTransformer class
 *
 * @class CouponTransformer
 * @constructor
 */
class CouponTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ["users", "products", "orders"];
  }
  transform(model) {
    coupon = coupon.toJSON();
    delete coupon.created_at;
    delete coupon.updated_at;

    return coupon;
  }

  includeUsers(coupon) {
    return this.collection(coupon.getRelated("users"), UserTransformer);
  }
  includeProduct(coupon) {
    return this.collection(coupon.getRelated("products"), ProductTransformer);
  }
  includeOrder(coupon) {
    return this.collection(coupon.getRelated("orders"), OrderTransformer);
  }
}

module.exports = CouponTransformer;
