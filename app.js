var express = require('express');
var app = express();
var bp = require('body-parser');
var Mongo = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/permitplus'
var path = require("path");
ObjectId = require("mongodb").ObjectID;

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
    permits.find({}).toArray(function(err,permit){
      if (err) return next(err);

      console.log(permit);
      console.log("in get route");
      res.json(permit);

      db.close();
    });
  });
});

app.get('/single/:id', function(req,res,next){
  console.log("in single get request");
  Mongo.connect(dbURL, function(err,db){
    if (err) return next(err);
    var objectId = ObjectId(req.params.id);
     var permits = db.collection('permitplus');
    permits.find({_id : objectId}).toArray(function(err,names){
      if (err) return next(err);

      console.log(names);
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
			"Job_Address" : req.body.jobaddress,
			"City" : req.body.city,
			"State" : req.body.state,
			"Zipcode" : req.body.zipcode,
			"Property_Value" : req.body.value,
			"Job_Description" : req.body.description
	},
	"Applicant" : {
			"Applicant_Name" : req.body.applicant,
			"Applicant_Phone_Number" : req.body.appphone,
			"Applicant_Email" : req.body.appemail
	},
	"Contact" : {
			"Contact_Name" : req.body.contact,
			"Contact_Phone_Number" : req.body.contactphone,
			"Contact_Email" : req.body.contactemail			
	} ,
	"Architect" : {
			"Architect_Name" : req.body.architect,
			"Architect_Phone_Number" : req.body.architectphone,
			"Architect_Email" : req.body.architectemail
	} ,
	"Property_Owner" : {
		"Owner_Name" : req.body.ownername,
		"Owner_Address" : req.body.owneraddress,
		"Owner_City" : req.body.ownercity,
		"Owner_State" : req.body.ownerstate,
		"Owner_Phone_Number" : req.body.ownerphone
	} ,
	"Contractor" : {
		"Contractor_Name" : req.body.contractorname,
		"Contractor_Address" : req.body.contractoraddress,
		"Contractor_City" : req.body.contractorcity,
		"Contractor_State" : req.body.contractorstate,
		"Contractor_Phone_Number" : req.body.contractorphone		
	} ,
	"Submission" : {
		"Signed_Full_Name" : req.body.fullname,
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