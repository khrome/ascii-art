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
    var request;
    return {
        define : function(definition){
            return {
                search : definition.search || function(query, callback){

                },
                list : definition.list || function(path, callback){

                },
                fetch : definition.fetch || function(location, callback){

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
