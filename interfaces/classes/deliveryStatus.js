const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();
const deliveryStatusSchema = require("../validations/deliveryStatus.validations");

class DeliveryStatus extends Base {
    constructor() {
        super();
    }

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
            promises.push(models.deliveryStatus.findAll(query));
            promises.push(models.deliveryStatus.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

}


module.exports = DeliveryStatus;