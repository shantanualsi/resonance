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