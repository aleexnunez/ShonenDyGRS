const express = require('express');
const router = express.Router();

//
// ─── GET INDEX ──────────────────────────────────────────────────────────────────
// Se ponen dos parámetros, el primero la ruta de la aplicación, el segundo una función con dos parámetros internos. El primer parámetro "req" es la solicitud (lo que va a recibir la petición) y el segundo "res", que es lo que va a devolver

  
router.get('/',function(req,res){
  res.render('index');
});


//
// ─── MODULE EXPORTS ─────────────────────────────────────────────────────────────
// Es una función de ExpressJS que permite que el módulo se pueda utilizar en otros archivos. Para ello en el archivo correspondiente hay que añadir "var modulo = require("./modulo")"

  
module.exports = router;