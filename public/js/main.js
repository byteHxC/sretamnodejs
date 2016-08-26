$(function(){
	var audio = $('audio');
	function cargarCanciones(){
		$.ajax({
			url:'/canciones'
		}).done(function(canciones){
			var lista = $('.lista-canciones');
			lista.empty();
			canciones.forEach(function(cancion){
				var nuevoElemento = $('<li class="cancion" >'+cancion.nombre+'</li>');
			
				nuevoElemento
					.on('click',cancion,play)
					.appendTo(lista);

				console.log(cancion.nombre)
			});
		}).fail(function(){
			alert('No pude cargar las canciones :(')
		});

	}
	cargarCanciones();

	function play(evt){
		audio[0].pause();
		audio.attr('src','/canciones/'+evt.data.nombre);
		audio[0].play();
	}

});