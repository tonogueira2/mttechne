const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const userLocationsSchema = require("../validations/userLocations.validations");

class userLocations extends Base {
    constructor() {
        super();
    }

    async save(userLocations) {
        try {
            if (userLocations.number == undefined)
                userLocations.number = 1;
            let errors = this._validateFields(userLocations, userLocationsSchema);
            if (!errors.length) {
                return await models.userLocations.create(userLocations);
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

    //Update userLocationss in database;
    async update(updatedData, where) {
        try {
            let currentuserLocations = await models.userLocations.findOne({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where,
            });

            if (currentuserLocations) {
                let data = {
                    ...currentuserLocations.dataValues,
                    ...updatedData,
                };

                let errors = this._validateFields(data, userLocationsSchema);

                if (!errors.length) {
                    return await models.userLocations.update(data, {
                        where,
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: "InvalidBody",
                    code: 400,
                    msg: "Não foi encontrado o userLocations para ser atualizado.",
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

    //Retrieve userLocationss from database;
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

        if (filters.idUser) {
            query.where.idUser = filters.idUser;
        }

        if (filters.name) {
            query.where.name = filters.name;
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
            promises.push(models.userLocations.findAll(query));
            promises.push(models.userLocations.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete userLocationss from database;
    async delete(userLocationsIds) {
        let query = {
            where: {
                id: userLocationsIds
            },
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await models.userLocations.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = userLocations;