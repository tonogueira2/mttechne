const express = require('express');
const router = express.Router();

const OrdersClass = require(`../../interfaces/classes/orders`);
let Orders = new OrdersClass();


router.post('/', async (req, res, next) => {
  try {
    let _tmp = req.body;
    _tmp.idUser = req.autenticated.user.id;
    const response = await Orders.save(req.body);
    return res.responser(200, 'Orders cadastrado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

// TODO - trazer todos os pedidos com todos objetos de relacionamento 
// pedidos por dia, top 10 pedidos clientes

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const orders = await Orders.get(req.query, attributes);
    const response = {
      rows: orders[0],
      count: orders[1]
    }

    if (response.count) {
      return res.responser(200, 'Os pedidos foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum pedido foi encontrado.', response);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});

router.get('/dashboard', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const orders = await Orders.getDashboard(req.query, attributes);
    const response = {
      rows: orders[0],
      count: orders[1]
    }

    if (response.count) {
      return res.responser(200, 'Os pedidos foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum pedido foi encontrado.', response);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});

router.get('/admin/clientes', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const orders = await Orders.getAdminCliente(req.query, attributes);
    const response = {
      rows: orders[0],
      count: orders[1]
    }

    if (response.count) {
      return res.responser(200, 'Os pedidos foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum pedido foi encontrado.', response);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});

router.get('/cliente', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const orders = await Orders.getCliente({ idUser: req.autenticated.user.id }, attributes);
    const response = {
      rows: orders[0],
      count: orders[1]
    }

    if (response.count) {
      return res.responser(200, 'Os pedidos foram listados com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum pedido foi encontrado.', response);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do orders não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const orders = await Orders.get(req.params, attributes);
    const response = {
      rows: orders[0],
      count: orders[1]
    }

    if (response.count) {
      return res.responser(200, 'Pedido listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum pedido foi encontrado para ser listado.', response);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do orders não é válido.');
  }

  let ordersData = {
    valor: req.body.valor,
    descricao: req.body.descricao,
    fechado: req.body.fechado,
  }

  try {
    const response = await Orders.update(ordersData, req.params);
    return res.responser(200, 'Pedido atualizado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  if (!req.body.ids || !Array.isArray(req.body.ids) || !req.body.ids.length) {
    return res.responser(400, 'O identificador do pedido não é válido.');
  }

  try {
    const response = await Orders.delete(req.body.ids);
    if (response) {
      return res.responser(200, 'Pedido deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Pedido não encontrado para ser deletado.', response);
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;