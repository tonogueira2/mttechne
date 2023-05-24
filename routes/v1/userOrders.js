const express = require('express');
const router = express.Router();

const UserOrdersClass = require(`../../interfaces/classes/userOrders`);
let UserOrders = new UserOrdersClass();


router.post('/', async (req, res, next) => {
  try{
    const response = await UserOrders.save(req.body);
    return res.responser(200, 'UserOrders cadastrado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const userOrders = await UserOrders.get(req.query, attributes);
    const response = {
        rows: userOrders[0],
        count: userOrders[1]
    }

    if (response.count) {
      return res.responser(200, 'As compras dos usuários foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum compra de usuário foi encontrado.', response);
    }
  }catch(err){
    return err;
    //next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do compras dos usuários não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const userOrders = await UserOrders.get(req.params, attributes);
    const response = {
      rows: userOrders[0],
      count: userOrders[1]
    }

    if (response.count) {
      return res.responser(200, 'Compras listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhuma compra foi encontrado para ser listado.', response);
    }
  }catch(err){
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do compras não é válido.');
  }

  let userOrdersData = {
    valor: req.body.valor,
    descricao: req.body.descricao,
    fechado: req.body.fechado,
  }

  try{
    const response = await UserOrders.update(userOrdersData, req.params);
    return res.responser(200, 'Compras atualizado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  if (!req.body.ids || !Array.isArray(req.body.ids) || !req.body.ids.length) {
    return res.responser(400, 'O identificador do compras não é válido.');
  }

  try{
    const response = await UserOrders.delete(req.body.ids);
    if (response) {
      return res.responser(200, 'Compras deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Compras não encontrado para ser deletado.', response);
    }
  }catch(err){
    next(err);
  }
});
  

  module.exports = router;