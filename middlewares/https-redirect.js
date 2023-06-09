const config = require('config');
const HTTPS = "https";

module.exports = (req, res, next) => {
  if (config.webserver['redirect-https']) {
    if (req.headers["x-forwarded-proto"] === HTTPS) {
      return next();
    }
    
    console.log('Redirecionando para protocolo HTTPS...')
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  } else {
    return next();
  }
}