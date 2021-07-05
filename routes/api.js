var express = require('express');
var router = express.Router();
var service = require('../services/DataServices.js');


router.post('/', function (req, res) {
  req.setTimeout(360000);
  try {
    const from = "airports/" + req.body["from"].toString();
    const to = "airports/" + req.body["to"].toString();
    console.log(" req.body");
    console.log(from);
    console.log(to);
    const dateString = "" + req.body["date"].toString().replace(/\//g, '-');
    const date = dateString.replace(/(^|-)0+/g, "$1").split("-");
    console.log("SEARCH FOR FLIGHT FROM " + from + " TO " + to + " ON " + dateString);
    const year = parseInt(date[0]);
    const month = parseInt(date[1]);
    const day = parseInt(date[2]);

    // function handleDelay(delayData) {
    //   if (delayData.GroundDelays.count > 0) {
    //     body.GroundDelays.groundDelay.forEach(delay => {
    //       console.log(" ground delay.airport = " + delay.airport);
    //       delayList.push({
    //         key: delay.airport,
    //         value: delay.maxTime
    //       });
    //     });
    //   }
    //   else {
    //     console.log("no groundDelay");
    //   }
    //   if (body.ArriveDepartDelays.count > 0) {
    //     body.ArriveDepartDelays.arriveDepart.forEach(delay => {
    //       console.log("arrive depart delay.airport = " + delay.airport);
    //       delayList.push({
    //         key: delay.airport,
    //         value: delay.maxTime
    //       });
    //     });
    //   }
    //   else {
    //     console.log("no arriveDepart delay");
    //   }
    // };


    // Promise.all([service.getFastestPathByDate(from, to, day, month, year), service.getDelay()]).then((values) => {
    //   //if (values[1].body.GroundDelays) { const delayData = handleDelay(values[1].body) };
    //   res.setHeader('Content-Type', 'application/json');
    //   res.send(JSON.stringify(values[0]));
    // }, (err) =>{
    //   console.error('APIjs Something went wrong:', err.message);
    //   res.send("There was a problem fetching data with API. " + err);
    // });


    service.getFastestPathByDate(from, to, day, month, year).then(
      function (list) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(list));
      },
      function (err) {
        console.error('APIjs Something went wrong:', err.message);
        res.send("There was a problem adding the information to the database. " + err);
      }
    );
  }
  catch (err) {
    console.error("ERROR Message = " + err.message);
    res.send('Error message:' + err);    // echo the result back
  }
});

module.exports = router;