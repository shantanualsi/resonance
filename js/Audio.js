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
		audioObj.source.connect(audioObj.gainNode);
		audioObj.gainNode.connect(audioObj.context.destination);


		// For the analyzer:
		// Script Processor Node(bufferSize, inputChannels, outputChannels)
		audioObj.analyser = audioObj.context.createAnalyser();
		audioObj.analyser.smoothingTimeConstant = 0.5
		audioObj.analyser.fftSize = 1024;
		audioObj.javascriptNode.connect(context.destination);
		
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

function getAverageVolume (array) {
	var values = 0;
	var average;
	
	var length = array.length;

	// Getting all frequency amplitudes
	for (var i = 0; i < length; i++) {
		values += array[i];
	};

	return(values/length);
}

function drawAudioSpectrum (array,ctx) {
	for(var i=0;i<array.length;i++){
		var value = array[i];
		ctx.fillRect(i*10,300-value,5,900);
	}
};
