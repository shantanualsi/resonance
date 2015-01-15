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


function addAudioProperties(object){
	console.log('Adding audio properties...');
	object.name = object.id;
	object.source = "";
	console.log("Done adding audio properties");

	// changes for the volume Rocker
	object.volume = context.createGain(); // Create a gain node
	object.loop = false;
	object.play = function(){
		console.log("Now playing...");
		var s = context.createBufferSource();
		s.connect(object.volume);
		s.buffer = object.buffer;
		s.loop = object.loop;
		object.volume.connect(context.destination);		
		s.start(0);
		object.s = s;
	}

	object.stop = function(){
		if(object.s) 
			object.s.stop();
	}
}

function addAudioSource(object){
	object.source = $(object).data('sound');
	if($(object).data('sound') == undefined){
		toast("No song selected", 4000);
	}
	loadAudio(object, object.source);
}



$(function(){
	// On load functions
	init();
	$('#play').each(function(){
		addAudioProperties(this);
	});
	$('.loadButton').on('click', function(){
		$('#play').attr('data-sound','audiofiles/kick.wav');
		
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

	// Volume controls
	$('#primary-volume-rocker input').change(function(){
		$('#play')[0].volume.gain.value = $(this).val();
	});

	$('#reverbButton').on('click',function(){
		toast('Reverb Clicked', 200)
	});

	$('aboutme-modal-trigger').leanModal();

});

//Feel you can do better than A.R.Rahman and Hans Zimmer? Go awesome with Resonance! 
// Add effects to your favourite songs



