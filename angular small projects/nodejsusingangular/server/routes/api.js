const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient; //Don't install npm install mongodb --save  //npm install mongodb@2.2.33 --save
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/my_db', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};


// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get("/emp",(req,res)=>{
   connection((db) => {
        db.collection("product").find().toArray().then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
   });
    });


router.get("/users",function(req,res){
    connection((db) => {
        db.collection("product").find().toArray(function(err,array){
            res.send(array);
            res.send(err)
        })
    });
        
});

// Get users
// router.get('/users', (req, res) => {
//     connection((db) => {
//         db.collection("om")
//             .find()
//             .toArray()
//             .then((users) => {
//                 response.data = users;
//                 res.json(response);
//             })
//             .catch((err) => {
//                 sendError(err, res);
//             });
//     });
// });

module.exports = router;