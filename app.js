var express = require('express');
var app = express();
var bp = require('body-parser');
var Mongo = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/permitplus'
var path = require("path");

app.use(bp.json());
app.use(bp.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index.ejs');
})

// #3
app.get('/index', function(req,res,next){
  Mongo.connect(dbURL, function(err,db){
    if (err) return next(err);
     var permits = db.collection('permitplus');
    permits.find({}).toArray(function(err,names){
      if (err) return next(err);

      console.log(names);
      console.log("in get route");
      res.json(names);

      db.close();
    });
  });
});

app.post('/permitapp', function(req,res,next){
  console.log("In post app");
  // perform insert
  Mongo.connect(dbURL,function(err,db){
    if (err) return next(err);
    var permitApplication = { 
	"Project" : {
			"Job Address" : req.body.jobaddress,
			"City" : req.body.city,
			"State" : req.body.state,
			"Zipcode" : req.body.zipcode,
			"Property Value" : req.body.value,
			"Job Description" : req.body.description
	},
	"Applicant" : {
			"Applicant Name" : req.body.applicant,
			"Applicant Phone Number" : req.body.appphone,
			"Applicant Email" : req.body.appemail
	},
	"Contact" : {
			"Contact Name" : req.body.contact,
			"Contact Phone Number" : req.body.contactphone,
			"Contact Email" : req.body.contactemail			
	} ,
	"Architect" : {
			"Architect Name" : req.body.architect,
			"Architect Phone Number" : req.body.architectphone,
			"Architect Email" : req.body.architectemail
	} ,
	"Property Owner" : {
		"Owner Name" : req.body.ownername,
		"Owner Address" : req.body.owneraddress,
		"Owner City" : req.body.ownercity,
		"Owner State" : req.body.ownerstate,
		"Owner Phone Number" : req.body.ownerphone
	} ,
	"Contractor" : {
		"Contractor Name" : req.body.contractorname,
		"Contractor Address" : req.body.contractoraddress,
		"Contractor City" : req.body.contractorcity,
		"Contractor State" : req.body.contractorstate,
		"Contractor Phone Number" : req.body.contractorphone		
	} ,
	"Submission" : {
		"Signed Full Name" : req.body.fullname,
		"Date" : req.body.date,
		"Status" : "Under Review"
	}
};
    var permits = db.collection('permitplus');
    permits.insertOne(permitApplication, function(err,result){
      if (err) return next(err);
      res.sendStatus(201);

      db.close();
    });
  });
});

app.use(function(req,res,next){
  res.sendStatus(404);
});

app.use(function(err,req,res,next){
  res.status(500);
  res.send(err);
});


app.listen(1337, function(){
  console.log('...listening on 1337');
});