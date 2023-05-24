const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const stockConfigSchema = require("../validations/stockConfig.validations");

class StockConfig extends Base {
  constructor() {
    super();
  }

  async save(stockConfig) {
    try {
      let errors = this._validateFields(stockConfig, stockConfigSchema);
      if (!errors.length) {
        return await models.stockConfig.create(stockConfig);
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

  //Update stockConfigs in database;
  async update(updatedData, where) {
    try {
      let currentStockConfig = await models.stockConfig.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where,
      });

      if (currentStockConfig) {
        let data = {
          ...currentStockConfig.dataValues,
          ...updatedData,
        };

        let errors = this._validateFields(data, stockConfigSchema);

        if (!errors.length) {
          return await models.stockConfig.update(data, {
            where,
          });
        } else {
          throw errors[0];
        }
      } else {
        throw {
          name: "InvalidBody",
          code: 400,
          msg: "Não foi encontrado o stockConfig para ser atualizado.",
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

  //Retrieve stockConfigs from database;
  async get(filters = {}, attributes = false, raw = false) {
    let promises = [];

    let query = {
      attributes: {},
      where: {},
      include: [
        {
          as: 'product',
          model: models.products
        }
      ],
      raw: raw
    };

    if (attributes) {
      query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
    }

    if (filters.id) {
      query.where.id = filters.id;
    }

    if (filters.idProducts) {
      query.where.idProducts = filters.idProducts;
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
      promises.push(models.stockConfig.findAll(query));
      promises.push(models.stockConfig.count(queryCount));
      return await Promise.all(promises);
    } catch (err) {
      throw err;
    }
  }

  //Delete stockConfigs from database;
  async delete(stockConfigIds) {
    let query = {
      where: {
        id: stockConfigIds,
      },
    };

    // eslint-disable-next-line no-useless-catch
    try {
      return await models.stockConfig.destroy(query);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = StockConfig;
