var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoDB = require('./db.js').client;
var bcrypt = require('bcrypt-node');



app.use(session({
  secret: 'multi-step-cart',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(3000);
console.log('server started');


app.get('/step', function(req, res) {
  if (req.session.step) {
    res.send(req.session.step);
  } else {
    res.send({step: 0});
  }
});

app.get('/user', function (req, res) {
  if (req.session.user_Id) {
    mongoDB.connect(function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var cursor = db.collection('users');
      res.send(cursor.findOne({_id: req.session.user_Id}).toArray()[0]);
      mongoDB.close();
    });
  } else {
    res.send({name: '', email: ''});
  }
});

app.post('/user', function (req, res) {
  if (req.body.password) {
    mongoDB.connect(function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var cursor = db.collection('users');
      bcrypt.hash(body.req.password, 12, null, function(hashedPassword) {
        if (req.session.user_Id) {
          cursor.updateOne({_id: req.session.user_Id},{
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
          });
          req.session.step = 2;
          res.send(req.session.step);
        } else {
          cursor.insertOne({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
          }).then(function(result) {
            req.session.step = 2;
            req.session.user_Id = result.insertedId;
            res.send(req.session.step);
          });
        }
      });
      mongoDB.close();
    });
  }
});

app.get('/address', function (req, res) {
  if (req.session.address_Id) {
    mongoDB.connect(function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var cursor = db.collection('address');
      res.send(cursor.findOne({_id: req.session.address_Id}).toArray()[0]);
      mongoDB.close();
    });
  } else {
    res.send({address_1: '', address_2: '', city: '', state: '', zip: '', phone_number: ''});
  }
});

app.post('/address', function (req, res) {
  mongoDB.connect(function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var cursor = db.collection('address');
    if (req.session.address_Id) {
      cursor.updateOne({_id: req.session.address_Id}, {
        address_1: req.body.address1,
        address_2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone_number: req.body.phone
      })
      req.session.step = 3;
      res.send(req.session.step);
    } else {
      cursor.insertOne({
        address_1: req.body.address1,
        address_2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone_number: req.body.phone,
        user_Id: req.session.user_Id
      }).then(function(result) {
        req.session.step = 3;
        req.session.address_Id = result.insertedId;
        res.send(req.session.step);
      });
    }
      mongoDB.close();

  });
});

app.get('/card', function (req, res) {
  if (req.session.credit_Id) {
    mongoDB.connect(function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var cursor = db.collection('creditcard');
      res.send(cursor.findOne({_id: req.session.credit_Id}).toArray()[0]);
      mongoDB.close();
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
  mongoDB.connect(function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var cursor = db.collection('creditcard');
    if (req.session.credit_Id) {
      cursor.updateOne({_id: req.session.credit_Id}, {
        creditcard: req.body.creditcard,
        expiry: req.body.expiry,
        cvv: req.body.cvv,
        billingzip: req.body.zip
      })
      req.session.step = 4;
      res.send(req.session.step);
    } else {
      cursor.insertOne({
        creditcard: req.body.creditcard,
        expiry: req.body.expiry,
        cvv: req.body.cvv,
        billingzip: req.body.zip,
        user_Id: req.session.user_Id
      }).then(function(result) {
        req.session.step = 4;
        req.session.credit_Id = result.insertedId;
        res.send(req.session.step);
      });
    }
      mongoDB.close();
  });
});

app.get('/confirm', function (req, res) {
  if (req.session.credit_Id) {
    mongoDB.connect(function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var returnObj ={};
      var cursor = cursor = db.collection('users');
      returnObj=returnObj.assign(returnObj, cursor.findOne({_id: req.session.user_Id}).toArray()[0]);
      cursor = db.collection('creditcard')
      returnObj=returnObj.assign(returnObj, cursor.findOne({_id: req.session.credit_Id}).toArray()[0]);
      cursor = db.collection('address');
      returnObj=returnObj.assign(returnObj, cursor.findOne({_id: req.session.address_Id}).toArray()[0]);
      res.send(returnObj);
      mongoDB.close();
    });
  } else {
    res.send({
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
    });
  }
});

app.post('/purchased', function (req, res) {
  mongoDB.connect(function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var cursor = db.collection('purchases');
    cursor.insertOne({
      user_Id: req.session.user_Id,
      credit_Id: req.session.credit_Id,
      shipping_address_Id: req.session.address_Id
    }).then(function(result) {
      req.session.step = 5;
      req.session.purchase_Id = result.insertedId;
      res.send(req.session.step);
    });
    mongoDB.close();
  });
});

app.get('/restart', function (req, res) {
  req.session.detroy();
  req.redirect('/');
});




