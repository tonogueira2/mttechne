const express = require('express');
const router = express.Router();

const UsersClass = require(`../../interfaces/classes/users`);
let Users = new UsersClass();
const RealLocationClass = require(`../../interfaces/classes/realLocation`);
let RealLocation = new RealLocationClass();

router.post('/', async (req, res, next) => {
  try {
    const response = await Users.save(req.body);
    return res.responser(200, 'Users cadastrado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const users = await Users.get(req.query, attributes);
    const response = {
      rows: users[0],
      count: users[1]
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




router.get('/allLocation', async (req, res, next) => {
  const attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const users = await RealLocation.getAllUser(req.query, attributes);
    if (users.count) {
      return res.responser(200, 'Os usuários foram listados com sucesso.', users);
    } else {
      return res.responser(200, 'Nenhum usuário foi encontrado.', users);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});

router.get('/local/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador não é válido.');
  }

  try {
    const users = await RealLocation.getLocal(req.params.id);
    if (users.count) {
      return res.responser(200, 'Os usuários foram listados com sucesso.', users);
    } else {
      return res.responser(200, 'Nenhum usuário foi encontrado.', users);
    }
  } catch (err) {
    return err;
    //next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do users não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const users = await Users.get(req.params, attributes);
    const response = {
      rows: users[0],
      count: users[1]
    }

    if (response.count) {
      return res.responser(200, 'Usuário listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum usuário foi encontrado para ser listado.', response);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do users não é válido.');
  }
  if (req.autenticated?.user?.level != 'ADMINISTRADOR'){
    return res.responser(400, 'Usuário não pode realizar essa ação.');
  }
  let usersData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    telefone: req.body.telefone,
    level: req.body.level,
  }

  try {
    const response = await Users.update(usersData, req.params);
    return res.responser(200, 'Usuário atualizado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador não é válido.');
  }

  try {
    const response = await Users.delete(req.params.id);
    if (response) {
      return res.responser(200, 'Usuário deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Usuário não encontrado para ser deletado.', response);
    }
  } catch (err) {
    next(err);
  }
});




module.exports = router;