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


router.get('/', async (req, res, next) => {
  try {

    let _res = await InvokeLambda();
    console.log(_res);
    let returnLambdaObj = JSON.parse(_res);
    let _sd = returnLambdaObj?.Items.find(c => c._id == 'pageblock');
    return res.responser(200, 'Config listada com sucesso.', _sd.value);
  } catch (err) {
    next(err);
  }
});

module.exports = router;