"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with images
 */

const Image = use("App/Models/Image");
const { manage_single_upload, manage_multiple_upload } = use("App/Helpers");
const fs = use("fs");
const Transformer = use("App/Transformers/Admin/ImageTransformer");

class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ transform, response, pagination }) {
    const images = await Image.query()
      .orderBy("id", "DESC")
      .paginate(pagination.page, pagination.limit);

    images = await transform.paginate(images, Transformer);

    return response.send(images);
  }
  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    try {
      //Captura uma image ou mais do request
      const fileJar = request.file("images", {
        types: ["image"],
        sizes: "2mb"
      });
      //retorno pro usuário
      let images = [];
      //caso seja um unico arquivo: manage_single_upload

      if (!fileJar.files) {
        const file = await manage_single_upload(fileJar);
        if (file.moved()) {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          });

          const transformedImage = await transform.itme(image, Transformer);

          image.push(transformedImage);

          return response.status(200).send({ successes: images, errors: {} });
        }
        return response.status(400).send({
          message: "Não foi possível processar esta imagem no momento"
        });
      }
      //caso sejam vários arquivos: manage_multiple_upload
      let files = await manage_multiple_upload(fileJar);

      await Promise.all(
        files.successes.map(async file => {
          var image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          });

          const transformedImage = await transform.itme(image, Transformer);

          image.push(transformedImage);
        })
      );
      return response
        .status(201)
        .send({ successes: images, errors: file.errors });
    } catch (error) {
      return response.status(400).send({
        message: "Não foi possível processar sua socilitação"
      });
    }
  }

  /**
   * Display a single image.
   * GET images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, transform, response }) {
    var image = await Image.findOrFail(id);

    image = await transform.item(image, Transformer);

    return response.send(image);
  }
  /**
   * Update image details.
   * PUT or PATCH images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response, transform }) {
    var image = await Image.findOrFail(id);

    try {
      image.merge(request.only(["original_name"]));
      await image.save();
      image = await transform.item(image, Transformer);

      return response.status(200).send(image);
    } catch (error) {
      return response.status(400).send({
        message:
          "Não foi possível atualizar esta imagem no momento. Tente mais tarde!"
      });
    }
  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id);

    try {
      let filepath = Helpers.pulicPath(`upload/${image.path}`);
      //fs é um modulo do NodeJs
      fs.unlinkSync(filepath);
      await image.delete();

      return response.status(204).send();
    } catch (error) {
      return response.satuts(400).send({
        message:
          "Não foi possível deletar a imagem no momento. Tente mais tarde!"
      });
    }
  }
}

module.exports = ImageController;
