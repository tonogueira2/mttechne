const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const stockDriversSchema = require("../validations/stockDriver.validations");
const OrderClass = require(`../../interfaces/classes/orders`);
let Order = new OrderClass();
const DeliveryClass = require(`../../interfaces/classes/deliverys`);
let Delivery = new DeliveryClass();

class StockDriver extends Base {
  constructor() {
    super();
  }

  async save(stockDrivers) {
    try {
      let errors = [];
      stockDrivers.forEach(element => {
        let _errors = this._validateFields(element, stockDriversSchema);
        if (_errors != false)
          errors = _errors;
      });
      if (!errors.length) {
        return await models.stockDriver.bulkCreate(stockDrivers);
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

  //Retrieve stockDriverss from database;
  async get(filters = {}, attributes = false, raw = false) {
    let promises = [];

    let query = {
      attributes: {},
      where: {},
      include: [],
      raw:raw
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

    if (filters.idProduct) {
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
      promises.push(models.stockDriver.findAll(query));
      promises.push(models.stockDriver.count(queryCount));
      return await Promise.all(promises);
    } catch (err) {
      throw err;
    }
  }

  async verificar(filters = {}, attributes = false) {
    let promises = [];

    let query = {
      attributes: {},
      where: {},
      include: [],
      raw: true,
    };

    if (attributes) {
      query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
    }

    if (filters.idUser) {
      query.where.idUser = filters.idUser;
    }

    // eslint-disable-next-line no-useless-catch
    try {
      let _res = await models.stockDriver.findAll(query)
      if (_res != null || _res != undefined && _res.length > 0) {
        let _data = new Date();
        let _muitoTempo = _res.filter(c => (Math.abs(_data - c.createdAt) / 36e5) > 4);
        if (_muitoTempo.length > 0) {
          await this.zerar(filters.idUser);
          return false;
        } else if (_res.length > 0) {
          return true;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  //Delete stockDriverss from database;
  async atualizar(qry, idUser) {
    let { idOrder, status } = qry;
    let _where = { id: [] };
    let query = {
      where: _where,
    };

    try {
      let _odrs = await this.getOrdersItens(idOrder);
      let _idProducts = [];
      if (_odrs != undefined) {
        _odrs?.orderItens?.map(c => {
          _idProducts.push(c.idProducts);
        });
      }
      let _stockObj = await this.get({ idUser: idUser, idProducts: _idProducts, order: 'createdAt:ASC', limit: _idProducts.length });
      if (_stockObj.length > 0 && _stockObj[0].length > 0) {
        _stockObj[0].map(c => {
          _where.id.push(c.dataValues.id);
        })
      }
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line no-useless-catch
    try {
      await Order.update({ idOrderStatus: status == 'OK' ? 4 : 5 }, { id: idOrder});
      await Delivery.update({ idDeliveryStatus: status == 'OK' ? 4 : 5 }, { idOrder: idOrder});
      return await models.stockDriver.destroy(query);
    } catch (err) {
      throw err;
    }
  }

  async zerar(idUser) {
    let query = {
      where: {
        idUser: idUser
      },
    };

    // eslint-disable-next-line no-useless-catch
    try {
      return await models.stockDriver.destroy(query);
    } catch (err) {
      throw err;
    }
  }


  async getOrdersItens(idOrder, attributes = false) {
    try {
      let promises = [];
      let query = {
        attributes: {},
        where: { id: idOrder },
        include: [{
          model: models.orderItens,
          as: 'orderItens'
        }]
      };

      if (attributes) {
        query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
      }

      // eslint-disable-next-line no-useless-catch
      try {
        let _res = await models.orders.findOne(query);
        return _res?.dataValues;
      } catch (err) {
        throw err;
      }
    } catch (err) {
      if (Array.isArray(err)) {
        throw err[0];
      } else {
        throw err;
      }
    }
  }
}

module.exports = StockDriver;
