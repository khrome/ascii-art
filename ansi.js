(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define([], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory();
    }else{
        // Browser globals (root is window)
        root.AsciiArtAnsi = factory();
    }
}(this, function(){
    var AsciiArt = {};
    var parentArt;

    AsciiArt.Ansi = {
        length:function(value){
            var count = 0;
            AsciiArt.Ansi.map(value, function(row, column, chr, pos, done){
                count++;
            });
            return count;
        },
        trimTo :function(value, length){
            var lcv = 0;
            var result = '';
            var inEscape = false;
            var fuse = length;
            while(lcv < value.length){
                if(inEscape){
                    //todo: strict (enforce numeric)
                    result += value[lcv];
                    if(value[lcv] == 'm'){
                        inEscape = false;
                    }
                }else{
                    if(value[lcv] == '\033' && value[lcv+1] == '['){
                        inEscape = true;
                        result += '\033[';
                        lcv++;
                    }else{
                        if(fuse > 0){
                            result += value[lcv];
                            fuse--;
                        }
                    }
                }
                lcv++;
            }
            return result;
        },
        charAt :function(str, index, includePrefix){
            var result;
            var previousCharPos;
            AsciiArt.Ansi.map(str, function(row, column, chr, pos, done){
                if(index == column){
                    if(includePrefix && previousCharPos !== undefined){
                        var prefix = background.substring(previousCharPos, pos-1);
                        result = prefix+chr;
                    }else result = chr;
                    return done();
                }
                previousCharPos = pos;
            });
            return result;
        },
        intersect :function(background, overlay, options){
            var x = options.x || 0;
            var y = options.y || 0;
            var lines = overlay.split("\n");
            var bgLines = background.split("\n");
            //var lineWidth =AsciiArt.ansi.length()
            //console.log('$$$', bgLines[0].length, lines[0].length, y)
            if(y < 0) y = (bgLines.length - lines.length) + y+1;
            if(x < 0) x = (AsciiArt.Ansi.length(bgLines[0]) - AsciiArt.Ansi.length(lines[0])) + x+1;
            var str = AsciiArt.Ansi.map(background, function(row, column, chr, pos, done){
                //if(options.y < 0) y = (bgLines[0].length - lines[row-y].length) + options.y;
                //short circuit
                if(row > y + lines.length-1) return done();
                if(
                    //y in-range
                    row >= y &&
                    //x in-range
                    column >= x &&
                    column <= x + lines[row-y].length
                ){
                    if(lines[row-y][column-x-1] === undefined) return;
                    if(options.transparent && lines[row-y][column-x-1] === ' ') return;
                    if(options.style) return AsciiArt.style(
                        AsciiArt.Ansi.charAt(lines[row-y], column-x)
                    , options.style);
                    else return AsciiArt.Ansi.charAt(lines[row-y], column-x)
                }
            });
            if(options.chroma){
                str = str.replace(new RegExp(options.chroma, 'g'), ' ');
            }
            return str;
        },
        map :function(value, handler){
            var lcv = 0;
            var result = '';
            var inEscape = false;
            var lines = value.split("\n");
            var shortcircuit = false;
            for(var lineNumber=0; lineNumber < lines.length; lineNumber++){
                if(shortcircuit) continue;
                var line = lines[lineNumber];
                var pos = 0;
                for(var lcv=0; lcv < line.length; lcv++){
                    if(shortcircuit) continue;
                    if(inEscape){
                        if(line[lcv] == 'm'){
                            inEscape = false;
                        }
                    }else{
                        if(line[lcv] == '\033' && line[lcv+1] == '['){
                            inEscape = true;
                            lcv++;
                            continue;
                        }
                        pos++;
                        var value = handler(lineNumber, pos, line[lcv], lcv, function(){
                            shortcircuit = true;
                        });
                        if(value != undefined){
                            //increment by the length of all the extra chars attached to this value
                            var a = line.substring(0, lcv-1)+value+line.substring(lcv+1);
                            lcv += value.length-2;
                            line = a;
                        }
                    }
                }
                lines[lineNumber] = line;
            }
            return lines.join("\n");
        }
    }

    var codes = {
        "off"       : '\033[0m',
        "reset"     : '\033[0m',
        "bold"      : '\033[1m',
        "italic"    : '\033[3m',
        "underline" : '\033[4m',
        "framed"    : '\033[51m',
        "encircled" : '\033[52m',
        "overline"  : '\033[53m',
        "blink"     : '\033[5m',
        "inverse"   : '\033[7m',
        "hidden"    : '\033[8m',
        "black"     : '\033[30m',
        "red"       : '\033[31m',
        "green"     : '\033[32m',
        "yellow"    : '\033[33m',
        "blue"      : '\033[34m',
        "magenta"   : '\033[35m',
        "cyan"      : '\033[36m',
        "white"      : '\033[37m',
        "gray"      : '\033[90m',
        "bright_black": '\033[90m',
        "bright_red"  : '\033[91m',
        "bright_green": '\033[92m',
        "bright_yellow": '\033[93m',
        "bright_blue" : '\033[94m',
        "bright_magenta": '\033[95m',
        "bright_cyan" : '\033[96m',
        "bright_white": '\033[97m',
        "black_bg"  : '\033[40m',
        "red_bg"    : '\033[41m',
        "green_bg"  : '\033[42m',
        "yellow_bg" : '\033[43m',
        "blue_bg"   : '\033[44m',
        "magenta_bg": '\033[45m',
        "cyan_bg"   : '\033[46m',
        "white_bg"  : '\033[47m',

        "gray_bg"  : '\033[100m',

        "bright_black_bg"  : '\033[100m',
        "bright_red_bg"    : '\033[101m',
        "bright_green_bg"  : '\033[102m',
        "bright_yellow_bg" : '\033[103m',
        "bright_blue_bg"   : '\033[104m',
        "bright_magenta_bg": '\033[105m',
        "bright_cyan_bg"   : '\033[106m',
        "bright_white_bg"  : '\033[107m'
    };

    AsciiArt.Ansi.Codes = function(str, color, forceOff) {
        if(!color) return str;
        var color_attrs = color.split("+");
        var ansi_str = "";
        for(var i=0, attr; attr = color_attrs[i]; i++) {
            ansi_str += codes[attr];
        }
        ansi_str += str;
        if(forceOff) ansi_str += codes["off"];
        return ansi_str;
    };

    //will probably migrate to .codes()
    AsciiArt.Ansi.codes = AsciiArt.Ansi.Codes;

    AsciiArt.Ansi.setInstance = function(art){
        parentArt = art;
    }

    return AsciiArt;
}));
