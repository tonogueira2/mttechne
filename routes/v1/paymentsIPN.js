const express = require('express');
const router = express.Router();
const axios = require('axios');

const OrdersClass = require(`../../interfaces/classes/orders`);
const Orders = new OrdersClass();
const UtilClass = require("../../helpers/util");
const Util = new UtilClass();

var mercadopago = require('mercadopago');


const mercadoPagoSender = (val) => {
  mercadopago.configurations.setAccessToken(process.env.PRIVATEKEY);
  return new Promise((resolve, reject) => {
    mercadopago.payment.create(val).then(function (data) {
      return resolve(data?.response);
    }).catch(function (error) {
      return reject(error);
    });
  })
}


router.post('/', async (req, res, next) => {
  try {
    if (req.query) {
      console.log(req.query);
      //Util.retornaStatusOrderPix(retornoPagamento)
      if (req?.query?.topic == 'payment') {
        let _result = await axios.get(`https://api.mercadopago.com/v1/payments/${req.query.id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRIVATEKEY}`
          }
        });
        console.log('------ start _result?.data -------');
        console.log(_result?.data);
        console.log('------ end _result?.data -------');
        if (_result?.data != undefined) {
          let _obj = {
            idOrderStatus: Util.retornaStatusOrderPix(_result?.data),
            idPayment: `${_result?.data?.id}`,
          }
          console.log('------ start _obj -------');
          console.log(_obj);
          console.log('------ end _obj -------');
          let _r = await Orders.update(_obj, { id: parseInt(_result?.data?.external_reference) });
          console.log('------ start update -------');
          console.log(_r)
          console.log('------ end update -------');
        }
      }
      return res.responser(200, 'IPN recebido com sucesso.', req.query);
    }
  } catch (err) {
    return res.responser(400, 'Erro ao receber Instant Payment Notification', err);
  }
});

module.exports = router;