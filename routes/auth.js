const router = require('express').Router();
const config = require('config');
const jwt = require('jsonwebtoken');

const UtilClass = require('../helpers/util');
const Util = new UtilClass();

const UserClass = require(`../interfaces/classes/users`);
const User = new UserClass();

router.post("/", async (req, res, next) => {

  let _user = { password: req.body.password, cpf: req.body.cpf }
  let _res = await User.checkAdminCredential(_user);
  let valid = false;
  if (_res)
    valid = Util.checkPassword(_res.salt, req.body.password, _res.password);
  if (valid) {
    try {
      let _obj = { ..._res.dataValues };
      delete _obj.salt;
      delete _obj.password;
      let response = await Util.createToken(_obj);
      _obj.tokenID = response;
      return res.responser(200, 'Usuário validado com sucesso.', _obj);

    } catch (err) {
      return res.responser(400, 'Erro ao gerar credenciais.', valid);
    }
  } else {
    return res.responser(401, 'Usuário ou senha inválida.', valid);
  }

  return true;
});

router.post("/cliente", async (req, res, next) => {

  let _user = { password: req.body.password, telefone: req.body.telefone }
  let _res = await User.checkUserCredential(_user);
  let valid = false;
  if (_res)
    valid = Util.checkPassword(_res.salt, req.body.password, _res.password);
  if (valid) {
    try {
      let _obj = { ..._res.dataValues };
      delete _obj.salt;
      delete _obj.password;
      let response = await Util.createToken(_obj);
      _obj.tokenID = response;
      return res.responser(200, 'Usuário validado com sucesso.', _obj);

    } catch (err) {
      return res.responser(400, 'Erro ao gerar credenciais.', valid);
    }
  } else {
    return res.responser(401, 'Usuário ou senha inválida.', valid);
  }

  return true;
});

router.post("/mobile", async (req, res, next) => {

  let _user = { password: req.body.password, cpf: req.body.cpf }
  let _res = await User.checkOperadorCredential(_user);
  let valid = false;
  if (_res)
    valid = Util.checkPassword(_res.salt, req.body.password, _res.password);
  if (valid) {
    try {
      let _obj = { ..._res.dataValues };
      let response = await Util.createToken(_obj);
      _obj.tokenID = response;
      return res.responser(200, 'Usuário validado com sucesso.', _obj);

    } catch (err) {
      return res.responser(400, 'Erro ao gerar credenciais.', valid);
    }
  } else {
    return res.responser(401, 'Usuário ou senha inválida.', valid);
  }

  return true;
});

router.post("/mobile/reconnect", async (req, res, next) => {

  let _user = { password: req.body.password, cpf: req.body.cpf, salt: req.body.salt }
  let _res = await User.checkOperadorCredential(_user);
  let valid = false;

  if (_res && _res.salt === _user.salt && _res.password === _user.password && _res.cpf === _user.cpf)
    valid = true;


  if (valid) {
    try {
      let _obj = { ..._res.dataValues };
      let response = await Util.createToken(_obj);
      _obj.tokenID = response;
      return res.responser(200, 'Usuário validado com sucesso.', _obj);

    } catch (err) {
      return res.responser(400, 'Erro ao gerar credenciais.', valid);
    }
  } else {
    return res.responser(401, 'Usuário ou senha inválida.', valid);
  }

  return true;
});

router.post('/registrar', async (req, res, next) => {
  try {
    const _obj = { ...req.body }
    _obj.level = 'CLIENTE';
    const response = await User.save(_obj);
    let _res = { ...response.dataValues }
    delete _res.password;
    delete _res.salt;
    return res.responser(200, 'Users cadastrado com sucesso.', _res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;