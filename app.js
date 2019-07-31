var express = require('express');
var app = express();

app.use(express.static('public'));

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCekgB4vQu-raXkvMR_pZXFUmqCG7LIXj4',
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

console.log("server running");

function getRoute (req, callback)  {
  googleMapsClient.directions({
  origin: req.origin,
  destination: req.destination,
  mode: "walking",
  waypoints: req.waypoints,
  optimize: true,

  }, function(err, response) {
    if (!err) { 
      callback(response);
    };
  });
};


// get the origin, destination and waypoints
// make the API call and get the waypoint order from the JSON
// return the waypoint order so that the embedded map can show the optimal route
app.get('/optimizeRoute/:start/:end/:waypoints', function(req, resp) {

  let waypointList = req.params.waypoints.split(",");

  let waypointParam = [];
  var i;
  for (i = 0; i < waypointList.length; i++) {
      waypointParam.push(collegeCoords[waypointList[i]]);
  }

  var inputs = {
    origin: collegeCoords[req.params.start],
    destination: collegeCoords[req.params.end],
    waypoints: waypointParam
  }
  
  getRoute(inputs, function(result){
    resp.send(result);
  })

});

module.exports = app;
