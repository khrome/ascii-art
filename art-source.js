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
}(this, function(){
    var art;
    return {
        define : function(definition){
            return {
                search : function(query, callback){

                },
                list : function(path, callback){

                },
                fetch : function(location, callback){

                }
            }
        },
        link : function(artInstance){
            art = artInstance;
        }
    }};
}));
