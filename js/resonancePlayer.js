window.onload = init;
var context,source;
var bufferLoader;

function init () {
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
		var c = $('#spectrum-canvas')[0];
		var ctx = c.getContext('2d');		
		
		audio = new Audio(context,ctx);
		fitToContainer(c);
	}catch(e){
		console.error(e);
		toast('Web Audio Not supported')
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

// Hack to fit the canvas to screen. TODO: Find any other efficient CSS to do this.
function fitToContainer(canvas){
  	canvas.style.width='100%';
	canvas.style.height='100%';
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

$(function(){
	// Load the audio file as a data attribute on clicking the load button (+)
	$('.loadButton').on('click', function(){
		$('#play').attr('data-sound','audiofiles/songs/Kalimba.mp3');
	});

	// Play audio on clicking play button
	$('#play').on('click', function(){
		audio.play(Array($('#play').data('sound')));
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