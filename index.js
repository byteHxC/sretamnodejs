var express = require('express');
var fs = require('fs');
var app = express(); 
var path = require('path');
var mediaserver = require('mediaserver');
var multer = require('multer');

var opcionesMulter = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,path.join(__dirname,"canciones"));

	},
	filename: function(req,file,cb){
		cb(null,file.originalname)
	}
});

var upload = multer({storage: opcionesMulter});

app.use(express.static('public'));
app.use('/jquery',express.static(path.join(__dirname,'node_modules','jquery','dist')));


app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/canciones',function(req,res){
	fs.readFile(path.join(__dirname,'canciones.json'),'utf-8',function(err,canciones){
		if(err)throw err; // manda el error a la consola
		res.json(JSON.parse(canciones))
	});
});

app.get('/canciones/:nombre',function(req,res){
	var cancion = path.join(__dirname,'canciones',req.params.nombre);
	console.log(req.params.nombre);
	mediaserver.pipe(req,res,cancion);
});

app.post('/canciones',upload.single('cancion'),function(req,res){
	var archivo_canciones = path.join(__dirname,'canciones.json');
	var nombre = req.file.originalname;
	fs.readFile(archivo_canciones,'utf-8',function(err,archivo){
		if(err) throw err;
		var canciones = JSON.parse(archivo);
		canciones.push({nombre: nombre});
		fs.writeFile(archivo_canciones,JSON.stringify(canciones),function(err){
			if(err) throw err;
		});
		res.sendFile(path.join(__dirname,'index.html'));

	});
});

app.listen(3000,function(){
	console.log('App running');
});