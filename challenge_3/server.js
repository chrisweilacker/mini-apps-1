var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoDB = require('./db.js').client;
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt-node');
var assert = require('assert');


app.use(session({
  secret: 'multi-step-cart',
  resave: false,
  cookie: {
    maxAge: 36000000,
    httpOnly: false
    },
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-  Override, Content-Type, Accept');
  next();
});

mongoDB.connect((err, client) => {
  if (err) {
    console.log(`Failed to connect to the database. ${err} ${err.stack}`);
  }
  const db = client.db('cart');
  app.locals.db = db;
  app.listen(3000, () => {
    console.log(`Node.js app is listening at http://localhost:3000`);
  });
});


app.get('/step', function(req, res) {
  if (req.session.step) {
    console.log(req.session.step);
    res.send({step:req.session.step});
  } else {
    res.send({step: 0});
  }
});

app.get('/user', function (req, res) {
  if (req.session.user_Id) {
      var cursor = app.locals.db.collection('users');

      cursor.findOne({_id: ObjectID(req.session.user_Id)}, function(err, doc) {
        console.log('The doc', doc);
        res.send(doc);
      });
  } else {
    res.send({name: '', email: ''});
  }
});

app.post('/user', function (req, res) {
  if (req.body.password) {
      const db = app.locals.db;
      var cursor = db.collection('users');
      bcrypt.hash(req.body.password, 12, null, function(hashedPassword) {
        if (req.session.user_Id) {
          cursor.updateOne({_id: ObjectID(req.session.user_Id)},{
            $set: {
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword
            }
          }).then(function(result) {
            req.session.step = 2;
            res.send({step: req.session.step});
          });
        } else {
          cursor.insertOne({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
          }).then(function(result) {
            req.session.step = 2;
            console.log('result', result.insertedId.toHexString(), typeof result.insertedId.toHexString())
            req.session.user_Id = result.insertedId.toHexString();
            req.session.save();
            res.send({step: req.session.step});
          });
        }
      });
  } else if (req.session.user_Id) {
    const db = app.locals.db;
    var cursor = db.collection('users');
    cursor.updateOne({_id: ObjectID(req.session.user_Id)},{
      $set: {
        name: req.body.name,
        email: req.body.email
      }
    }).then(function(result) {
      req.session.step = 2;
      res.send({step: req.session.step});
    });
  }
});

app.get('/address', function (req, res) {
  if (req.session.address_Id) {
    const db = app.locals.db;
    var cursor = db.collection('address');
    cursor.findOne({_id: ObjectID(req.session.address_Id)}, function(err, doc) {
      res.send(doc);
    });
  } else {
    res.send({address_1: '', address_2: '', city: '', state: '', zip: '', phone_number: ''});
  }
});

app.post('/address', function (req, res) {
    const db = app.locals.db;
    var cursor = db.collection('address');
    if (req.session.address_Id) {
      cursor.updateOne({_id: ObjectID(req.session.address_Id)}, {
        $set: {
          address_1: req.body.address1,
          address_2: req.body.address2,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          phone_number: req.body.phone
        }
      }).then(function (result) {
        req.session.step = 3;
        req.session.save();
        res.send({step: req.session.step});
      });

    } else {
      cursor.insertOne({
        address_1: req.body.address_1,
        address_2: req.body.address_2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone_number: req.body.phone,
        user_Id: req.session.user_Id
      }).then(function(result) {
        console.log('inserting address info into server', req.body)
        req.session.step = 3;
        req.session.address_Id = result.insertedId.toHexString();
        req.session.save();
        res.send({step: req.session.step});
      });
    }


});

app.get('/card', function (req, res) {
  if (req.session.credit_Id) {
      const db = app.locals.db;
      var cursor = db.collection('creditcard');
      cursor.findOne({_id: ObjectID(req.session.credit_Id)}, function(err, doc) {
        res.send(doc);
      });
  } else {
    res.send({
      creditcard: '',
      expiry: '',
      cvv: '',
      billingzip: ''
    });
  }
});

app.post('/card', function (req, res) {
    const db = app.locals.db;
    var cursor = db.collection('creditcard');
    if (req.session.credit_Id) {
      cursor.updateOne({_id: ObjectID(req.session.credit_Id)}, {
        $set: {
          creditcard: req.body.creditcard,
          expiry: req.body.expiry,
          cvv: req.body.cvv,
          billingzip: req.body.billingzip
        }
      })
      req.session.step = 4;
      req.session.save();
      res.send({step: req.session.step});
    } else {
      cursor.insertOne({
        creditcard: req.body.creditcard,
        expiry: req.body.expiry,
        cvv: req.body.cvv,
        billingzip: req.body.billingzip,
        user_Id: ObjectID(req.session.user_Id)
      }).then(function(result) {
        console.log('inserting address info into server', req.body)
        req.session.step = 4;
        req.session.credit_Id = result.insertedId.toHexString();
        req.session.save();
        res.send({step: req.session.step});
      });
    }
});

app.get('/confirm', function (req, res) {
      var blankObj ={
        creditcard: '',
        expiry: '',
        cvv: '',
        billingzip: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
        phone_number: '',
        name: '',
        email: ''
      };
      const db = app.locals.db;
      console.log("Connected successfully to server");
      var returnObj ={};
      var cursor = db.collection('users');
      if (req.session.user_Id) {
        cursor.findOne({_id: ObjectID(req.session.user_Id)}, function(err, doc) {
          returnObj = Object.assign(returnObj, doc);
          console.log('first return obj', returnObj);
          var secondCursor = db.collection('address');
          if (req.session.address_Id) {
            secondCursor.findOne({_id: ObjectID(req.session.address_Id)}, function(err, doc) {
              returnObj = Object.assign(returnObj,doc);
              console.log('second return obj', returnObj);
              if (req.session.credit_Id) {
              var thirdCursor = db.collection('creditcard');
              thirdCursor.findOne({_id: ObjectID(req.session.credit_Id)}, function(err, doc) {
                returnObj = Object.assign(returnObj,doc);
                console.log('third return obj', returnObj);
                res.send(returnObj);
              });
            } else {
              returnObj = Object.assign({}, blankObj, returnObj);
              res.send(returnObj);
            }
            });
          } else {
            returnObj = Object.assign({}, blankObj, returnObj);
            res.send(returnObj);
          }

        });
      } else {
        res.send(blankObj);
      }



});

app.post('/purchased', function (req, res) {
    const db = app.locals.db;
    var cursor = db.collection('purchases');
    cursor.insertOne({
      user_Id: ObjectID(req.session.user_Id),
      credit_Id: ObjectID(req.session.credit_Id),
      shipping_address_Id: ObjectID(req.session.address_Id)
    }).then(function(result) {
      req.session.step = 5;
      req.session.purchase_Id = result.insertedId.toHexString;
      req.session.save();
      res.send({step: req.session.step});
    });
});

app.get('/restart', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});




