/**
 * Created by Calvin on 14/11/2014.
 */
var express     = require('express');
    router      = express.Router(),
    Section     = require('../models/section'),
    Item        = require('../models/item'),
    async       = require('async'),
    portscanner = require('portscanner'),
    winston     = require('winston');

//middleware
router.use(function (req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

// route for CRUD SECTIONS
router.route('/section')
    // CREATE SECTION
    .post(function (req, res) {
        var section = new Section();
        // only takes a new name
        section.name = req.body.name;
        section.save(function (err) {
            if (err)
                res.send(err);
            res.json(section);
        });
    })

    // READ SECTION
    .get(function (req, res) {
        Section.find(function (err, section) {
            if (err)
                res.send(err);
        }).populate('items').exec(function(err, section) {
            var services = section; //get JSON array
            async.each(services, function(service, callback) {
                async.each(service.items, function (item, callback) { // for each element in array
                    portscanner.checkPortStatus(item.port, item.ip, function(error, status){ //scan if the port is open on the ip address
                        item.status = status; // fill in the status element with the port scanner value
                        callback(); // loop the next one
                    });
                }, function allDone() {
                    callback(); // finished looping
                });
            }, function allDone() {
                res.send(services); //display new array on browser, but is not updated
            });
        });
    }
);

// route for specific sections
router.route('/section/:section_id')
    // READ SECTION
    .get(function (req, res) {
        Section.findById(req.params.section_id, function (err, section) {
            if (err)
                res.send(err);
            else
                res.json(section);
        });
    })

    // UPDATE SECTION NAME
    .put(function (req, res) {
        Section.findById(req.params.section_id, function (err, section) {
            if (err)
                res.send(err);
            else {
                section.name = req.body.name;

                section.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json(section);
                });
            }
        });
    })

    // DELETE SECTION
    .delete(function (req, res) {
        Section.remove({_id: req.params.section_id}, function (err) {
            if (err)
                res.send(err);
        });

        // delete items in section
        Item.remove({section: req.params.section_id}, function (err) {
            if (err)
                res.send(err);
        });

        res.json({message: 'Section deleted!'})
    }
);

module.exports = router;
