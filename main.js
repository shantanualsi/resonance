// A simple Audiocontext

var context;

window.addEventListner('load', init, false);

function init(){
	try{
		// Fix up for prefixing
		window.Audiocontext = window.Audiocontext || window.webkitAudioContext;
		context = new Audiocontext();
	}catch(e){
		alert('Web Audio unsupported')
	}
}

function loadAudio(object, url){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.responseType = 'arraybuffer';

	request.onload = function () {
		context.decodeAudioData(request.response, function (buffer) {
			object.buffer = buffer;
		});
	}
}