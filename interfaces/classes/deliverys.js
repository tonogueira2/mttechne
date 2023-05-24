const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const deliverysSchema = require("../validations/deliverys.validations");

class Deliverys extends Base {
    constructor() {
        super();
    }

    async save(deliverys, location) {
        try {
            const transaction = await models._sequelize.transaction();
            let errors = this._validateFields(deliverys, deliverysSchema);
            if (!errors.length) {
                const _delivery = await models.deliverys.create(deliverys, {
                    transaction,
                    include: [{ as: 'deliveryHistorys', model: models.deliveryHistory }]
                });
                await _delivery.addDeliveryHistorys({ idUser: deliverys.idUser, location: location }, { transaction });
                await transaction.commit();
                return _delivery;
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

    //Update deliveryss in database;
    async update(updatedData, where) {
        try {
            let currentDeliverys = await models.deliverys.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            let _tmp = currentDeliverys.dataValues
            delete _tmp.id;
            if (currentDeliverys) {
                let data = {
                    ..._tmp,
                    ...updatedData,
                };

                let errors = this._validateFields(data, deliverysSchema);

                if (!errors.length) {
                    return await models.deliverys.update(data, {
                        where,
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o deliverys para ser atualizado.",
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

    //Retrieve deliveryss from database;
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

        if (filters.idOrder) {
            query.where.idOrder = filters.idOrder;
        }

        if (filters.idDeliveryStatus) {
            query.where.idDeliveryStatus = filters.idDeliveryStatus;
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
            promises.push(models.deliverys.findAll(query));
            promises.push(models.deliverys.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete deliveryss from database;
    async delete(deliverysIds) {
        let query = {
            where: {
                idDeliverys: deliverysIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.deliverys.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = Deliverys;