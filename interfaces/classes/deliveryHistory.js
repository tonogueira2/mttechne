const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const deliveryHistorySchema = require("../validations/deliveryHistory.validations");

class DeliveryHistory extends Base {
    constructor() {
        super();
    }

    async save(deliveryHistorys) {
        try {
            let errors = this._validateFields(deliveryHistorys, deliveryHistorySchema);
            if (!errors.length) {
              return await models.deliveryHistory.create(deliveryHistorys);
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

    //Update deliveryHistorys in database;
    async update(updatedData, where) {
        try {
            let currentDeliveryHistory = await models.deliveryHistory.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            if (currentDeliveryHistory) {
                let data = {
                    ...currentDeliveryHistory.dataValues,
                    ...updatedData,
                };

                let errors = this._validateFields(data, deliveryHistorySchema);

                if (!errors.length) {
                    return await models.deliveryHistory.update(data, {
                        where,
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o deliveryHistory para ser atualizado.",
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

    //Retrieve deliveryHistorys from database;
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

        if (filters.idDeliveryHistory) {
            query.where.idDeliveryHistory = filters.idDeliveryHistory;
        }

        if (filters.idEmpresa) {
            query.where.idEmpresa = filters.idEmpresa;
        }

        if (filters.valor) {
            query.where.valor = filters.valor;
        }

        if (filters.data) {
            query.where.data = filters.data;
        }

        if (filters.fechado != undefined) {
            query.where.fechado = filters.fechado;
        }

        if (filters.search) {
            query.where.descricao = {
                [Op.like]: `%${filters.search}%`,
            };
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
            promises.push(models.deliveryHistory.findAll(query));
            promises.push(models.deliveryHistory.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete deliveryHistorys from database;
    async delete(deliveryHistoryIds) {
        let query = {
            where: {
                idDeliveryHistory: deliveryHistoryIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.deliveryHistory.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = DeliveryHistory;