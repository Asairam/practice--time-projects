//import express module
var express = require("express");
//import mysql module
var mysql = require("mysql");
//create server
var app = express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//cross origin issue resolve.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//create the public folder to access resources
app.use(express.static(__dirname+"/../Node_ServiceExample"));
//create connection object.
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test"
});
//connect to database.
connection.connect();
//Rest API.
app.get("/mysql",function(req,res){
    connection.query("select * from emp",function(err,records,fields){
        res.end(JSON.stringify(records));
    });
});

//import mongodb
var mongodb = require("mongodb");
//create the MongoClient
var nareshIT = mongodb.MongoClient;
//create the Rest API.
app.get("/mongodb",function(req,res){
    nareshIT.connect("mongodb://localhost:27017/my_db",function(err,db){
        db.collection("om").find().toArray(function(err,array){
            res.send(array);
        });
    });
});

app.post("/appPost",function(req,res){
	 var postData  = req.body;	
	connection.query('INSERT INTO emp SET ?',postData,function(error, results, fields){
		if (error) {
			res.json({
				status:false,
				message:'there are some error with query'
			})
		  }else{
			  
			  res.json({
				status:true,
				data:results,
				message:'Insert sucessfully'
			})
		  }
	})
});



//Assign the Port No.
app.listen(8080);
console.log("Server Listening the Port No.8080")

