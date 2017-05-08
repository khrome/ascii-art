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
    var ansi256 = [
        //standard ansi colors
        "#000000", "#800000", "#008000", "#808000", "#000080", "#800080",
        "#008080", "#c0c0c0", "#808080", "#ff0000", "#00ff00", "#ffff00",
        "#0000ff", "#ff00ff", "#00ffff", "#ffffff",

        //greyscale
        "#080808", "#121212", "#1c1c1c", "#262626", "#303030", "#3a3a3a",
        "#444444", "#4e4e4e", "#585858", "#626262", "#6c6c6c", "#767676",
        "#eeeeee", "#e4e4e4", "#dadada", "#d0d0d0", "#c6c6c6", "#bcbcbc",
        "#b2b2b2", "#a8a8a8", "#9e9e9e", "#949494", "#8a8a8a", "#808080",

         //256 color additions
        "#000000", "#00005f", "#000087", "#0000af", "#0000d7", "#0000ff",
        "#005f00", "#005f5f", "#005f87", "#005faf", "#005fd7", "#005fff",
        "#008700", "#00875f", "#008787", "#0087af", "#0087d7", "#0087ff",
        "#00af00", "#00af5f", "#00af87", "#00afaf", "#00afd7", "#00afff",
        "#00d700", "#00d75f", "#00d787", "#00d7af", "#00d7d7", "#00d7ff",
        "#00ff00", "#00ff5f", "#00ff87", "#00ffaf", "#00ffd7", "#00ffff",
        "#5fff00", "#5fff5f", "#5fff87", "#5fffaf", "#5fffd7", "#5fffff",
        "#5fd700", "#5fd75f", "#5fd787", "#5fd7af", "#5fd7d7", "#5fd7ff",
        "#5faf00", "#5faf5f", "#5faf87", "#5fafaf", "#5fafd7", "#5fafff",
        "#5f8700", "#5f875f", "#5f8787", "#5f87af", "#5f87d7", "#5f87ff",
        "#5f5f00", "#5f5f5f", "#5f5f87", "#5f5faf", "#5f5fd7", "#5f5fff",
        "#5f0000", "#5f005f", "#5f0087", "#5f00af", "#5f00d7", "#5f00ff",
        "#8700ff", "#8700d7", "#8700af", "#870087", "#87005f", "#870000",
        "#875fff", "#875fd7", "#875faf", "#875f87", "#875f5f", "#875f00",
        "#8787ff", "#8787d7", "#8787af", "#878787", "#87875f", "#878700",
        "#87afff", "#87afd7", "#87afaf", "#87af87", "#87af5f", "#87af00",
        "#87d7ff", "#87d7d7", "#87d7af", "#87d787", "#87d75f", "#87d700",
        "#87ffff", "#87ffd7", "#87ffaf", "#87ff87", "#87ff5f", "#87ff00",
        "#afffff", "#afffd7", "#afffaf", "#afff87", "#afff5f", "#afff00",
        "#afd7ff", "#afd7d7", "#afd7af", "#afd787", "#afd75f", "#afd700",
        "#afafff", "#afafd7", "#afafaf", "#afaf87", "#afaf5f", "#afaf00",
        "#af87ff", "#af87d7", "#af87af", "#af8787", "#af875f", "#af8700",
        "#af5fff", "#af5fd7", "#af5faf", "#af5f87", "#af5f5f", "#af5f00",
        "#af00ff", "#af00d7", "#af00af", "#af0087", "#af005f", "#af0000",
        "#d70000", "#d7005f", "#d70087", "#d700af", "#d700d7", "#d700ff",
        "#d75f00", "#d75f5f", "#d75f87", "#d75faf", "#d75fd7", "#d75fff",
        "#d78700", "#d7875f", "#d78787", "#d787af", "#d787d7", "#d787ff",
        "#dfaf00", "#dfaf5f", "#dfaf87", "#dfafaf", "#dfafdf", "#dfafff",
        "#dfdf00", "#dfdf5f", "#dfdf87", "#dfdfaf", "#dfdfdf", "#dfdfff",
        "#dfff00", "#dfff5f", "#dfff87", "#dfffaf", "#dfffdf", "#dfffff",
        "#ffff00", "#ffff5f", "#ffff87", "#ffffaf", "#ffffdf", "#ffffff",
        "#ffdf00", "#ffdf5f", "#ffdf87", "#ffdfaf", "#ffdfdf", "#ffdfff",
        "#ffaf00", "#ffaf5f", "#ffaf87", "#ffafaf", "#ffafdf", "#ffafff",
        "#ff8700", "#ff875f", "#ff8787", "#ff87af", "#ff87df", "#ff87ff",
        "#ff5f00", "#ff5f5f", "#ff5f87", "#ff5faf", "#ff5fdf", "#ff5fff",
        "#ff0000", "#ff005f", "#ff0087", "#ff00af", "#ff00df", "#ff00ff"
    ]

    return AsciiArt;
}));
