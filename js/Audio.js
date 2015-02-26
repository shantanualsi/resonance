function Audio (filename, context, ) {
	this.context = context;

}

Audio.prototype.setupProperties = function(filename) {
	try{
		source = context.createBufferSource();
		source.buffer = filename;
		source.loop = false;
	}catch(e){
		toast("Some error occured while starting audio");
	}
};

Audio.prototype.load = function(filename) {
	bufferLoader = new BufferLoader(this.context,filename, setupProperties)
};

Audio.prototype.changeVolume = function(element) {
	var fraction = parseInt(element.val()) / parseInt(element.max);
	this.source.volume.gain.value = vol;
};

Audio.prototype.play = function(filename){
	source.start(0);
}

Audio.prototype.stop = function() {
	if(this.source){
		source.stop();
	}
}