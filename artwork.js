(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['async-arrays'], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory(require('async-arrays'));
    }else{
        // Browser globals (root is window)
        root.AsciiArtArtwork = factory(root.AsyncArrays);
    }
}(this, function(arrays){
    var sources = [];
    var request;
    var cache;
    return {
        addSource : function(source){
            sources.push(source);
            source.useRequest(request);
        },
        useRequest : function(instance){
            request = instance;
            sources.forEach(function(source){
                source.useRequest(instance);
            });
        },
        useCache : function(instance){
            cache = instance;
        },
        search : function(query, cb){
            var results = [];
            arrays.forEachEmission(sources, function(source, index, done){
                source.search(query, function(err, res){
                    if(err) return cb(err);
                    res.forEach(function(item){
                        results.push(item);
                    });
                    done();
                })
            }, function(){
                cb(null, results);
            });
        },
        get : function(src, path, file, cb){
            var source = src;
            if(typeof source === 'string'){
                source = sources.find(function(item){
                    return item.name === src;
                });
            }
            source.fetch(path, file, cb);
        }
    };
}));
