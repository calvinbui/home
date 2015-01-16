/**
 * Created by Calvin on 6/11/2014.
 */
//express stuff
var express     = require('express'),
    app = express(),
    router = express.Router(),

//different modules
    fs          = require('fs'),
    async       = require('async'),
    winston     = require('winston'),
    portscanner = require('portscanner'),

// config file
    config = require('./config.json'),

// Routes
    requireDir = require('require-dir'),
    routes = requireDir('./app/routes'),

// mongoose and friends
    mongoose = require('mongoose'),
    bodyParser  = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static routes for css, js etc.
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/app',  express.static(__dirname + '/app'));

// routes
for (var i in routes) app.use('/', routes[i]);

// connect to database
mongoose.connect(config.database_path, function (err) {
    if (err) winston.error("Could not connect to the database: " + err);
    else winston.info("Database connection successful");
});

// run app on port 80
app.listen(80, function() {
    winston.info("Listening on port 80");
});

// load index page when going to root directory
app.get('/', function (req, res) {
    winston.info("Loading Index Page");
    res.sendFile(__dirname + '/app/views/index.html');
});

// test config file
router.get('/services', function (req, res) {
    var services = readJsonFileSync(__dirname + '/app/models/services.json', 'UTF8'); //get JSON array
    async.each(services,
        function(service, callback) {
            async.each(service.items,
                function (service, callback) { // for each element in array
                    portscanner.checkPortStatus(service.port, service.ip, function(error, status){ //scan if the port is open on the ip address
                        service.status = status; //add new value with result
                        callback();
                    });
                }, function allDone() {
                    callback();
                }
            );
        }, function allDone() {
            res.send(services); //display new array on browser, but is not updated
        }
    );
});

// read and interpret JSON file
function readJsonFileSync(filepath, encoding){
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

// use the router
app.use('/', router);