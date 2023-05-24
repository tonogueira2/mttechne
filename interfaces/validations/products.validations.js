const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    name: joi.string().required().label('name'),
    price: joi.number().label('price'),
    img: joi.string().required().label('img'),
}).messages(joiMessages);