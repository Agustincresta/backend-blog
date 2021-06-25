'use strict'

//cargar modulos
var express = require('express'),
cors = require('cors'),
app = express();

app.use(cors());

app.get(function(req,res){ 
  res.send('hello');
});



//cargar ficheros de ruta
var article_routes = require ('./routes/article')


//middlewares
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());


//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});




//añadir prefijos a rutas/ cargar rutas
app.use('/api', article_routes)

//ruta 



//exportar modulo
module.exports = app;

