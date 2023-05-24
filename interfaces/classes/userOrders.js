const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const userOrdersSchema = require("../validations/userOrders.validations");

class UserOrders extends Base {
    constructor() {
        super();
    }

    async save(userOrders) {
        try {
            if (userOrders.fechado == true)
                userOrders.fechado = 1;
            else
                userOrders.fechado = 0;
            let errors = this._validateFields(userOrders, userOrdersSchema);
            if (!errors.length) {
                return await models.userOrders.create(userOrders);
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

    //Update userOrderss in database;
    async update(updatedData, where) {
        try {
            let currentUserOrders = await models.userOrders.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            if (currentUserOrders) {
                let data = {
                    ...currentUserOrders.dataValues,
                    ...updatedData,
                };

                let errors = this._validateFields(data, userOrdersSchema);

                if (!errors.length) {
                    return await models.userOrders.update(data, {
                        where,
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o userOrders para ser atualizado.",
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

    //Retrieve userOrderss from database;
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

        if (filters.idUserOrders) {
            query.where.idUserOrders = filters.idUserOrders;
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
            promises.push(models.userOrders.findAll(query));
            promises.push(models.userOrders.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete userOrderss from database;
    async delete(userOrdersIds) {
        let query = {
            where: {
                idUserOrders: userOrdersIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.userOrders.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = UserOrders;