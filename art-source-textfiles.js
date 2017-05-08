(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['browser-request', './art-source'], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory(require('request'), require('./art-source'));
    }else{
        // Browser globals (root is window)
        root.AsciiArtSource = factory(root.request, );
    }
}(this, function(request, ArtSource){
    ArtSource.define({
        search : function(){},
        list : function(){
            
        },
        fetch : function(path, file, callback){
            //if(parts[1]){
            var pre = '';
            var post = '';
            switch(path){
                case 'NFOS':
                    post = 'asciiart/';
                case 'asciiart':
                    pre = 'artscene.';
                    break;
                case 'LOGOS':
                case 'DECUS':
                    post = 'art/';
                    break;
                case 'RAZOR':
                case 'FAIRLIGHT':
                case 'DREAMTEAM':
                case 'HUMBLE':
                case 'HYBRID':
                case 'PRESTIGE':
                case 'INC':
                case 'TDUJAM':
                case 'ANSI':
                    post = 'piracy/';
                    break;
                //}
                request(
                    'http://'+pre+'textfiles.com/'+post+path+'/'+file,
                    function(err, res, body){
                        var data = body ||
                            (
                                res && res.request &&
                                res.request.responseContent &&
                                res.request.responseContent.body
                            ) || undefined;
                        callback(undefined, data);
                    }
                );
            }
        },
    })
}));
