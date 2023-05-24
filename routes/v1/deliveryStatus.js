const express = require('express');
const router = express.Router();

const DeliveryStatusClass = require(`../../interfaces/classes/deliveryStatus`);
let DeliveryStatus = new DeliveryStatusClass();




router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try{
    const deliveryStatus = await DeliveryStatus.get(req.query, attributes);
    const response = {
        rows: deliveryStatus[0],
        count: deliveryStatus[1]
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

  

  module.exports = router;