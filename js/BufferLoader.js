function BufferLoader(context,urllist, callback){
    this.context = context;
    this.urllist = urllist;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index){
    // Load Buffer asynchrnously
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    
    var loader = this;
    
    request.onload = function(){
        // Decoding the audio file asynchrnously
        loader.context.decodeAudioData(request.response,
            function(buffer){
                if (!buffer){
                    alert("Error decoding file data" + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if(++loader.loadCount == loader.urllist.length)
                    loader.onload(loader.bufferList);
            },
            function(error){
                console.error('Decode audiodata error', error);
            }
        );
    }
    request.onerror = function(){
        alert('Buffer Loader: XHR Error');
    }
    request.send();
}


BufferLoader.prototype.load = function(){
    for (var i =0; i<this.urllist.length; ++i) {
        this.loadBuffer(this.urllist[i], i);
    }
}