"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

/**
 * Rota de Admin
 */

Route.group(() => {
  /**
   * Categories and Product resource routes
   */
  Route.resource("categories", "CategoryesController").apiOnly();
  Route.resource("products", "ProductController").apiOnly();
  Route.resource("coupons", "CouponController").apiOnly();
  Route.resource("orders", "OrderController").apiOnly();
  Route.resource("images", "ImageController").apiOnly();
  Route.resource("users", "UserController").apiOnly();
})
  .prefix("v1/admin")
  .namespace("Admin");
