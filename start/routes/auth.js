"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

/**
 * Rota de Autenticação
 */
Route.group(() => {
  Route.post("register", "AuthControler.register").as("auth.register");
  Route.post("login", "AuthControler.login").as("auth.login");
  Route.post("refresh", "AuthControler.refresh").as("auth.refresh");
  Route.post("logout", "AuthControler.logout").as("auth.logout");

  // restore password routes
  Route.post("reset-password", "AuthControler.forgot").as("auth.forgot");
  Route.get("reset-password", "AuthControler.remember").as("auth.remember");
  Route.put("reset-password", "AuthControler.reset").as("auth.reset");
})
  .prefix("v1/auth")
  .namespace("Auth");
