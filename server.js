// Package Variables
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//
// ─── MONGODB ────────────────────────────────────────────────────────────────────
// Conexión a la base de datos

  
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authDyGRS');
const db = mongoose.connection;

// Routes
const routes = require('./routes/index');
const users = require('./routes/users');
const items = require('./routes/items');

// Init app
const app = express();

// View engine (pug) + static folder
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(express.static("public"));

//
// ─── BODYPARSER ─────────────────────────────────────────────────────────────────
// Lo que hace es convertir los datos que obtengo desde las peticiones HTTP en objetos JSON

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

      while(namespace.length){
        formParam += '[' + namespace.shift() +']';
      }
      return {
        param : formParam,
        msg : msg,
        value : value
      };
    }
}));

// Connect flash
app.use(flash());

// Global Vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});

app.use('/',routes);
app.use('/users',users);
app.use('/items',items);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'),function(){
  console.log('Servidor iniciado en el puerto '+ app.get('port'));
});


  
