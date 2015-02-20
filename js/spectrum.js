var ctx = $('#canvas').get()[0].getContext('2d');

function setupCanvas(ctx) {
	
	gradient = ctx.createLinearGradient(0,0,0,300);
	gradient.addColorStop(1,'#000000');
	gradient.addColorStop(0.75, '#ff0000');
	gradient.addColorStop(0.25, '#ffff00');
	gradient.addColorStop(0,'#ffffff');
}

function setupAnalyzer (smoothingTimeConstraint, fftSize) {
	analyser = context.createAnalyzer();
	analyser.smoothingTimeConstraint = smoothingTimeConstraint;
	analyser.fftSize = fftSize;
	return analyzer;
}

javaScriptNode.onAudioProcess = function () {
	var array = Uint8Array(analyser.frequencyBinCount)
	analyser.getFrequencyData(array);
	ctx.clearRect(0,0,1000,325);
	ctx.fillStyle = gradient;
	sketchFrequencySpectrum(array);

}

// Draw the frequency spectrum to the canvas
function sketchFrequencySpectrum(array) {
	for(var i=0;i<array.length;i++){
		ctx.fillRect(i*5, 325-array[i], 3, 325);
	}
}