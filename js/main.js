var context;
var bufferLoader;

function init(){
	try{
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	}catch(e){
		alert('Web Audio unsupported');
	}
}

function loadAudioBL(){
    bufferLoader = new BufferLoader(
        context,
        [
                '/audiofiles/songs/Kalimba.mp3',
                '/audiofiles/songs/Maid.mp3'
        ], doneLoading);
        
        bufferLoader.load();
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

function reverbObject(url){
    this.source = url;
    loadAudio(this, url);
}

// Let's play the audio file when a pad is clicked
function addAudioProperties (object) {
	object.name = object.id;	// pad1 or pad2 or pad3 or pad4. The id property of the object.
	object.source = $(object).data('sound'); 	// The data-sound property of the pad object
	loadAudio(object,object.source);
	object.volume = context.createGain();       //Creates a Gain node for volume
	object.loop = false;
	object.reverb = false;
	object.filter = false;
	object.fqValue = 350;
	object.qValue = 500;
	
	
	// The createBufferSource will create a new node in the AudioContext.
	object.play = function () {		// Give the pad object a play method.
		var s = context.createBufferSource();	// Call the AudioContext's createBufferSource to make a new Audio buffer source node
		s.connect(object.volume);       // Connect the source to the gain node
		s.buffer = object.buffer;				// Set the node's source property
		// 		s.connect(context.destination);			// Connect to the speakers. context.destination is a special node representing the computer's default sound o/p
		if(this.filter === true){
		    this.biquad = context.createBiquadFilter();
		    this.biquad.type = this.biquad.LOWPASS;
		    this.biquad.frequency.value = this.fqValue;
		    this.biquad.Q.value = this.qValue;
		   	if(this.reverb === true){
		        this.convolver = context.createConvolver();
		        this.convolver.buffer = irHall.buffer;
		        this.volume.connect(this.convolver);
		        this.convolver.connect(context.destination);
	    	} else{
	    	    this.volume.disconnect(0);
	    	    this.volume.connect(this.biquad);
	    	    this.biquad.connect(context.destination);
	    	}
		}else{
		    if(this.biquad){
		        if(this.reverb === true){
		            this.biquad.disconnect(0);
		            this.convolver.disconnect(0);
		            this.convolver.connect(context.destination);
		        }else{
		            this.biquad.disconnect(0);
		            this.volume.disconnect(0);
		            this.volume.connect(context.destination);
		        }
		    }
		}
		
		object.volume.connect(context.destination);     //The gain node connects to the destination now
		s.loop = object.loop;
		s.start(0);								// Play the sound
		object.s = s;							// Attach the audio source to the object's s property
	}
	object.stop = function(){
	    if(object.s) object.s.stop();
	}
}

$(function(){
	init();
	$('#sp div').each(function () {
		addAudioProperties(this);
	});
	
	$('#sp div').on('click', function () {
		this.play();
	});
	
	$('#cp input').change(function(){
	   var v = $(this).parent().data('pad'),
	       pad = $('#'+v)[0];
	 
	   switch ($(this).data('control')) {
	       case 'gain':
	           pad.volume.gain.value = $(this).val();
	           break;
	       case 'fq':
	           pad.fqValue = $(this).val();
	           break;
	       case 'q':
	           pad.qValue = $(this).val();
	           break; 
	       default:
	           // code
	   }
	});
	
// 	The buttons controls
    $('#cp button').on('click',function(){
       var v = $(this).parent().data('pad'),
            toggle = $(this).text(),
            pad = $('#'+v)[0];
        switch ($(this)[0].className){
            case 'loop-button':
                console.log('loop button clicked');
                pad.stop();
                console.log('pad stoopped');
                $(this).text($(this).data('toggleText')).data('toggleText', toggle);
                ($(this).val() === 'false') ? $(this).val('true'):$(this).val('false');
                pad.loop = ($(this).val() === 'false')? false:true;
                break;
            case 'reverb-button':
                pad.stop();
                $(this).text($(this).data('toggleText')).data('toggleText', toggle);
                ($(this).val() === 'false') ? $(this).val('true'):$(this).val('false');
                pad.reverb = ($(this).val() == 'false')?false:true;
                break;
            case 'filter-button':
                pad.stop();
                $(this).text($(this).data('toggleText')).data('toggleText', toggle);
                ($(this).val() === 'false') ? $(this).val('true'):$(this).val('false');
                pad.filter = ($(this).val() == 'false') ? false:true;
                $(this).parent().children('.filter-group').toggleClass('faded');
                break;
            default:
                break;   
        }   
       
    });
    irHall = new reverbObject('audiofiles/irHall.ogg')
});



// Audio controls - 
// Later add the functionality that Play button changes to pause button when audio is playing






