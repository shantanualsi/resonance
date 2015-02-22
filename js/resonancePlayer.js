window.onload = init;
var context,source;
var bufferLoader;
// audioFiles = [] // An array that will store all the Audio files to be played

function init () {
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();		
	}catch(e){
		toast('Web Audio Not upported')
	}
}


function loadAudio (songlist) {
	bufferLoader = new BufferLoader(context,songlist,doneLoading);
	bufferLoader.load();
}


function doneLoading (bufferList) {
	source = context.createBufferSource();
	source.buffer = bufferList[0];
	source.connect(context.destination);
	source.start(0);
}

function stopAudio(){
	if(source){
		source.stop();
	}	
}

$(function(){
	init();
	// Load the audio file as a data attribute on clicking the load button (+)
	$('.loadButton').on('click', function(){
		$('#play').attr('data-sound','audiofiles/songs/Kalimba.mp3');
	});

	// Play audio on clicking play button
	$('#play').on('click', function(){
		// addAudioSource(this);
		song = Array($('#play').data('sound'));
		loadAudio(song);
	});

	// Stop audio on clicking stop button
	$('#stop').on('click', function () {
		stopAudio();
	});

	// Add Reverb Effect

});