'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3900;

mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://Agustin:aabbc@cluster0.prfge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("la conexion se ha realizado correctamente");

    //crear server
    app.listen(port, () => {
        console.log("servidor corriendo en http://localhost:"+port)
    });
});
