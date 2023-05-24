const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    name: joi.string().required().label('name'),
    cpf: joi.string().allow(null).optional().label('cpf'),
    email: joi.string().required().label('email'),
    telefone: joi.string().allow(null).optional().label('telefone'),
    password: joi.string().required().label('password'),
    imei: joi.string().allow(null).optional().label('imei'),
    salt: joi.string().min(3).max(256).optional().label("salt"),
    level: joi.valid(...['ADMINISTRADOR', 'CLIENTE', 'ENTREGADOR', 'CARRO']).required().label("level"),
    updatedAt:joi.date().allow(null).optional().label('updatedAt')
}).messages(joiMessages);