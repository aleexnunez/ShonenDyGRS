const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// ---------------- Definición del esquema ----------------------//

var UserSchema= new Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  carts: [{
    type: Schema.Types.ObjectId,
    ref: 'cart'
  }]
});


// ---------------- Exportamos el modelo creado ----------------------//

const User = module.exports = mongoose.model('User',UserSchema);


// ---------------- Métodos de la base de datos ----------------------//

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
}

module.exports.getUserByUsername= function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
}

module.exports.getUserById= function(id, callback){
  User.findById(id, callback);
}

module.exports.comparePassword= function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}
