const express = require('express');
const router = express.Router();

const PaymentsClass = require(`../../interfaces/classes/payments`);
const Payments = new PaymentsClass();
const OrdersClass = require(`../../interfaces/classes/orders`);
const Orders = new OrdersClass();
const UserOrdersClass = require(`../../interfaces/classes/userOrders`);
const UserOrders = new UserOrdersClass();

const UtilClass = require("../../helpers/util");
const Util = new UtilClass();
const AWS = require("aws-sdk");
var mercadopago = require('mercadopago');

const InvokeLambda = (val) => {

  AWS.config.update({
    region: "sa-east-1",
    accessKeyId: "AKIA46TAYJSJLBTAY2WS",
    secretAccessKey: "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"
  });
  var lambda = new AWS.Lambda();
  return new Promise((resolve, reject) => {
    let params = {
      FunctionName: 'serverless-lambda-payments-production-payments', // the lambda function we are going to invoke
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: val
    }
    lambda.invoke(params, function (err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data.Payload);
      }
    })
  })
}

const InvokeLambdaCupom = (val) => {

  AWS.config.update({
    region: "sa-east-1",
    accessKeyId: "AKIA46TAYJSJLBTAY2WS",
    secretAccessKey: "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"
  });
  var lambda = new AWS.Lambda();
  return new Promise((resolve, reject) => {
    let params = {
      FunctionName: 'serverless-lambda-payments-production-paymentsCupom', // the lambda function we are going to invoke
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: val
    }
    lambda.invoke(params, function (err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data.Payload);
      }
    })
  })
}

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

const mRound = (num, places) => {
	if (!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + places)  + "e-" + places);
	} else {
		let arr = ("" + num).split("e");
		let sig = ""
		if (+arr[1] + places > 0) {
			sig = "+";
		}

		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
	}
}



router.post('/', async (req, res, next) => {
  try {
    if (req.query) {
      let { idOrder, idUserLocation, token, payment } = req.body;
      let idUser = req.autenticated.user.id
      if (idOrder == undefined)
        return res.responser(404, 'Informe o codigo da compra');
      if (idUserLocation == undefined)
        return res.responser(404, 'Informe um endereço válido');
      if (token == undefined)
        return res.responser(404, 'Erro ao coletar informações de pagamento');

      let _location = {
        idUser: req.autenticated.user.id,
        idOrder: idOrder,
        idUserLocations: idUserLocation
      }
      let retornoPagamento;
      if (payment == 'pix') {
        let _name = req.autenticated?.user?.name?.split(' ');

        let _cipher = Util.decipherCiphers(`${req.autenticated?.user?.id}`);
        let _ccobj = JSON.parse(_cipher(token));

        let payment_data = {
          transaction_amount: mRound(_ccobj.priceTotal, 2),
          description: 'Pigmeo - Carne Suculenta no conforto da sua casa!',
          payment_method_id: 'pix',
          payer: {
            email: req.autenticated.user.email,
            first_name: _name?.length > 0 ? _name[0] : req.autenticated?.user?.name,
            last_name: _name?.length > 0 ? _name[_name?.length - 1] : req.autenticated?.user?.name,
            identification: {
              type: 'CPF',
              number: req.autenticated?.user?.cpf
            }
          },
          external_reference: `${idOrder}`,
          issuer_id: `${idOrder}`,
          notification_url: 'https://api.pigmeu.club/paymentsIPN'
        };
        retornoPagamento = await mercadoPagoSender(payment_data);
        //return res.responser(404, 'Payments Pix cadastrado com sucesso.', retornoPagamento);
      }

      let returnLambda = await InvokeLambda(JSON.stringify({ idUser, idOrder, idUserLocation, token, payment, retornoPagamento }))
      console.log(returnLambda);
      let returnLambdaObj = JSON.parse(returnLambda);

      if (returnLambdaObj?.errorMessage != undefined || returnLambdaObj?.message?.includes('status code 400')) {
        return res.responser(404, 'Erro ao enviar pagamento');
      }

      await UserOrders.update(_location, { idUser: _location.idUser, idOrder: _location.idOrder });

      //let _tmp = req.body;
      //_tmp.description = 'Pagamento Pigmeo Cliente';
      // const response = await Payments.save(_tmp);
      let _obj = {
        idOrderStatus: payment == 'pix' ? Util.retornaStatusOrderPix(retornoPagamento) : Util.retornaStatusOrder(returnLambdaObj),
        idPayment: `${returnLambdaObj.paymentId}`,
      }
      await Orders.update(_obj, { id: idOrder })

      return res.responser(200, 'Payments cadastrado com sucesso.', retornoPagamento != undefined && payment == 'pix' ? retornoPagamento?.point_of_interaction?.transaction_data : returnLambda);
    } else {
      res.responser(404, 'Informe o codigo da compra');
    }
  } catch (err) {
    return res.responser(400, 'Erro ao processar seu pagamento', err);
  }
});

router.get('/', async (req, res, next) => {
  if (req.query.cupom != 'pigmeu21' || req.query.idOrder == undefined) {
    return res.responser(400, 'O identificador do cupom não é válido.');
  }
  try {
    let returnLambda = await InvokeLambdaCupom(JSON.stringify({ cupom: req.query.cupom, idUser: req.autenticated.user.id, idOrder: req.query.idOrder }))
    console.log(returnLambda);
    let returnLambdaObj = JSON.parse(returnLambda);
    return res.responser(200, 'Cupom autenticado com sucesso.', returnLambdaObj);

  } catch (err) {
    next(err);
  }
});




module.exports = router;