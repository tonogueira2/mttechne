const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const ordersSchema = require("../validations/orders.validations");
const { Op } = require('sequelize');

class Orders extends Base {
    constructor() {
        super();
    }

    async save(orders) {
        try {
            const transaction = await models._sequelize.transaction();
            let errors = this._validateFields(orders, ordersSchema);
            if (!errors.length) {
                const _order = await models.orders.create(orders, {
                    transaction,
                    include: [{ as: 'users', model: models.users }, { as: 'products', model: models.products }]
                });
                await _order.addUsers(orders.idUser, { transaction });
                await _order.addProducts(orders.idProducts, { transaction });
                await transaction.commit();
                return _order;
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

    //Update orderss in database;
    async update(updatedData, where) {
        try {
            let currentOrders = await models.orders.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            if (currentOrders) {
                let data = {
                    ...currentOrders.dataValues,
                    ...updatedData,
                };

                let errors = this._validateFields(data, ordersSchema);

                if (!errors.length) {
                    return await models.orders.update(data, {
                        where,
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o orders para ser atualizado.",
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

    async getCliente(filters = {}, attributes = false) {
        let promises = [];
        let { idUser } = filters;
        let query = {
            attributes: {},
            where: { idUser },
            include: [{
                as: 'order',
                model: models.orders,
                include: [{
                    model: models.orderItens,
                    as: 'orderItens',
                    include: [{
                        model: models.products,
                        as: 'product',
                    }]
                }]
            }],
        };

        if (attributes) {
            query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
        }

        let queryCount = Object.assign({}, query);
        queryCount.distinct = true;
        queryCount.attributes = [];

        // eslint-disable-next-line no-useless-catch
        try {
            promises.push(models.userOrders.findAll(query));
            promises.push(models.userOrders.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    async getDashboard(filters = {}, attributes = false) {
        try {
            let promises = [];
            let { dataInit, dataFin } = filters;
            let query = {
                attributes: {},
                where: {},
                include: [
                    {
                        as: 'order',
                        model: models.orders,
                        include: [{
                            model: models.orderItens,
                            as: 'orderItens',
                            include: [{
                                model: models.products,
                                as: 'product',
                            }]
                        }]
                    },
                    {
                        as: 'user',
                        model: models.users,
                        attributes: {
                            exclude: ["salt", "password"],
                        },
                    },
                    {
                        as: 'userLocations',
                        model: models.userLocations
                    }
                ],
            }; 

            // dataInit = 22/04 = [Op.gte]: >= 22/04 00, 00, 00
            // dataFin = 27/02 =  [Op.lte]: <= 27/02 23, 59, 59
            if (dataInit && dataFin) {
                const newDataInit = new Date(dataInit);
                const newDataFin = new Date(dataFin);
                query.where.createdAt = {
                    [Op.gte]: newDataInit.setHours(0, 0, 0),
                    [Op.lte]: newDataFin.setHours(23, 59, 59),
                }
            }
            
            query.where.idUserLocations = {
                [Op.not]: null,
            };

            if (attributes) {
                query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
            }

            let queryCount = Object.assign({}, query);
            queryCount.distinct = true;
            queryCount.attributes = [];

            // eslint-disable-next-line no-useless-catch
            try {
                promises.push(models.userOrders.findAll(query));
                promises.push(models.userOrders.count(queryCount));
                return await Promise.all(promises);
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

    async getAdminCliente(filters = {}, attributes = false) {
        try {
            let promises = [];
            let { idUser, data } = filters;
            let query = {
                attributes: {},
                where: {},
                include: [
                    {
                        as: 'order',
                        model: models.orders,
                        include: [{
                            model: models.orderItens,
                            as: 'orderItens',
                            include: [{
                                model: models.products,
                                as: 'product',
                            }]
                        }]
                    },
                    {
                        as: 'user',
                        model: models.users,
                        attributes: {
                            exclude: ["salt", "password"],
                        },
                    },
                    {
                        as: 'userLocations',
                        model: models.userLocations
                    }
                ],
            };

            if (idUser && idUser != 'undefined')
                query.where.idUser = idUser;

            if (data)
                query.where.createdAt = {
                    [Op.gte]: new Date(new Date(filters.data).setDate(new Date(filters.data).getDate() - 1)),
                    [Op.lt]: new Date(new Date(filters.data).setDate(new Date(filters.data).getDate() + 1)),
                }
            
            query.where.idUserLocations = {
                [Op.not]: null,
            };

            if (attributes) {
                query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
            }

            let queryCount = Object.assign({}, query);
            queryCount.distinct = true;
            queryCount.attributes = [];

            // eslint-disable-next-line no-useless-catch
            try {
                promises.push(models.userOrders.findAll(query));
                promises.push(models.userOrders.count(queryCount));
                return await Promise.all(promises);
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

    async getDelivery(attributes = false) {
        try {
            let promises = [];
            let query = {
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where: {},
                include: [
                    {
                        as: 'order',
                        model: models.orders,
                        where:{
                            idOrderStatus: 3
                        },
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [{
                            model: models.orderItens,
                            as: 'orderItens',
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                            include:[
                                {
                                    as: 'product',
                                    model: models.products,
                                    attributes: ["name"]
                                }
                            ]
                        }]
                    },
                    {
                        as: 'userLocations',
                        model: models.userLocations,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    {
                        as: 'user',
                        model: models.users,
                        attributes: ["name"]
                    }
                ],
            };

            query.where.idUserLocations = {
                [Op.not]: null,
            };

            if (attributes) {
                query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
            }

            // eslint-disable-next-line no-useless-catch
            try {
                return await models.userOrders.findAll(query);
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

    async getDeliveryAtivo(id, attributes = false) {
        try {
            let promises = [];
            let query = {
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where: {},
                include: [
                    {
                        as: 'order',
                        model: models.orders,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [{
                            model: models.orderItens,
                            as: 'orderItens',
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                            include:[
                                {
                                    as: 'product',
                                    model: models.products,
                                    attributes: ["name"]
                                }
                            ]
                        }]
                    },
                    {
                        as: 'userLocations',
                        model: models.userLocations,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    {
                        as: 'user',
                        model: models.users,
                        attributes: ["name"]
                    }
                ],
            };

            query.where.idOrder = id
            query.where.idUserLocations = {
                [Op.not]: null,
            };

            if (attributes) {
                query.attributes = attributes.replace(/(^,|,$)/gi, "").split(",");
            }

            // eslint-disable-next-line no-useless-catch
            try {
                return await models.userOrders.findAll(query);
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

    //Retrieve orderss from database;
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

        if (filters.idOrders) {
            query.where.idOrders = filters.idOrders;
        }

        if (filters.id) {
            query.where.id = filters.id;
        }        

        if (filters.idOrderStatus) {
            query.where.idOrderStatus = filters.idOrderStatus;
        }

        if (filters.idPayment) {
            query.where.idPayment = filters.idPayment;
        }
        query.where.idUserLocations = {
            [Op.not]: null,
        };

        let queryCount = Object.assign({}, query);
        queryCount.distinct = true;
        queryCount.attributes = [];

        // eslint-disable-next-line no-useless-catch
        try {
            promises.push(models.orders.findAll(query));
            promises.push(models.orders.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete orderss from database;
    async delete(ordersIds) {
        let query = {
            where: {
                idOrders: ordersIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.orders.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = Orders;