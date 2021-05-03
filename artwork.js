(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['async/eachOfLimit'], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory(require('async/eachOfLimit'));
    }else{
        // Browser globals (root is window)
        root.AsciiArtArtwork = factory(root.eachOfLimit);
    }
}(this, function(eachOfLimit){
    var sources = [];
    var request;
    var cache;
    return {
        addSource : function(source){
            sources.push(source);
        },
        useRequest : function(instance){
            request = instance;
        },
        useCache : function(instance){
            cache = instance;
        },
        search : function(query, cb){
            var results = [];
            eachOfLimit(sources, 3, function(source, index, done){
                source.search(query, function(err, res){
                    if(err) return cb(err);
                    res.forEach(function(item){
                        results.push(item);
                        done();
                    });
                })
            }, function(){
                cb(null, results);
            })
        },
        get : function(source, target, cb){

        }
    };
}));
