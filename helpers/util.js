const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

class Util {
  constructor() { }

  encryptPassword(salt, password) {
    salt = salt.split("-");
    password = salt[1] + password + salt[3];
    return bcrypt.hashSync(password, 10);
  }

  checkPassword(salt, password, hash) {
    salt = salt.split("-");
    password = salt[1] + password + salt[3];
    return bcrypt.compareSync(password, hash);
  }

  generateGuid() {
    return uuid.v4();
  }

  createToken(user) {
    return new Promise((resolve, reject) => {
      jwt.sign({ user }, process.env.SECRET_KEY, { algorithm: 'HS512', expiresIn: "1d" }, (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      })
    })
  }

  retornaStatusOrder(obj) {
    let res = 2;
    if (obj.paymentStatus == 0) {
      res = 2;
    } else if (obj.paymentStatus == 1) {
      res = 3;
    } else if (obj.paymentStatus == 2) {
      res = 3;
    } else if (obj.paymentStatus == 3) {
      res = 5;
    } else if (obj.paymentStatus == 10) {
      res = 5;
    } else if (obj.paymentStatus == 11) {
      res = 5;
    } else if (obj.paymentStatus == 12) {
      res = 2;
    } else if (obj.paymentStatus == 13) {
      res = 5;
    } else if (obj.paymentStatus == 20) {
      res = 2;
    }
    return res;
  }

  retornaStatusOrderPix(obj) {
    let res = 2;
    if (obj.status == "pending"){
      res = 2;
    } else if(obj.status == "approved"){
      res = 3;
    } else if(obj.status == "authorized"){
      res = 2;
    } else if(obj.status == "in_process"){
      res = 2;
    } else if(obj.status == "in_mediation"){
      res = 2;
    } else if(obj.status == "rejected"){
      res = 5;
    } else if(obj.status == "cancelled"){
      res = 5;
    }else if(obj.status == "refunded"){
      res = 5;
    }else if(obj.status == "charged_back"){
      res = 5;
    }
    return res;
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  getDeliveryCompativel(rsOrdrs, _stock) {
    let _resCompativel = [];
    let _resOrders = [];
    if (rsOrdrs != undefined && rsOrdrs.length > 0) {
      rsOrdrs.map(c => {
        let _obj = c.dataValues
        let order = _obj?.order?.dataValues;
        let userLocations = _obj?.userLocations?.dataValues;
        _obj.order = order;
        _obj.userLocations = userLocations;
        _obj.name = _obj?.user?.dataValues?.name;
        _resOrders.push(_obj);
      });
      if (_stock != undefined && _stock[1] > 0) {
        _resOrders.map(o => {
          let _orderItens = [];
          o?.order?.orderItens?.map(oi => { _orderItens.push(oi.dataValues); });

          let idsItens = [...new Set(_orderItens.map(i => i.idProducts))]
          let groupProducts = this.groupBy(_orderItens, oi => oi.idProducts);
          let groupStock = this.groupBy(_stock[0], oi => oi.idProducts);
          let ehCompativel = true;
          idsItens?.map(i => {
            let _groupStock = groupStock.get(i);
            if (!groupStock.get(i) || groupProducts.get(i).length > groupStock.get(i).length)
              ehCompativel = false;
          })
          if (ehCompativel == true) {
            let _o = o;
            let _newOrderItens = [];
            for (let u = 0; u < idsItens?.length; u++) {
              let _tmp = _orderItens.find(s => s.idProducts == idsItens[u])
              _tmp.name = `${groupProducts.get(idsItens[u]).length} x (${_tmp.product?.dataValues?.name})`;
              _newOrderItens.push(_tmp);
            }

            _o.order.orderItens = _newOrderItens;
            _resCompativel.push(_o)
          }
        })
      }
    }
    return _resCompativel;
  }
  returnLocationOrders(_resCompativel) {
    let _destinations = '';
    if (_resCompativel.length > 0) {
      _resCompativel?.map(c => {
        let _ob = `${c?.userLocations?.latitude},${c?.userLocations?.longitude}`
        if (_destinations.length > 0)
          _destinations = `${_destinations}|${_ob}`
        else
          _destinations = _ob;
      })
    }
    return _destinations;
  }

  returnMinTimeDelivery(data, reference) {
    let _res;
    let _tmp = [];
    //data?.rows[0]?.elements[i]?.sort((a, b) => { return a?.duration?.value - b?.duration?.value });
    data?.destination_addresses?.map((c, i) => {
      _tmp.push({ id: i, addresses: c, latitude: reference[i]?.userLocations?.latitude, longitude: reference[i]?.userLocations?.longitude, data: data?.rows[0]?.elements[i]?.duration?.value });
    })
    _tmp = _tmp.sort(function (a, b) { return a.data - b.data });
    return reference[_tmp[0].id];
  }


  cipherCiphers = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  }

  decipherCiphers = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  }

}

module.exports = Util;