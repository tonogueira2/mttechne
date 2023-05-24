const Base = require("./base");

const initModels = require("../models/init-models");
const models = initModels();

const mercadopago = require('mercadopago');

class Payments extends Base {
    constructor() {
        
        super();
    }

    async save(payments) {
        try {
            mercadopago.configurations.setAccessToken(process.env.PRIVATEKEY);
            return await mercadopago.payment.save(payments);
        } catch (err) {
            if (Array.isArray(err)) {
                throw err[0];
            } else {
                throw err;
            }
        }
    }
}


module.exports = Payments;
