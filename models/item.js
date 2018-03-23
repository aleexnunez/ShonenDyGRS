const mongoose = require('mongoose');

// ---------------- Definición del esquema ----------------------//

const itemSchema = mongoose.Schema({
  name: {type: String,required: true},
  type: {type: String,required: true},
  price: {type: Number,required: true},
  description: {type: String,required: true},
  location: {type: String,required: true},
  stock: {type: Number,required: true},
  imagePath: {type: String,required: true}
});

// ---------------- Exportamos el modelo creado ----------------------//

const Item= module.exports = mongoose.model('Item',itemSchema);

// ---------------- Métodos de la base de datos ----------------------//

module.exports.createItem = function(newItem,callback) {
  console.log("+ OBJETO AÑADIDO: "+newItem.name+" en "+newItem.location);
  newItem.save(callback);
}

module.exports.updateItem = function(id,numItem,callback){
  Item.findById(id, function(err,findedItem){
    console.log("* ACTUALIZANDO OBJETO: "+findedItem.name);
    if(findedItem.stock > numItem){
      findedItem.stock -= numItem;
      findedItem.save(callback);
    } else if(findedItem.stock == numItem){
      Item.findByIdAndRemove(id,function(err) {
        if (err)
            res.send(err);
        else
          console.log("* ELIMINANDO OBJETO: "+findedItem.name);
      });
    }
  })
}

module.exports.updateAll = function(array,callback){
  var comp=false;
  var i;

  for(i in array){
    Item.findOne({ _id: array[i].item._id },function(err,found){
      if(found){
        
        if(found.stock > array[i].qty){
          found.stock -= array[i].qty;
          found.save(callback);
        } 
        
        else if(found.stock == array[i].qty){
          Item.findByIdAndRemove(found._id,function(err) {
            if (err)
              res.send(err);
          });
        } 
        
        else{
          comp=true;
        }
      }
    })
  }
  return comp;
}



