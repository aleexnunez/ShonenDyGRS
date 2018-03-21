const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Register
router.get('/register',function(req,res){
  res.render('register');
});

// Settings
router.get('/settings',function(req,res){
  res.render('settings');
});

// Login
router.get('/login',function(req,res){
  res.render('login');
});

// Orders
router.get('/orders',function (req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
      if (err) {
          return res.write('Error!');
      }
      var cart;
      orders.forEach(function(order) {
          cart = new Cart(order.cart);
          order.items = cart.generateArray();
      });
      res.render('orders', { orders: orders });
  });
});

// Register User
router.post('/register',function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //Validation
  req.checkBody('name','Introduce un nombre').notEmpty();
  req.checkBody('email','Introduce un email').notEmpty();
  req.checkBody('email','El email introducido no es válido').isEmail();
  req.checkBody('username','Introduce un usuario').notEmpty();
  req.checkBody('password','Introduce una contraseña').notEmpty();
  req.checkBody('password2','Las contraseñas son distintas').equals(req.body.password);

  const errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors: errors
    });
  } else {
      const newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
      });

      User.createUser(newUser, function(err,user){
        if(err) throw err;
        console.log(user);
      });

      req.flash('success_msg', 'Registro completado, puedes iniciar sesión');
      res.redirect('/users/login');
    }
});

// Authentication (PASSPORT)
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err,user){
      if(err) throw err;
      if(!user){
        return done(null,false,{message: 'Unknown user'});
      }

      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        } else {
          return done(null,false, {message: 'Invalid password'});
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });


// Settings User
router.post('/settings',function(req,res){

    const oldpassword = req.body.oldpassword;
    const pass = req.body.password;
    const pass2 = req.body.password2;
  
    //Validation
    req.checkBody('oldpassword','Introduce tu contraseña actual').notEmpty();
    req.checkBody('password','Introduce una contraseña').notEmpty();
    req.checkBody('password2','Las contraseñas son distintas').equals(req.body.password);
  
    const errors = req.validationErrors();
  
    if(errors){
      res.render('settings',{
        errors: errors
      });
    } else {
      User.getUserById(req.user._id, function(err,user){
        if(err) throw err;
          
          console.log("VERIFICANDO PASS: Usuario "+req.user._id+" con pass: "+user.password);
          
          User.comparePassword(oldpassword,user.password,function(err,isMatch){
            if(err) throw err;
            if(isMatch){
              console.log("Contraseña introducida: OK");

              bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(pass, salt, function(err, hash) {
                  User.findByIdAndUpdate(user._id, {password: hash }, function(req,res) {
                    if(err) throw err;
                    console.log("Contraseña actualizada correctamente");
                  })
                });
              });
              res.redirect("/items/home");
            } else {
              console.log("Contraseña introducida: Incorrecta");
              res.render('settings')
            }
          });
      });
    }
  });
  
router.post('/login',
  passport.authenticate('local', {successRedirect: '/items/home',failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/items/home');
  });

router.get('/logout', function(req,res){
    req.logout();
    req.session.cart=null;
    req.flash('success_msg','Has cerrado sesión correctamente');
    res.redirect('/users/login');
  })

module.exports = router;
