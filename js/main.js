var context;

function init(){
	try{
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	}catch(e){
		alert('Web Audio unsupported')
	}
}

function loadAudio(object, url){ // Pass the 'pad' object and URL to the loadaudio method
	var request = new XMLHttpRequest(); 
	request.open('GET', url, true);   // True because this is an async request

	request.responseType = 'arraybuffer'; // Setting the type to array buffer to handle the audio type


	// When the file loads, the anonymous function calls the decodeAudioData method of Audio Context.
	// Another function will just assign the data in request.response to the buffer attribute of the pad object. This will just make it easy to access the source node.
	request.onload = function () {
		context.decodeAudioData(request.response, function (buffer) {
			object.buffer = buffer;
		});
	}
	// Send the GET request. 	
	request.send();
}

// Let's play the audio file when a pad is clicked
function addAudioProperties (object) {
	object.name = object.id;	// pad1 or pad2 or pad3 or pad4. The id property of the object.
	object.source = $(object).data('sound'); 	// The data-sound property of the pad object
	loadAudio(object,object.source);
	// The createBufferSource will create a new node in the AudioContext.
	object.play = function () {		// Give the pad object a play method.
		var s = context.createBufferSource();	// Call the AudioContext's createBufferSource to make a new Audio buffer source node
		s.buffer = object.buffer;				// Set the node's source property
		s.connect(context.destination);			// Connect to the speakers. context.destination is a special node representing the computer's default sound o/p
		s.start(0);								// Play the sound
		object.s = s;							// Attach the audio source to the object's s property
	}
}

$(function(){
	init();
	$('#sp div').each(function () {
		addAudioProperties(this);
	});
	$('#sp div').on('click', function () {
		this.play();
	})
});






