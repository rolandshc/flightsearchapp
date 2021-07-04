var express = require('express');
var router = express.Router();
var service = require('../services/DataServices.js');

/* GET airports listing. */
router.get('/', function(req, res, next) {
  // geting airport list from data Service

  service.getAirports().then(
      function (list) {
        const sortedList = list.sort()
      res.render('index', { "airports": sortedList });
    },
    function (err) {
      console.error('Something went wrong:', err);
      res.send("There was a problem adding the information to the database. " + err);
    }
    );
});


module.exports = router;
