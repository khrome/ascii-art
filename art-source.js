(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define([], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory();
    }else{
        // Browser globals (root is window)
        root.AsciiArtSource = factory();
    }
}(this, function(list){
    var art;
    var request = function(){
        throw new Error('request not set!');
    }
    return {
        define : function(definition){
            return {
                //todo: make non-collidable
                name: definition.name || ('object_'+Math.floor(Math.random()*10000)),
                search : definition.search || function(query, callback){

                },
                list : definition.list || function(path, callback){

                },
                fetch : definition.fetch || function(location, callback){

                },
                useRequest : definition.useRequest || function(instance){
                    request = instance;
                }
            }
        },
        link : function(artInstance){
            art = artInstance;
        },
        request : function(requestInstance){
            request = requestInstance;
        }
    };
}));
