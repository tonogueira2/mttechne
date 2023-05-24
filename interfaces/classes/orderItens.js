const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const orderItensSchema = require("../validations/orderItens.validations");

class OrderItens extends Base {
    constructor() {
        super();
    }

    async save(orderItens) {
        try {
            if (orderItens.fechado == true)
                orderItens.fechado = 1;
            else
                orderItens.fechado = 0;
            let errors = this._validateFields(orderItens, orderItensSchema);
            if (!errors.length) {
                return await models.orderItens.create(orderItens);
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

    //Update orderItenss in database;
    async update(updatedData, where) {
        try {
            let currentOrderItens = await models.orderItens.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            if (currentOrderItens) {
                let data = {
                    ...currentOrderItens.dataValues,
                    ...updatedData,
                };

                let errors = this._validateFields(data, orderItensSchema);

                if (!errors.length) {
                    return await models.orderItens.update(data, {
                        where,
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o orderItens para ser atualizado.",
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

    //Retrieve orderItenss from database;
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

        if (filters.idOrderItens) {
            query.where.idOrderItens = filters.idOrderItens;
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
            promises.push(models.orderItens.findAll(query));
            promises.push(models.orderItens.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete orderItenss from database;
    async delete(orderItensIds) {
        let query = {
            where: {
                idOrderItens: orderItensIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.orderItens.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = OrderItens;