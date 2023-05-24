const express = require('express');
const router = express.Router();
const axios = require('axios');

const UtilClass = require("../../helpers/util");
const Util = new UtilClass();

const RealLocationClass = require(`../../interfaces/classes/realLocation`);
let RealLocation = new RealLocationClass();
const StockDriverClass = require(`../../interfaces/classes/stockDrivers`);
let StockDriver = new StockDriverClass();
const OrderClass = require(`../../interfaces/classes/orders`);
let Order = new OrderClass();

const DeliveryClass = require(`../../interfaces/classes/deliverys`);
let Delivery = new DeliveryClass();

const DeliveryHistoryClass = require(`../../interfaces/classes/deliveryHistory`);
let DeliveryHistory = new DeliveryHistoryClass();


// SETAR LOCALIZACAO 
router.post('/reallocation/', async (req, res, next) => {
  try {
    let { latitude, longitude } = req.body;


    let _tmps = await Delivery.get({ idUser: req.autenticated.user.id, idDeliveryStatus: 3 });
    let _tmp = _tmps[0];
    if (_tmp.length > 0) {
      _tmp.map(async c => {
        await DeliveryHistory.save({ idDelivery: c.id, location: JSON.stringify({ latitude, longitude }) })
      })
    }

    const response = await RealLocation.save(req.body);
    return res.responser(200, 'RealLocation cadastrado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.get('/reallocation/apoio', async (req, res, next) => {
  try {

    //TODO - api para pegar a location dos apoio
    
  } catch (err) {
    next(err);
  }
});

// GERENCIAR STOCK 
router.get('/stock/verificar', async (req, res, next) => {
  try {
    let _obj = req.body;
    _obj.idUser = req.autenticated.user.id;
    const response = await StockDriver.verificar(_obj);
    if (response == true)
      return res.responser(200, 'Stock verificado e encontra-se atual.', response);
    else
      return res.responser(200, 'Stock atualizado, você terá que reabastecer.', response);
  } catch (err) {
    next(err);
  }
});

router.get('/stock/reabastecer', async (req, res, next) => {
  try {
    let _idUser = req.autenticated.user.id;
    let list = [];

    for (i = 0; i < process.env.PRODUCT_QTD; i++) {
      list.push({
        idUser: _idUser,
        idProducts: process.env.PRODUCT_ID
      });
    }
    const response = await StockDriver.save(list);
    return res.responser(200, 'Stock atualizado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.get('/stock/atualizar', async (req, res, next) => {
  try {
    
    const response = await StockDriver.atualizar(req.query, req.autenticated.user.id);
    return res.responser(200, 'Pedido atualizado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.get('/stock/obter', async (req, res, next) => {
  try {
    const response = await StockDriver.get({ idUser: req.autenticated.user.id });
    return res.responser(200, 'obter  com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.get('/stock/zerar', async (req, res, next) => {
  try {
    const response = await StockDriver.zerar(req.autenticated.user.id);
    return res.responser(200, 'Stock zerado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

// ORDERS
router.get('/orders', async (req, res, next) => {
  try {
    let _filter = {
      idOrderStatus: 3
    }
    const response = await Order.get(_filter);
    return res.responser(200, 'RealLocation cadastrado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

// ESTABELECER ENTREGAS/ROTAS
router.get('/delivery/check', async (req, res, next) => {
  try {

    let _resCompativel = [];
    let _location = {};
    let _googleReturn = {};
    let _destinations = '';
    const rsOrdrs = await Order.getDelivery();
    if (rsOrdrs.length == 0)
      return res.responser(202, 'Não pedidos para ser entregue.', false);
    const _stock = await StockDriver.get({ idUser: req.autenticated.user.id }, false, true);
    _resCompativel = Util.getDeliveryCompativel(rsOrdrs, _stock);
    if (_resCompativel.length == 0)
      return res.responser(202, 'Não há produtos suficiente em seu estoque.', false);
    _destinations = Util.returnLocationOrders(_resCompativel);

    const _getLocation = await RealLocation.get({ idUser: req.autenticated.user.id, order: 'createdAt:DESC', limit: 1 }, false, true);
    if (_getLocation[0].length > 0) {
      _location.latitude = _getLocation[0][0].latitude;
      _location.longitude = _getLocation[0][0].longitude;
    }

    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?mode=driving&language=pt-BR&key=${process.env.KEY_MAPS}&origins=${_location.latitude},${_location.longitude}&destinations=${_destinations}`,
      headers: {
      }
    };

    await axios(config).then(function (response) {
      _googleReturn = response.data;
    }).catch(function (error) {
      return res.responser(400, 'RealLocation cadastrado com sucesso.', error);
    });
    let _tmp = Util.returnMinTimeDelivery(_googleReturn, _resCompativel);
    if (_tmp != undefined) {
      let _del = {
        idOrder: _tmp.idOrder,
        idUser: req.autenticated.user.id,
        idDeliveryStatus: 3
      }

      let _dels = await Delivery.save(_del, JSON.stringify(_location));
      _tmp.delivery = _dels;

      await Order.update({ idOrderStatus: 6 }, { id: _tmp.idOrder });
      await DeliveryHistory.save({ idDelivery: _dels.id, location: JSON.stringify(_location) });
      return res.responser(200, 'Delivery cadastrado com sucesso.', _tmp);

    } else {
      return res.responser(400, 'Error ao coletar Delivery', _tmp);
    }

  } catch (err) {
    next(err);
  }
});

router.get('/delivery/ativo', async (req, res, next) => {
  try {

    let _resCompativel = [];
    const _del = await Delivery.get({ idUser: req.autenticated.user.id, idDeliveryStatus: 3 }, false, true);
    let _delivery = _del[0];
    if (_delivery.length > 0) {
      const rsOrdrs = await Order.getDeliveryAtivo(_delivery[0].idOrder);
      if (rsOrdrs.length == 0)
        return res.responser(202, 'Não pedidos para ser entregue.', false);
      const _stock = await StockDriver.get({ idUser: req.autenticated.user.id }, false, true);
      _resCompativel = Util.getDeliveryCompativel(rsOrdrs, _stock);
      if (_resCompativel.length == 0)
        return res.responser(202, 'Não há produtos suficiente em seu estoque.', false);

      let _tmp = _resCompativel[0];
      _tmp.delivery = _delivery[0];

      return res.responser(200, 'Delivery cadastrado com sucesso.', _tmp);
    } else {
      return res.responser(202, 'Nenhum Delivery ativo.');
    }
  } catch (err) {
    next(err);
  }
});



module.exports = router;