const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let authHeader = req.header("Authorization");
    let sessionID = authHeader.split(" ")[1];
    if (sessionID) {
      let userData = await jwt.verify(sessionID, process.env.SECRET_KEY);
      if (userData) {
        req.autenticated = userData;
        req.token = sessionID;
        return next();
      } else {
        return res.status(401).send({
          ok: false,
          error: {
            reason: "Invalid Sessiontoken",
            code: 401,
          },
        });
      }
    } else {
      return res.status(401).send({
        ok: false,
        error: {
          reason: "Token não validado",
          code: 401,
        },
      });
    }
  } catch (err) {
    return res.status(401).send({
      status: 401,
      msg: "Token não é válido ou a sessão expirou",
    });
  }
};
