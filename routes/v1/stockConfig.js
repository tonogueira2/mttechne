const express = require('express');
const router = express.Router();

const StockConfigClass = require(`../../interfaces/classes/stockConfig`);
let StockConfig = new StockConfigClass();




router.post('/', async (req, res, next) => {
  try{
    const response = await StockConfig.save(req.body);
    return res.responser(200, 'Estoque cadastrado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const stockConfig = await StockConfig.get(req.query, attributes);
    const response = {
        rows: stockConfig[0],
        count: stockConfig[1]
    }

    if (response.count) {
      return res.responser(200, 'Os estoques foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum Estoque foi encontrado.', response);
    }
  }catch(err){
    return err;
    //next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do Estoque não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const stockConfig = await StockConfig.get(req.params, attributes);
    const response = {
      rows: stockConfig[0],
      count: stockConfig[1]
    }

    if (response.count) {
      return res.responser(200, 'Estoque listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum Estoque foi encontrado para ser listado.', response);
    }
  }catch(err){
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do Estoque não é válido.');
  }

  let stockConfigData = {
    id: req.body.id,
    idProducts: req.body.idProducts,
    quantity: req.body.quantity,
  }

  try{
    const response = await StockConfig.update(stockConfigData, req.params);
    return res.responser(200, 'Estoque atualizado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador não é válido.');
  }

  try{
    const response = await StockConfig.delete(req.params.id);
    if (response) {
      return res.responser(200, 'Estoque deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Estoque não encontrado para ser deletado.', response);
    }
  }catch(err){
    next(err);
  }
});


module.exports = router;