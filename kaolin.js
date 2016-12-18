(function (root, factory) { // UMD - returnExports
    if (typeof define === 'function' && define.amd) {
        define(['./ascii-art'], factory);
    } else if (typeof module === 'object' && module.exports) {
        
        module.exports = factory(require('./ascii-art'));
        
    } else {
        root.chalk = factory(function(){
            return root.AsciiArtImage;
        }, root.fs);
    }
}(this, function(art) {
    
    var map = {
        reset :  'reset',
        bold : 'bold',
        dim : 'dim',
        italic : 'italic',
        underline : 'underline',
        inverse : 'inverse',
        hidden : 'hidden',
        strikethrough : 'strikethrough',
        black : 'black',
        red : 'red',
        green : 'green',
        yellow : 'yellow',
        blue : 'blue',
        magenta : 'magenta',
        cyan : 'cyan',
        white : 'white',
        gray : 'gray',
        grey : 'gray',
        bgBlack : 'black_bg',
        bgRed : 'red_bg',
        bgGreen : 'green_bg',
        bgYellow : 'yellow_bg',
        bgBlue : 'blue_bg',
        bgMagenta : 'magenta_bg',
        bgCyan : 'cyan_bg',
        bgWhite : 'white_bg'
    }
    
    var colorNames = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey'];
    
    var envClose = {
        bold : '22',
        dim : '22',
        italic : '23',
        underline : '24',
        blink : '25',
        framed : '54',
        encircled : '54',
        strikethrough : '29',
        overlined : '53',
        black : '39',
        red : '39',
        green : '39',
        yellow : '39',
        blue : '39',
        magenta : '39',
        cyan : '39',
        white : '39',
        gray : '39',
        grey : '39',
        bright_black : '39',
        bright_red : '39',
        bright_green : '39',
        bright_yellow : '39',
        bright_blue : '39',
        bright_magenta : '39',
        bright_cyan : '39',
        bright_white : '39',
        bright_gray : '39',
        bright_grey : '39',
        black_bg : '49',
        red_bg : '49',
        green_bg : '49',
        yellow_bg : '49',
        blue_bg : '49',
        magenta_bg : '49',
        cyan_bg : '49',
        white_bg : '49'
    }
    
    var stack = [];
    
    function makeClosers(parts){
        var closer = '';
        parts.reverse().forEach(function(part){
            if(envClose[part]) closer += '\u001b['+envClose[part]+'m';
        });
        return closer;
    }
    
    var defaultMarker = '\u001b[39m';
    
    function context(parent, key){
        var arr = parent?parent.slice(0):[];
        var ctx = function(arg){
            stack.push(key);
            var text = arguments.length === 1?arg+'':Array.prototype.slice.apply(arguments, [0]).join(' ');
            if(arr.length == 1 && arr.indexOf('reset') !== -1) return '\u001b[0m'+text+'\u001b[0m';
            if(!text) return text;
            // in a radical depature from convention, ascii-art only uses openers and resets
            // the result is more uniform output (especially on graphics)
            // we implement closers here for symmetry with chalk / colors.js
            var result = art.style(text, arr.join('+'))+makeClosers(arr);
            var parents = stack.slice(0);
            var index;
            while(result.indexOf(defaultMarker) !== -1 && parents.length && result.indexOf(defaultMarker) !== result.lastIndexOf(defaultMarker)){
                var env = map[parents.pop()];
                var marker = art.style('', env);
                var index = result.indexOf(defaultMarker);
                if(index !== -1){
                    result = result.slice(0, index)+marker+result.slice(index+defaultMarker.length);
                }
            }
            if(result.indexOf("\n") !== -1){
                result = result.replace("\n", defaultMarker+"\n"+'\u001b[90m')
            }
            stack.pop(key);
            return result;
        };
        Object.keys(map).forEach(function(key){
            Object.defineProperty(ctx, key, {
              get: function() {
                  var sub = arr.slice(0);
                  sub.push(map[key]);
                  return new context(sub, key);
              },
              enumerable: true,
              configurable: false
            });
        });
        return ctx;
    }
    
    return new context();
}));