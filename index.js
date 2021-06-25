'use strict'

var mongoose = require('mongoose');
var app = require('./app');
const  port =  server.listen(process.env.PORT || 3900);

mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("la conexion se ha realizado correctamente");

    //crear server
    app.listen(port, () => {
        console.log("servidor corriendo en http://localhost:"+port)
    });
});