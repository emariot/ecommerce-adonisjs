"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
const Transformer = use("App/Transformers/Admin/User/UserTransformer");

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Object} ctx.pagination
   */
  async index({ request, response, pagination, transform }) {
    const name = request.input("name");
    const query = User.query();

    if (name) {
      query.where("name", "ILIKE", `%${name}%`);
      query.orWhere("surname", "ILIKE", `%${name}%`);
      query.orWhere("email", "ILIKE", `%${name}%`);
    }

    var users = await query.paginate(pagination.page, pagination.limit);
    users = await transform.paginate(users, Transformer);
    return response.send(users);
  }
  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    try {
      const userData = request.only([
        "name",
        "surname",
        "email",
        "password",
        "image_id"
      ]);

      var user = await User.create(userData);
      users = await transform.item(users, Transformer);

      return response.status(200).send(user);
    } catch (error) {
      return response
        .status(400)
        .send({ message: "Não foi possível criar o usuário no momento" });
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
  
   */
  async show({ params: { id }, transform, response }) {
    var user = await User.findOrFail(id);
    users = await transform.item(users, Transformer);

    return response.send(user);
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response, transform }) {
    var user = await User.findOrFail(id);
    const userData = request.only([
      "name",
      "surname",
      "email",
      "password",
      "image_id"
    ]);

    user.merge(userData);

    await user.save();
    users = await transform.item(users, Transformer);

    return response.send(user);
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, response }) {
    const user = await User.findOrFail(id);

    try {
      await user.delete();
      return response.status(200).send();
    } catch (error) {
      return response
        .status(500)
        .send({ message: "Não foi possível deletetar o usuário" });
    }
  }
}

module.exports = UserController;
