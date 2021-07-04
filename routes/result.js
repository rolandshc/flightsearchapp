var express = require('express');
var router = express.Router();
const request = require('request');


router.get('/', function (req, res, next) {
  req.setTimeout(360000);
  try {
    const requestOptions = {
      url: 'http://localhost:3000/api',
      method: 'GET',
      json: req.query,
      qs: {
      }
    };
    request(requestOptions, (err, response, body) => {
      if (err) {
        console.log("err = " + err);
      } else if (response.statusCode === 200) {
        if (body.hasOwnProperty('error')) {
          res.send(body);
        } else {
          res.render('result', { flightData: body });
        }
      } else {
        console.log(response.statusCode);
      }
    });
  }
  catch (err) {
    console.error(err.message);
    res.send('Error message:' + err);    // echo the result back
  }
});

module.exports = router;