"use strict";
const crypto = use("crypto");
const Helpers = use("Helpers");

/**
 * Generate eandom string
 *
 * @params {int} length - o tamanho da string que você quer gerar
 * @return { string } uma string randomica do tamanho de length
 */

const str_random = async (length = 40) => {
  let string = "";
  let len = string.length;

  if (len < length) {
    let size = length - len;
    let bytes = await crypto.randomBytes(size);
    let buffer = Buffer.from(bytes);
    string += buffer
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substr(0, size);
  }
  return string;
};

/**
 * Move um único arquivo para o cominho especificado, se nenhum for especificado então o caminho 'public/uploads' será utilizado
 * @param { fileJar } file o arquivo a ser gerenciado
 * @param { string } o caminho para onde o arquivo deve ser movido
 * @return {object<fileJar>}
 */

const manage_single_upload = async (file, path = null) => {
  path = path ? path : Helpers.publicPath("uploads");
  // Gera um nome aleatório
  const random_name = await str_random(30);
  let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`;
  //Renomeia o arquivo e move ele para o Path
  await file.move(path, {
    name: filename
  });

  return file;
};

/**
 * Move multipos arquivo para o cominho especificado, se nenhum for especificado então o caminho 'public/uploads' será utilizado
 * @param { fileJar } file o arquivo a ser gerenciado
 * @param { string } o caminho para onde o arquivo deve ser movido
 * @return {object}
 */

const manage_multiple_upload = async (fileJar, path = null) => {
  path = path ? path : Helpers.publicPath("uploads");
  let successes = [],
    errors = [];

  await Promise.all(
    fileJar.files.map(async file => {
      let random_name = await str_random(30);
      let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`;
      //Move o arquivo
      await file.move(path, {
        name: filename
      });
      //Verifica se ele foi movido
      if (file.moved()) {
        successes.push(file);
      } else {
        errors.push(file.error());
      }
    })
  );
  return { succrsses, errors };
};

module.exports = {
  str_random,
  manage_single_upload,
  manage_multiple_upload
};
