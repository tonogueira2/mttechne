const express = require('express');
const router = express.Router();

const OrderItensClass = require(`../../interfaces/classes/orderItens`);
let OrderItens = new OrderItensClass();


router.post('/', async (req, res, next) => {
  try{
    const response = await OrderItens.save(req.body);
    return res.responser(200, 'OrderItens cadastrado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const orderItens = await OrderItens.get(req.query, attributes);
    const response = {
        rows: orderItens[0],
        count: orderItens[1]
    }

    if (response.count) {
      return res.responser(200, 'Os usuários foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum usuário foi encontrado.', response);
    }
  }catch(err){
    return err;
    //next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do orderItens não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const orderItens = await OrderItens.get(req.params, attributes);
    const response = {
      rows: orderItens[0],
      count: orderItens[1]
    }

    if (response.count) {
      return res.responser(200, 'Usuário listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum usuário foi encontrado para ser listado.', response);
    }
  }catch(err){
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do orderItens não é válido.');
  }

  let orderItensData = {
    valor: req.body.valor,
    descricao: req.body.descricao,
    fechado: req.body.fechado,
  }

  try{
    const response = await OrderItens.update(orderItensData, req.params);
    return res.responser(200, 'Usuário atualizado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  if (!req.body.ids || !Array.isArray(req.body.ids) || !req.body.ids.length) {
    return res.responser(400, 'O identificador do usuário não é válido.');
  }

  try{
    const response = await OrderItens.delete(req.body.ids);
    if (response) {
      return res.responser(200, 'Usuário deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Usuário não encontrado para ser deletado.', response);
    }
  }catch(err){
    next(err);
  }
});
  

  module.exports = router;