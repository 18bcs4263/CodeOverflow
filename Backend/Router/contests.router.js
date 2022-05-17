var express = require('express');
var router = express.Router();
var contests = require('../models/contests.model');

router.post('/create', (req, res) => {
	console.log("we are here")
	console.log(req.body)
	var obj = {
		name: req.body.name,
		desc: req.body.desc,
		startDate: Number(Date.parse(req.body.startDate).toString()),
		link: req.body.link,
		isPrevious: false
	}
	contests.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			res.send("Creation Successful");
		}
	});
});

function checkAndUpdateContests() {
	var today = new Date()
	var todNum = Number(Date.parse(today.toDateString()).toString())
	var items;
	contests.find({}, (err, items) => {
		if (err) { 
			console.log("!!" + err);
		} else {
			items.forEach((item, index, items) => {
				if (item.startDate < todNum && item.isPrevious == false) {
					contests.updateOne(item, { $set: { isPrevious: true } }, (err, res) => {
						if (err) console.log("!!!" + err);
						console.log("1 document updated");
					})
				}
			}
			)
		}
	})

};

router.get("/getAllContests", (req, res) => {
	var today = new Date()
	checkAndUpdateContests()
	console.log(today.toDateString())
	contests.find({}, (err, items) => {
		if (err) {
			console.log(err);
		}
		else {
			res.json({ items: items });
		}
	});
	//contests.find({"startDate" : {$gt : }})
});
module.exports = router;