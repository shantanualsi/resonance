function Audio (context) {
	this.context = context;
	this.gainNode = null;
	this.playing = false;
}

Audio.prototype.setupProperties = function(bufferList, audioObj) {
	try{
		audioObj.source = context.createBufferSource();
		audioObj.source.buffer = bufferList[0];
		audioObj.source.loop = false;
		audioObj.gainNode = audioObj.context.createGain();
		audioObj.source.connect(audioObj.gainNode);
		audioObj.gainNode.connect(audioObj.context.destination);
	}catch(e){
		console.log(e);
		toast("Some error occured while starting audio");
	}
}

Audio.prototype.load = function(filename) {
	console.log(this);
	this.bufferLoader = new BufferLoader(this.context,filename, this, this.setupProperties);
	this.bufferLoader.load();
}

Audio.prototype.changeVolume = function(element) {
	var vol = parseInt(element.val()) / parseInt(element.prop('max'));
	this.gainNode.gain.value = vol*vol;
}

Audio.prototype.play = function(){
	this.source.start(0);
}

Audio.prototype.stop = function() {
	if(this.source){
		this.source.stop();
	}
}