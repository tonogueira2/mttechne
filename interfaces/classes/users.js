const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const userSchema = require("../validations/users.validations");
const UtilClass = require("../../helpers/util");
const Util = new UtilClass();

class Users extends Base {
    constructor() {
        super();
    }

    async checkUserCredential(usuario) {
        try {

            let query = {
                attributes: {},
                where: { telefone: usuario.telefone },
            };

            return await models.users.findOne(query);
        } catch (err) {
            console.log(err)
            return err;
        }
    }

    async checkOperadorCredential(usuario) {
        try {

            let query = {
                attributes: {},
                where: { cpf: usuario.cpf },
            };

            return await models.users.findOne(query);
        } catch (err) {
            console.log(err)
            return err;
        }
    }

    async checkAdminCredential(usuario) {
        try {

            let query = {
                attributes: {},
                where: { cpf: usuario.cpf },
            };

            return await models.users.findOne(query);
        } catch (err) {
            console.log(err)
            return err;
        }
    }

    async save(user) {
        try {
            let errors = this._validateFields(user, userSchema);
            if (!errors.length) {
                user.salt = Util.generateGuid();
                user.password = Util.encryptPassword(user.salt, user.password);
                return await models.users.create(user);
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

    //Update users in database;
    async update(updatedData, where) {
        try {
            let currentUser = await models.users.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            if (currentUser) {
                if (!updatedData.password) {
                    updatedData.password = currentUser.password;
                }

                if (!updatedData.level) {
                    updatedData.level = currentUser.level;
                }

                if (updatedData.password && updatedData.password !== currentUser.password) {
                    updatedData.salt = Util.generateGuid();
                    updatedData.password = Util.encryptPassword(updatedData.salt, updatedData.password);
                }

                updatedData.updatedAt = new Date();

                let data = {
                    ...currentUser.dataValues,
                    ...updatedData,
                };

                let errors = this._validateFields(data, userSchema);

                if (!errors.length) {
                    await models.users.update(data, { where, });
                    delete data.password;
                    delete data.salt;
                    return data;
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o user para ser atualizado.",
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

    //Retrieve users from database;
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

        if (filters.level) {
            query.where.level = filters.level;
        }

        if (filters.name) {
            query.where.name = filters.name;
        }

        if (filters.email) {
            query.where.email = filters.email;
        }

        if (filters.search) {
            query.where.name = {
                [Op.like]: `%${filters.search}%`,
            };
            query.where.email = {
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
            promises.push(models.users.findAll(query));
            promises.push(models.users.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete users from database;
    async delete(userIds) {
        let query = {
            where: {
                id: userIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.users.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = Users;