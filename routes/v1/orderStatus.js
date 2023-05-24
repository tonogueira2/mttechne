const express = require('express');
const router = express.Router();

const OrderStatusClass = require(`../../interfaces/classes/orderStatus`);
let OrderStatus = new OrderStatusClass();



router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const orderStatus = await OrderStatus.get(req.query, attributes);
    const response = {
      rows: orderStatus[0],
      count: orderStatus[1]
    }

    if (response.count) {
      return res.responser(200, 'Os usuários foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum usuário foi encontrado.', response);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});



module.exports = router;