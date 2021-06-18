'use strict'
 
var validator = require('validator');
var fs = require('fs');
var path = require('path');
 
var Article = require('../models/article');
const article = require('../models/article');
const { exists } = require('../models/article');
 
var controller = {
 
    datosCurso: (req, res) => {
        var hola = req.body.hola;
 
        return res.status(200).send({
            curso: 'Master en Framework JS',
            autor: 'Victor Robles WEB',
            url: 'google.com',
            hola
        });
    },
 
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi conrtolador de articulos'
        });
    },
 
    save: (req, res) => {
                // Recoger parametros por post
 
                var params = req.body;
 
                // Validar datos (validator)
 
                try{
                    var validate_title = !validator.isEmpty(params.title);
                    var validate_content = !validator.isEmpty(params.content);
                }catch(err){
                    return res.status(200).send({
                        status: 'error',
                        message: 'faltan datos por enviar !!!'
                    });
                }
        
                if(validate_title && validate_content){
                   
                // Crear el objeto a guardar
 
                    var article = new Article();
                    
                // Asignar valores
 
                    article.title = params.title;
                    article.content = params.content;
                    article.imagen = null;
 
                // Guardar el articulo
 
                    article.save((err, articleStored) => {
 
                        if(err || !articleStored){
                            return res.status(404).send({
                                status: 'error',
                                message: 'El articulo no se ha guardado!!'
                            });
                        }
 
                        // Devolver una respuesta
 
                        return res.status(200).send({
                            status: 'success',
                            article: articleStored
                        });
 
                    });
 
                
                }else{
                    return res.status(200).send({
                        status: 'error',
                        message: 'los datos no son validos'
            });
        }
    },
 
    getArticles: (req, res) => {
 
        var query = Article.find({})
 
        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }
 
        // Find
        query.sort('-_id').exec((err, articles) =>{
 
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }
 
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                articles
            })
        });
    },
 
    getArticle: (req, res) => {
 
        // Recoger el id de la url
 
        var articleId = req.params.id;
 
        // Comprobar que es diferente a Null
 
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo !!!'
            });
        }
        
        // Buscar el articulo
 
        Article.findById(articleId, (err, article) => {
            
            if (err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error al devolver los datos !!!'
                });
            }
 
            if(!article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo !!!'
                });
            }
 
        // devolverlo en Json
            return res.status(404).send({
                status: 'succes',
                article
            });
 
        });
        
    },
 
    update: (req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;
 
        // Recoger los datos que llegan por put
        var params = req.body;
 
        // Validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status:'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
 
        if(validate_title && validate_content){
            // En el caso que esten validos. Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !'
                    });
                }
 
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'NO EXISTE EL ARTICULO'
                    });
                }
 
                return res.status(200).send({
                    status: 'succes',
                    article: articleUpdated
                });
            });
        }else{
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta!!'
            });
 
        }
 
    },
 
    delete: (req, res) => {
 
        // Recoger el id de la url
        var articleId = req.params.id;
 
        // Find and delete
        article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar!!'
                });
            }
 
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ah borrado el articulo, posiblemente no existe!!'
                })
            }
 
            return res.status(200).send({
                status: 'succes',
                article: articleRemoved
            });
        });        
    },
 
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js
 
        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...'
 
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        // Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
 
        // * ADVERTENCIA * SOLO EN LINUX O MAC
        // var file_split = file_path.split('/');
 
        // Nombre del arcivo
        var file_name = file_split[2];
 
        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
 
        // Comprobar la extension, solo imagenes, si no es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            });
        }else{
            // Si todo es valido, sacando id de la url
            var articleId = req.params.id;
 
             if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
 
                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }
 
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
                          
            }
        }
    }, 

    getImage: (req,res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;
        
        fs.exists(path_file, (exists) => {
            
            if (exists) {
                return res.sendFile(path.resolve(path_file))
                
            } else {
                return res.status(200).send({
                status: 'error',
                message: "la imagen no existe"
                });
            }
        });


    },

    search: (req,res ) => {
        var searchString = req.params.search;

        Article.find({ "$or": [
            {"title": { "$regex": searchString, "$options": "i"}},
            {"content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date','descending']])
        .exec((err,articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "error en la peticion"
                });
            }

            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "no hay articulos que coincidadn con la busqueda"
                });
            }


            
            return res.status(200).send({
                status: 'succes',
                articles
            });
 
        })
 
        // devolverlo en Json

        

        
    },
};  
 
module.exports = controller;