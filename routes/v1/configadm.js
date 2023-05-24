const router = require('express').Router();
const AWS = require("aws-sdk");

const InvokeLambda = (val) => {

  AWS.config.update({
    region: "sa-east-1",
    accessKeyId: "AKIA46TAYJSJLBTAY2WS",
    secretAccessKey: "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"
  });
  var lambda = new AWS.Lambda();
  return new Promise((resolve, reject) => {
    let params = {
      FunctionName: 'serverless-lambda-admin-production-blockpage', // the lambda function we are going to invoke
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


router.post('/', async (req, res, next) => {
  try {
    let _obj = { ...req.body };

    let _res = await InvokeLambda(JSON.stringify(_obj));
    console.log(_res);
    let returnLambdaObj = JSON.parse(_res);


    return res.responser(200, 'Config atualizado com sucesso.', returnLambdaObj);
  } catch (err) {
    next(err);
  }
});


router.get('/', async (req, res, next) => {
  try {

    let _res = await InvokeLambda();
    console.log(_res);
    let returnLambdaObj = JSON.parse(_res);

    return res.responser(200, 'Config listada com sucesso.', returnLambdaObj);
  } catch (err) {
    next(err);
  }
});

module.exports = router;