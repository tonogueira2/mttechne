const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const productsSchema = require("../validations/products.validations");

class Products extends Base {
  constructor() {
    super();
  }

  async save(products) {
    try {
      let errors = this._validateFields(products, productsSchema);
      if (!errors.length) {
        return await models.products.create(products);
      } else {
        throw errors[0];
      }
    } catch (err) {
      if (Array.isArray(err)) {
        throw err[0];
      } else {
        throw err;
      }
    }
  }

  //Update productss in database;
  async update(updatedData, where) {
    try {
      let currentProducts = await models.products.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where,
      });

      if (currentProducts) {
        let data = {
          ...currentProducts.dataValues,
          ...updatedData,
        };

        let errors = this._validateFields(data, productsSchema);

        if (!errors.length) {
          return await models.products.update(data, {
            where,
          });
        } else {
          throw errors[0];
        }
      } else {
        throw {
          name: "InvalidBody",
          code: 400,
          msg: "Não foi encontrado o products para ser atualizado.",
          value: null,
        };
      }
    } catch (err) {
      if (Array.isArray(err)) {
        throw err[0];
      } else {
        throw err;
      }
    }
  }

  //Retrieve productss from database;
  async get(filters = {}, attributes = false) {
    let promises = [];

    let query = {
      attributes: {},
      where: {},
      include: [],
    };

    if (attributes) {
      query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
    }

    if (filters.id) {
      query.where.id = filters.id;
    }

    if (filters.name) {
      query.where.name = filters.name;
    }

    if (filters.price) {
      query.where.price = filters.price;
    }

    let queryCount = Object.assign({}, query);
    queryCount.distinct = true;
    queryCount.attributes = [];

    if (filters.order) {
      query.order = [filters.order.split(":")];
    }

    if (filters.limit) {
      query.limit = parseInt(filters.limit);
    }

    if (filters.offset) {
      query.offset = parseInt(filters.offset);
    }

    // eslint-disable-next-line no-useless-catch
    try {
      promises.push(models.products.findAll(query));
      promises.push(models.products.count(queryCount));
      return await Promise.all(promises);
    } catch (err) {
      throw err;
    }
  }

  //Delete productss from database;
  async delete(productsIds) {
    let query = {
      where: {
        id: productsIds,
      },
    };

    // eslint-disable-next-line no-useless-catch
    try {
      return await models.products.destroy(query);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Products;
