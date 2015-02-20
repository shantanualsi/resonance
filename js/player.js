var context;
var bufferLoader;

function init(){
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext
		context = new AudioContext();
	} catch(e){
		toast("Web Audio unsupported in your browser", 4000)
	}
}


function loadAudio(object, songUrl){
	var request = new XMLHttpRequest();
	request.open('GET', songUrl, true);
	request.responseType = 'arraybuffer';

	request.onload = function(){
		context.decodeAudioData(request.response, function(buffer){
			object.buffer = buffer;
		});
	}

	request.send();
}

function reverbObject (url) {
	this.source = url;
	loadAudio(this,url);
}


function setupAnalyzer(){
	
	return analyser;
}

function addAudioProperties(object){
	console.log('Adding audio properties...');
	object.name = object.id;
	object.source = "";
	console.log("Done adding audio properties");
	// Adding for Frequency Spectrum
	javaScriptNode = context.createScriptProcessor(2048,1,1);
	// changes for the volume Rocker
	object.volume = context.createGain(); // Create a gain node
	object.loop = false;
	// This will call the javascript nodes when 2048 frames have been sampled. Approx 21 times/sec since our data is sampled at 44.1k
	// javascriptNode = context.createJavaScriptNode(2048,1,1);

	object.play = function(){
		console.log("Now playing...");
		var s = context.createBufferSource();
		s.connect(object.volume);
		s.buffer = object.buffer;
		s.loop = object.loop;
		object.volume.connect(javaScriptNode);
		javaScriptNode.connect(context.destination);
		s.start(0);
		object.s = s;
	}

	object.stop = function(){
		if(object.s)
			object.s.stop();
	}
}


// Add Enhancements to Audio
function addReverb(reverbCode) {
	
}

function changeVolume(vol){
	$('#play')[0].volume.gain.value = vol;
}

function addAudioSource(object){
	object.source = $(object).data('sound');
	if($(object).data('sound') == undefined){
		toast("No song selected", 4000);
	}
	loadAudio(object, object.source);
}

$(function(){
	//  Not sure which function this should go to -- --------

	// ---------------
	// Reverb Audio files 
	irHallReverb = new reverbObject('audiofiles/irHall.ogg');

	// On load functions
	init();
	$('#play').each(function(){
		addAudioProperties(this);
	});
	$('.loadButton').on('click', function(){
		$('#play').attr('data-sound','audiofiles/songs/Kalimba.mp3');

	});

	// On Click functions
	$('#play').on('click', function(){
		addAudioSource(this);
		this.play();
	});

	$('#stop').on('click',function(){
		toast('Audio Stopped', 4000);
		$('#play')[0].stop();
	});

	$('#loop').on('click', function(){
		if($(this).attr('looping') == "true"){
			toast('Repeat Off', 4000);
			$('#play')[0].loop = false;
			$(this).attr('looping', false);
		}else{
			toast('Repeat On', 4000);
			$('#play')[0].loop = true;
			$(this).attr('looping', true);
		}
	});

	// Audio controls: Reverb

	


	// Volume controls
	$('#primary-volume-rocker input').change(function(){
		changeVolume($(this).val());
	});

	$('.main-volume-control-label').on('click',function(){
		$(this).animate({
			right:'10px'
		})
		$('primary-volume-rocker').show();
	});

	$('#reverbButton').on('click',function(){
		toast('Reverb Clicked', 200)
	});

	// Modals
	$('.aboutme-modal-trigger').leanModal();

});

//Feel you can do better than A.R.Rahman and Hans Zimmer? Go awesome with Resonance!
// Add effects to your favourite song