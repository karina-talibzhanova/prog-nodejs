var express = require('express');
var app = express();

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCekgB4vQu-raXkvMR_pZXFUmqCG7LIXj4',
  Promise: Promise
});

var collegeCoords = {
  "Collingwood": [54.7629, -1.5765],
  "Grey": [54.7648, -1.5756],
  "Hatfield": [54.774305, -1.574551],
  "Josephine Butler": [54.7598, -1.5798],
  "St Aidan's": [54.7650, -1.5832],
  "St Chad's": [54.772925, -1.574695],
  "St Cuthbert's Society": [54.7708, -1.5774],
  "St Hild & St Bede": [54.7775, -1.564815],
  "St John's": [54.7719, -1.5757],
  "St Mary's": [54.7663, -1.5778],
  "Trevelyan": [54.7644, -1.5799],
  "University": [54.7752, -1.5764],
  "Ustinov": [54.769288, -1.591382],
  "Van Mildert": [54.7632, -1.5811],
  "Stephenson": [54.7596, -1.5813],
  "John Snow": [54.759667, -1.580917],
}

app.use(express.static('public'));

console.log("server running");

function getRoute (req, callback)  {
  googleMapsClient.directions({
  origin: req.origin,
  destination: req.destination,
  mode: "walking",
  waypoints: req.waypoints,
  optimize: true,

  }, function(err, response) {
    console.log(err);
    console.log(response);
    if (!err) { 
      callback(response);
    };
  });
};

var inputs = {
  origin: collegeCoords["Van Mildert"],
  destination: collegeCoords["Hatfield"],
  waypoints: [collegeCoords["Trevelyan"], collegeCoords["St Mary's"], collegeCoords["St Aidan's"]],
};

app.get('/test', function(req, resp) {
  resp.send("test");
});

app.get('/optimizeRoute', function(req, resp) {
  // get the origin, destination and waypoints
  // make the API call and get the waypoint order from the JSON
  // return the waypoint order so that the embedded map can show the optimal route
  // calculate directions with a promise
  // console.log("before google maps");
  
  // getRoute(inputs, function(result){
  //   console.log("Response: ", JSON.stringify(JSON.parse(JSON.stringify(result))))
  //   resp.send(result);
  // })
  console.log("lol wut");
  resp.send("yeeeet");

});

module.exports = app;
