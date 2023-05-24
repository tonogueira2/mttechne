const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idUser: joi.number().integer().positive().label('idUser'),
    name: joi.string().required().label('name'),
    street: joi.string().required().label('street'),
    number: joi.number().integer().positive().label('number'),
    city: joi.string().required().label('city'),
    state: joi.string().required().label('state'),
    country: joi.string().required().label('country'),
    cep: joi.string().optional().label('cep'),
    formattedAddress: joi.string().optional().label('formattedAddress'),
    latitude: joi.string().required().label('latitude'),
    longitude: joi.string().required().label('longitude'),
}).messages(joiMessages);