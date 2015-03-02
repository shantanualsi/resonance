function Audio (context, ctx) {
	this.context = context;
	this.gainNode = null;
	this.playing = false;
	this.javascriptNode = context.createScriptProcessor(2048, 1, 1);
	this.ctx = ctx;

	this.gradient = ctx.createLinearGradient(0,0,0,300);
    this.gradient.addColorStop(1,'#000000');
    this.gradient.addColorStop(0.75,'#ff0000');
    this.gradient.addColorStop(0.25,'#ffff00');
    this.gradient.addColorStop(0,'#ffffff');
}

Audio.prototype.setupProperties = function(bufferList, audioObj) {
	try{
		audioObj.source = context.createBufferSource();
		audioObj.source.buffer = bufferList[0];
		audioObj.source.loop = false;
		audioObj.gainNode = audioObj.context.createGain();


		// For the analyzer:

		// Script Processor Node(bufferSize, inputChannels, outputChannels)
		audioObj.analyser = audioObj.context.createAnalyser();
		audioObj.analyser.smoothingTimeConstant = 0.5
		audioObj.analyser.fftSize = 1024;
		audioObj.javascriptNode.connect(context.destination);
		
		// For the filters
		audioObj.filter = context.createBiquadFilter();
		audioObj.filter.type = (typeof audioObj.filter.type === 'string') ? 'lowpass' : 0; // LOWPASS
		audioObj.filter.frequency.value = 0;

		audioObj.source.connect(audioObj.filter);
		audioObj.filter.connect(audioObj.gainNode);
		audioObj.gainNode.connect(audioObj.context.destination);

		audioObj.gainNode.connect(audioObj.analyser);
		audioObj.analyser.connect(audioObj.javascriptNode);

		
		audioObj.javascriptNode.onaudioprocess = function() {
			var array = new Uint8Array(audioObj.analyser.frequencyBinCount);
			audioObj.analyser.getByteFrequencyData(array);
			var average = getAverageVolume(array);

			audioObj.ctx.clearRect(0,0,1400,460);
			audioObj.ctx.fillStyle = audioObj.gradient;
			// audioObj.ctx.fillRect(0,130-average,25,130);
			drawAudioSpectrum(array, audioObj.ctx)
		}

		audioObj.source.start(0);
	}catch(e){
		console.log(e);
		toast("Some error occured while starting audio");
	}
};

Audio.prototype.load = function(filename) {
	this.bufferLoader = new BufferLoader(this.context,filename, this, this.setupProperties);
	this.bufferLoader.load();
};

Audio.prototype.changeVolume = function(element) {
	var vol = parseInt(element.val()) / parseInt(element.prop('max'));
	this.gainNode.gain.value = vol*vol;
};

Audio.prototype.play = function(filename){
	this.load(filename);
};

Audio.prototype.stop = function() {
	if(this.source){
		this.source.stop();
		this.ctx.clearRect(0,0,1400,460);
	}
};


Audio.prototype.changeFrequency = function(element) {
	// Clamp the frequency between the minimum value and half of the sampling rate.
	var minVal = 40;
	var maxVal = this.context.sampleRate / 2;
	// To calculate how many octaves fall within that range, we calculate log to the base 2
	var numOctaves = Math.log(maxVal/minVal)/Math.LN2;
	// Now computing a multiplier from 0 to 1 based on an exponential scale
	var multiplier = Math.pow(2, numOctaves* (element.val() - 1.0));
	this.filter.frequency.value = maxVal * multiplier;
};

function getAverageVolume (array) {
	var values = 0;
	var average;
	
	var length = array.length;

	// Getting all frequency amplitudes
	for (var i = 0; i < length; i++) {
		values += array[i];
	};

	return(values/length);
};

function drawAudioSpectrum (array,ctx) {
	for(var i=0;i<array.length;i++){
		var value = array[i];
		ctx.fillRect(i*10,300-value,5,900);
	}
};
