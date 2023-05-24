const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const realLocationSchema = require("../validations/realLocation.validations");
const { Op } = require('sequelize');

class RealLocation extends Base {
  constructor() {
    super();
  }

  async save(realLocation) {
    try {
      let errors = this._validateFields(realLocation, realLocationSchema);
      if (!errors.length) {
        return await models.realLocation.create(realLocation);
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

  //Update realLocations in database;
  async update(updatedData, where) {
    try {
      let currentRealLocation = await models.realLocation.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where,
      });

      if (currentRealLocation) {
        let data = {
          ...currentRealLocation.dataValues,
          ...updatedData,
        };

        let errors = this._validateFields(data, realLocationSchema);

        if (!errors.length) {
          return await models.realLocation.update(data, {
            where,
          });
        } else {
          throw errors[0];
        }
      } else {
        throw {
          name: "InvalidBody",
          code: 400,
          msg: "Não foi encontrado o realLocation para ser atualizado.",
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

  //Retrieve realLocations from database;
  async get(filters = {}, attributes = false, raw = false) {
    let promises = [];

    let query = {
      attributes: {},
      where: {},
      include: [],
      raw: raw
    };

    if (attributes) {
      query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
    }

    if (filters.id) {
      query.where.id = filters.id;
    }

    if (filters.idUser) {
      query.where.idUser = filters.idUser;
    }

    if (filters.data) {
      query.where.data = filters.data;
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
      promises.push(models.realLocation.findAll(query));
      promises.push(models.realLocation.count(queryCount));
      return await Promise.all(promises);
    } catch (err) {
      throw err;
    }
  }

  async getLocal(id) {
    let query = {
      attributes: {},
      where: { idUser: id },
      include: [],
      raw: true,
      order: [['createdAt', 'DESC']],
      limit: 1
    };


    // eslint-disable-next-line no-useless-catch
    try {
      return await models.realLocation.findAll(query);
    } catch (err) {
      throw err;
    }
  }

  //Delete realLocations from database;
  async delete(realLocationIds) {
    let query = {
      where: {
        id: realLocationIds,
      },
    };

    // eslint-disable-next-line no-useless-catch
    try {
      return await models.realLocation.destroy(query);
    } catch (err) {
      throw err;
    }
  }

  async getAllUser(filters = {}, attributes = false, raw = false) {
    try {
      let _queryUsers = {
        distinct: 'id',
        where: {
          [Op.or]: [{ level: 'ENTREGADOR' }, { level: 'CARRO' }]
        },
        include: [{
          as: 'realLocation',
          model: models.realLocation,
          attributes: {},
          where: {
            id: { [Op.not]: null }
          },
          order: [['createdAt', 'DESC']],
          limit: 1
        }]
      }

      // eslint-disable-next-line no-useless-catch

      return await models.users.findAll(_queryUsers);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = RealLocation;
