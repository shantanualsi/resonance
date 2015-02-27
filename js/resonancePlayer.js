window.onload = init;
var context,source;
var bufferLoader;
// audioFiles = [] // An array that will store all the Audio files to be played

function init () {
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();		
		audio = new Audio(context);
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
		var gainNode;
		source = context.createBufferSource();
		source.buffer = bufferList[0];
		if(!context.createGain){
			gainNode = context.createGain();
		}
		source.loop = false;
		source.connect(gainNode);
		gainNode.connect(context.destination);
		source.start(0);
	}catch(e){
		console.log(e)
		toast("Some error occured while starting audio");
	}
}

function stopAudio(){
	if(source){
		source.stop();
	}	
}

function changeVolume (element) {
	var fraction = parseInt(element.val()) / parseInt(element.max);
	source.volume.gain.value = vol;
}

$(function(){
	init();
	// Load the audio file as a data attribute on clicking the load button (+)
	$('.loadButton').on('click', function(){
		$('#play').attr('data-sound','audiofiles/songs/Kalimba.mp3');
		audio.load(Array($('#play').data('sound')));
	});

	// Play audio on clicking play button
	$('#play').on('click', function(){
		// addAudioSource(this);
			audio.play();
		
		// song = $('#play').data('sound');
		// if(song === undefined){
		// 	toast("Audio not loaded");
		// 	console.log('Audio not loaded')
		// } else{	
		// }
	});

	// Stop audio on clicking stop button
	$('#stop').on('click', function () {
		audio.stop();
	});

	// Volume controls
	$('#primary-volume-rocker input').change(function(){
		audio.changeVolume($(this));
	});



});