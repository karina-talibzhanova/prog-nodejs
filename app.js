var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCekgB4vQu-raXkvMR_pZXFUmqCG7LIXj4',
  Promise: Promise
});

var app = express();

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("server running");

app.get('/optimizeRoute/:start/:end/:waypoints', function(req, resp) {
  // get the origin, destination and waypoints
  // make the API call and get the waypoint order from the JSON
  // return the waypoint order so that the embedded map can show the optimal route
  // calculate directions with a promise
  console.log("before google maps");
  response = getRoute(origin1, destination1, waypoints1);

  return resp.send(response);
});

// googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'}).asPromise()
//   .then((response) => {
//     console.log(response.json.results);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// async function getRoute (start, end, waypoints) {
//   googleMapsClient.directions({origin: start, destination: end, mode: 'walking', waypoints: waypoints, optimize: true}).asPromise()
//     .then((response) => {
//       console.log("we got here");
//       return response.json.results;
//     })
//     .catch((err) => {
//       throw(err);
//     });
// }

// let test = getRoute("Collingwood College", "Van Mildert College", "Grey College|Hatfield College|Trevelyan College");
// console.log(test);

// googleMapsClient.directions({origin: 'Van Mildert College', destination: 'Hatfield College'}).asPromise()
//   .then((response) => {
//     console.log(response.json.results);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

  function getDirections (req, callback)  {
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
  
  getDirections(inputs, function(result){
    console.log("Response: ", JSON.stringify(JSON.parse(JSON.stringify(result))))
  })

module.exports = app;
