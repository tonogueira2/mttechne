const express = require('express');
const router = express.Router();

const ProductsClass = require(`../../interfaces/classes/products`);
let Products = new ProductsClass();


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
 

  module.exports = router;