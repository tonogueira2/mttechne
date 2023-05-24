const express = require('express');
const router = express.Router();

const UserLocationsClass = require(`../../interfaces/classes/userLocations`);
let UserLocations = new UserLocationsClass();


router.post('/', async (req, res, next) => {
  try {
    let _obj = req.body;
    delete _obj.selected;
    _obj.idUser = req.autenticated.user.id;
    const response = await UserLocations.save(req.body);
    return res.responser(200, 'UserLocations cadastrado com sucesso.', response);
  } catch (err) {
    return res.responser(400, err.msg, err);
  }
});


router.get('/:idUser', async (req, res, next) => {
  if (!req.params.idUser || isNaN(req.params.idUser) || req.params.idUser < 1) {
    return res.responser(400, 'O identificador do userLocations não é válido.');
  }

  let attributes = req.query.attributes ? req.query.attributes : false;
  try {
    const userLocations = await UserLocations.get(req.params, attributes);
    const response = {
      rows: userLocations[0],
      count: userLocations[1]
    }

    if (response.count) {
      return res.responser(200, 'Endereço listado com sucesso.', response);
    } else {
      return res.responser(200, 'Nenhum endereço de usuário foi encontrado.', response);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id) || req.params.id < 1) {
    return res.responser(400, 'O identificador do userLocations não é válido.');
  }

  let userLocationsData = {
    name: req.body.name,
    number: req.body.number,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    cep: req.body.cep,
    formattedAddress: req.body.formattedAddress,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }

  try {
    const response = await UserLocations.update(userLocationsData, req.params);
    return res.responser(200, 'Endereço atualizado com sucesso.', response);
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  if (!req.body.ids || !Array.isArray(req.body.ids) || !req.body.ids.length) {
    return res.responser(400, 'O identificador do endereço não é válido.');
  }

  try {
    const response = await UserLocations.delete(req.body.ids);
    if (response) {
      return res.responser(200, 'Endereço deletado com sucesso.', response);
    } else {
      return res.responser(400, 'Endereço não encontrado para ser deletado.', response);
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;