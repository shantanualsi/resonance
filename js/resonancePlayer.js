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
	try{
		source = context.createBufferSource();
		source.buffer = bufferList[0];
		source.connect(context.destination);
		source.start(0);
	}catch(e){
		toast("Some error occured while starting audio");
	}
}

function stopAudio(){
	if(source){
		source.stop();
	}	
}

function changeVolume (element) {
	console.log("Value :"+element.val());
	console.log("Max : " + element.prop('max'))
	var fraction = parseInt(element.val()) / parseInt(element.max);
	source.volume.gain.value = vol;
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
		song = $('#play').data('sound');
		
		if(song === undefined){
			toast("Audio not loaded");
			console.log('Audio not loaded')
		} else{	
			loadAudio(Array(song));
		}
	});

	// Stop audio on clicking stop button
	$('#stop').on('click', function () {
		stopAudio();
	});

	// Volume controls
	$('#primary-volume-rocker input').change(function(){
		changeVolume($(this));
	});


	
});