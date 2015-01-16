/**
 * Created by Calvin on 14/11/2014.
 */

// REST for items :)
var express = require('express');
router = express.Router(),
    Item = require('../models/Item'),
    Section = require('../models/Section'),
    url = require('url'),
    winston = require('winston');

// determine which port to assign to the url
var getIPPort = function(item) {
    item.ip   = url.parse(item.url).hostname
    item.port = url.parse(item.url).port

    if (url.parse(item.url).port == null) {
        if (url.parse(item.url).protocol == 'http:')
            item.port = 80;
        else if (url.parse(item.url).protocol == 'https:')
            item.port = 443;
        else if (url.parse(item.url).protocol == 'ftp:')
            item.port = 21;
        else if (url.parse(item.url).protocol == 'rsync:')
            item.port = 873;
        else
            item.port = 22
    }

    console.log(item);
}

// middleware
router.use(function (req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

// CREATE ITEM
router.route('/section/:section_id').post(function (req, res) {
    var item = new Item(req.body);
    item.section = req.params.section_id;
    getIPPort(item);
    item.save(function (err) {
        Section.findById(req.params.section_id, function (err, section) {
            section.items.push(item._id); //id generated automatically by mongoose when new Item() above
            section.save(function (err) {
                res.json(section);
            });
        });
    });
});

// route for CRUD Items
router.route('/section/:section_id/:item_id')
    // READ ITEM
    .get(function (req, res) {
        Item.findById(req.params.item_id, function (err, item) {
            if (err)
                res.send(err);
            else
                res.json(item);
        });
    })

    // UPDATE ITEM
    .put(function (req, res) {
        Item.findById(req.params.item_id, function (err, item) {
            if (err)
                res.send(err);
            else {
                // update all fields except ID
                for (var i in req.body) {
                    if (req.body[i] != item[i])
                        item[i] = req.body[i];
                };
                getIPPort(item);
            }
            item.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({message: 'Item updated!' + item});
            });
        });
    })

    // DELETE ITEM
    .delete(function (req, res) {
        Section.findById(req.params.section_id, function (err, section) {
            if (err)
                res.send(err);
            else {
                section.items.pull(req.params.item_id);
                section.save(function (err) {
                    if (err)
                        res.send(err);
                });
            }
        });

        // delete item from section
        Item.remove({_id: req.params.item_id}, function (err) {
            if (err)
                res.send(err);
            else
                res.end(res.json({message: 'Item deleted!'}));
        })
    }
);

module.exports = router;

