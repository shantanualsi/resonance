function Audio (context) {
	this.context = context;
}

Audio.prototype.setupProperties = function(bufferList, audioObj) {
	console.log(bufferList);
	console.trace();
	try{
		audioObj.source = context.createBufferSource();
		audioObj.source.buffer = bufferList[0];
		audioObj.source.loop = false;
		audioObj.source.connect(context.destination);
	}catch(e){
		toast("Some error occured while starting audio");
	}
}

Audio.prototype.load = function(filename) {
	console.log(this);
	this.bufferLoader = new BufferLoader(this.context,filename, this, this.setupProperties);
	this.bufferLoader.load();
}

Audio.prototype.changeVolume = function(element) {
	var fraction = parseInt(element.val()) / parseInt(element.max);
	this.source.volume.gain.value = vol;
}

Audio.prototype.play = function(){
	this.source.start(0);
}

Audio.prototype.stop = function() {
	if(this.source){
		this.source.stop();
	}
}