const express = require('express');
const router = express.Router();

const ProductsClass = require(`../../interfaces/classes/products`);
let Products = new ProductsClass();

// TODO - fazer upload de imagem

router.post('/', async (req, res, next) => {
  try{
    const response = await Products.save(req.body);
    return res.responser(200, 'Produto cadastrado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const products = await Products.get(req.query, attributes);
    const response = {
        rows: products[0],
        count: products[1]
    }

    if (response.count) {
      return res.responser(200, 'Os produtos foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum produto foi encontrado.', response);
    }
  }catch(err){
    return err;
    //next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do products não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const products = await Products.get(req.params, attributes);
    const response = {
      rows: products[0],
      count: products[1]
    }

    if (response.count) {
      return res.responser(200, 'Produto listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum produto foi encontrado para ser listado.', response);
    }
  }catch(err){
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do products não é válido.');
  }

  let productsData = {
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
  }

  try{
    const response = await Products.update(productsData, req.params);
    return res.responser(200, 'Produto atualizado com sucesso.', response);
  }catch(err){
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador não é válido.');
  }

  try{
    const response = await Products.delete(req.params.id);
    if (response) {
      return res.responser(200, 'Produto deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Produto não encontrado para ser deletado.', response);
    }
  }catch(err){
    next(err);
  }
});
  

  module.exports = router;