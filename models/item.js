const mongoose = require('mongoose');

// ---------------- Definición del esquema ----------------------//

var itemSchema = mongoose.Schema({
  name: {type: String,required: true},
  type: {type: String,required: true},
  price: {type: Number,required: true},
  description: {type: String,required: true},
  location: {type: String,required: true},
  stock: {type: Number,required: true},
  imagePath: {type: String,required: true}

});

// ---------------- Exportamos el modelo creado ----------------------//

var Item= module.exports = mongoose.model('Item',itemSchema);

// ---------------- Métodos de la base de datos ----------------------//

module.exports.createItem = function(newItem,callback) {
  console.log("+ OBJETO AÑADIDO: "+newItem.name+" en "+newItem.location);
  newItem.save(callback);
}



