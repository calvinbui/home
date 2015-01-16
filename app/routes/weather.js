/**
 * Created by Calvin on 14/11/2014.
 */
var express = require('express');
router = express.Router();
Forecastio = require('forecastio'),
    config = require('../../config.json'),
    moment = require('moment'),
    winston = require('winston');

// grab the weather and convert it as necessary.
router.get('/weather', function (req, res) {
    winston.info('Retrieving weather from Forecast IO');
    new Forecastio(config.forecast_api).forecast(config.weather_lat, config.weather_long, {units: config.weather_units}, function (err, data) {
        if (err) throw err;
        res.send({
            // dont even use most of this stuff.
            currentTemp: Math.round(data.currently.temperature),
            currentSummary: data.currently.summary,
            weatherIcon: data.currently.icon,
            sunrise: moment.unix(data.daily.data['1'].sunriseTime).format("h:mm a"),
            sunset: moment.unix(data.daily.data['1'].sunsetTime).format("h:mm a"),
            hourlySummary: data.hourly.summary,
            weeklySummary: data.daily.summary,
            todaySummary: data.daily.data['1'],
            tomorrowSummary: data.daily.data['2'],
            dayAfterTomorrowSummary: data.daily.data['3'],
            dayAfterThatSummary: data.daily.data['4'],
            dayAfterAfterThatSummary: data.daily.data['5'],
            dayAfterAfterAfterThatSummary: data.daily.data['6'],
            lastDaySummary: data.daily.data['7']
        });
        winston.info('Weather retrieved.');
    });
});

module.exports = router;