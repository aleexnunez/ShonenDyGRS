//---------------- Importamos los paquetes necesarios -----------------//

// Express y Router para poder hacer las redirecciones
const express = require('express');
const router = express.Router();

// El modelo/schema Item para poder definir las funciones
const Item = require('../models/item');
const Cart = require('../models/cart');
const Order = require('../models/order');



//---------------- Rutas que vamos a manejar  -----------------//

// GET Home (donde mostramos los productos)
router.get('/home',function(req,res){
  Item.find({}, function(err, docs) {
    if (!err){ 
        var cart = new Cart(req.session.cart);
        res.render('home',{items: docs});
    } else {throw err;}
  });
});

// GET AddItem (donde añadimos los productos)
router.get('/addItem',function(req,res){
  res.render('addItem');
});

// GET Cart (donde vemos los productos añadidos)
router.get('/cart',function(req,res){
  if (!req.session.cart) {
    return res.render('cart', {myitems: null});
  } 
 var cart = new Cart(req.session.cart);
 res.render('cart', {myitems: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout',function(req,res){
  if (!req.session.cart) {
    return res.redirect('cart');
  } 
  var cart = new Cart(req.session.cart);
  var order = new Order({
    user: req.user,
    cart: cart
  });

  order.save(function(err,result)
  {
      var products = cart.generateArray();

      for(var i=0; i<products.length; i++)
      {
        Item.updateItem(products[i].item._id,products[i].qty);
      }
      req.session.cart=null;
      res.redirect('home');
  })
});

// GET Añadir al carro (cuando pulsamos "añadir")
router.get('/reduce/:id', function(req, res, next) {
  var itemId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(itemId);
  req.session.cart = cart;
  res.redirect('/items/cart');

});

// GET Añadir al carro (cuando pulsamos "añadir")
router.get('/add-to-cart/:id', function(req, res, next) {
  var itemId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Item.findById(itemId, function(err, item) {
     if (err) {
         return res.redirect('/items/home');
     }
      cart.add(item, item.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/items/home');
  });
});

// POST AddItem (cuando le damos a añadir el producto)
router.post('/addItem',function(req,res){

  // Recojo los datos introducidos en el formulario
  const name = req.body.name;
  const type = req.body.type;
  const price = req.body.price;
  const description = req.body.description;
  const location = req.body.location;
  const stock = req.body.stock;
  const imagePath = req.body.imagePath;


  // Compruebo que el formulario esta lleno
  req.checkBody('name','Rellena el nombre').notEmpty();
  req.checkBody('type','Rellena el tipo').notEmpty();
  req.checkBody('price','Rellena el precio').notEmpty();
  req.checkBody('description','Rellena la descripción').notEmpty();
  req.checkBody('location','Rellena la localización').notEmpty();
  req.checkBody('stock','Rellena el stock').notEmpty();
  req.checkBody('imagePath','Rellena la URL').notEmpty();

  const errors = req.validationErrors();

  if(errors){
    res.render('addItem',{
      errors: errors
    });
  } else {
      const newItem = new Item({
        name: name,
        type: type,
        price: price,
        description: description,
        location: location,
        stock: stock,
        imagePath: imagePath
      });

      Item.createItem(newItem, function(err,user){
        if(err) throw err;
      });

      req.flash('success_msg', 'Producto añadido, nisuu!');
      res.redirect('/items/home');
    }
});

module.exports = router;
