var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET Applications page. */

router.get('/applications', function(req, res) {
    var db = req.db;
    var collection = db.get('simsi');
    collection.find({},{},function(e,docs){
        res.render('applications', {
            "rounds" : docs
        });
    });
});

/* GETNext Round */
router.post('/nextround', function(req, res) {
   // Set our internal DB variable
    var db = req.db;

     // Get our form values. These rely on the "name" attributes
    var gameId = req.body.game;
    var currentRound = req.body.round;
    var collection = db.get('simsi');

	collection.findOne({guid: gameId},function(e,doc){
        myDocument = doc;
	    processNextRound(req, res, doc, parseInt(currentRound)+1);
    });

	/*
	if (myDocument == null){
		res.send("Document guid et round non trouvé.");
	}
	else{
	   process.stdout.write("hello1: " + myDocument.round);
	   process.stdout.write("hello2: " + myDocument.guid);
	   newDocument = myDocument;
	   //newDocument = JSON.parse(JSON.stringify(obj1));
	   //newDocument.round = currentRound + 1;
	   process.stdout.write("hello0: " + newDocument._id);
	   process.stdout.write("hello0: " + newDocument.guid);
	   process.stdout.write("hello0: " + newDocument.round);

	}

	process.stdout.write("hello3: " + myDocument._id);

    // Submit to the DB
    collection.insert(newDocument, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("applications");
        }
    });
	*/
});


/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

 function processNextRound(req, res, doc, newRound) {
      console.dir(doc);
      delete doc._id;
      doc.round = newRound;

      var db = req.db;
      var collection = db.get('simsi');

      collection.insert(doc, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("applications");
        }
    });

  }

module.exports = router;
