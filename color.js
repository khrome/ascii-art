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

    var Color = {};
    /*AsciiArt.Image.Color.distance = function(r1, g1, b1, r2, g2, b2){
        return (Math.abs(r1-r2)+Math.abs(g1-g2)+Math.abs(b1-b2))/3;
    }//*/
    Color.distance = function(r1, g1, b1, r2, g2, b2){
        return (Math.abs(r1-r2)+Math.abs(g1-g2)+Math.abs(b1-b2)+
            //add the value change in as well
0
            //Math.abs(Math.max(r1, g1, b1)-Math.max(r2, g2, b2))/2
        )/3 + Math.abs(Math.max(r1, g1, b1)-Math.max(r2, g2, b2))/2;
    }
    Color.Colors = function(colorList){
        this.colors = colorList;
    };
    Color.channels = function(value){
        //todo: handle, like, any other format
        //todo: cache?
        return [
            parseInt("0x"+value.substring(0,2)),
            parseInt("0x"+value.substring(2,4)),
            parseInt("0x"+value.substring(4,6))
        ];
    }
    Color.Colors.prototype.average = function(callback){
        var total = ob.colors.map(function(color){
            return Color.channels(color);
        }).reduce(function(a, b){
            return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
        });
        var result = [
            Math.floor(total[0]/this.colors.length),
            Math.floor(total[1]/this.colors.length),
            Math.floor(total[2]/this.colors.length),
        ];
        this.colors = result[0].toString(16)+
            result[1].toString(16)+
            result[2].toString(16);
        if(callback) callback();
    }
    Color.Colors.prototype.reduceTo = function(count, callback){
        var done = function(){ if(callback) callback() };
        if(count === 1) this.average(done);
        else this.shrink({count: this.colors.length - count}, done);

    }

    // glyxel: part glyph, part pixel. (Implies a fixed width grid)
    Color.Colors.prototype.renderGlyxel = function(text, color, mode){
        switch(mode){
            case '256':
                break;
            case 'true':
                break;
            case 'html':
                break;
            default:
                var closestColorInGamut = this.
                var index = commonColors.indexOf(color);
                var offset =
                return '\033[100m',
        }
    }

    Color.Colors.prototype.shrink = function(options, callback){
        if(options && options.count){
            var cache = {};
            for(var lcv=0; lcv < options.count || 1; lcv++) this.shrink({
                weights : options.weights,
                cache : cache
            });
            if(callback) callback();
            return;
        }
        if(!options.cache) options.cache = {};
        //todo: lots of caching
        var occurances = options.occurances || {};
        var results = this.colors.map(function(thisColor){
            var theseChannels = Color.channels(thisColor);
            var minimum = ob.colors.map(function(thatColor){
                if(options.cache[thisColor+thatColor]) return options.cache[thisColor+thatColor];
                var thoseChannels = Color.channels(thatColor);
                var distance = (options.distance || Color.distance)(
                    theseChannels.concat(thoseChannels)
                );
                var result = {
                    distance : distance,
                    color : thatColor
                }
                options.cache[thisColor+thatColor] = result;
                return result;
            }).reduce(function(a, b){
                if(a.distance < b.distance) return a;
                else return b;
            });
            return {
                color : thisColor,
                other : minimum.color,
                distance : minimum.distance,
                occurances : occurances[thisColor]
            }
        });
        var minimumDistance;
        results.forEach(function(result){
            if( (!minimumDistance) || result.minimumDistance < minimumDistance){
                minimumDistance = result.minimumDistance;
            }
        });
        var result = results.filter(function(result){
            result.distance == minimumDistance;
        }).reduce(function(a, b){
            return a.occurances > b.occurances?b:a;
        });
        var position = this.colors.indexOf(result.color);
        if(position === -1) throw new Error('could not find color');
        this.colors.splice(position, 1);
    }

    var closest = function(color, colors, names, options){
        var distances = colors.map(function(candidate){
            return (options.distance || AsciiArt.Image.Color.distance)(
                color[0], color[1], color[2],
                candidate[0], candidate[1], candidate[2]
            );
        });
        var position;
        var distance;
        distances.forEach(function(thisDistance, pos){
            if( (!distance) || distance > thisDistance ){
                distance = thisDistance;
                position = pos;
            }
        });
        return names?names[position]:colors[position];
    };

    Color.getTerminalColor = function(r, g, b, options){
        var names = Object.keys(color_profiles.darwin);
        var colors = names.map(function(name){
            return color_profiles.darwin[name];
        });
        return closest([r, g, b], colors, names, options);
    }



    var color_profiles = {
        "darwin" : {
            //30-37 bg@ 40-47
             "black" : [0, 0, 0],
             "red" : [194, 54, 33],
             "green" : [37, 188, 36],
             "yellow" : [173, 173, 39],
             "blue" : [73, 46, 225],
             "magenta": [211, 56, 211],
             "cyan": [51, 187, 200],
             "white": [203, 204, 205],
             //\038[2;r;g;bm
             //90-97 bg@ 100-107
             "bright_black": [129, 131, 131],
             "bright_red": [252,57,31],
             "bright_green": [49, 231, 34],
             "bright_yellow": [234, 236, 35],
             "bright_blue": [88, 51, 255],
             "bright_magenta": [249, 53, 248],
             "bright_cyan": [20, 240, 240],
             "bright_white": [233, 235, 235]
        }
    };

    //30-37
    var namedColors = [
        "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
        "bright_black", "bright_red", "bright_green", "bright_yellow",
        "bright_blue", "bright_magenta", "bright_cyan", "bright_white"
    ]

    var standardColors = [ //standard ansi colors in 256 color sequence
        "#000000", "#800000", "#008000", "#808000", "#000080", "#800080",
        "#008080", "#c0c0c0", "#808080", "#ff0000", "#00ff00", "#ffff00",
        "#0000ff", "#ff00ff", "#00ffff", "#ffffff"
    ];

    var greyscale256 = [
        "#080808", "#121212", "#1c1c1c", "#262626", "#303030", "#3a3a3a",
        "#444444", "#4e4e4e", "#585858", "#626262", "#6c6c6c", "#767676",
        "#eeeeee", "#e4e4e4", "#dadada", "#d0d0d0", "#c6c6c6", "#bcbcbc",
        "#b2b2b2", "#a8a8a8", "#9e9e9e", "#949494", "#8a8a8a", "#808080"
    ];

    var color256 = [
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
    ];

    var ansi256 = standardColors.concat(greyscale256)
        .concat(color256).map(function(item){
            return [
                parseInt(item.substring(1, 3), 16),
                parseInt(item.substring(3, 5), 16),
                parseInt(item.substring(5, 7), 16)
            ];
        })
    ;

    var ColorTable = function(){
        this.colors = [];
    };

    ColorTable.prototype.addColor(value) = function(){
        if(this.colors.)
    }

    ColorTable.prototype.colorAs = function(color, mode){
        switch(mode){
            case '256':
                break;
            case 'true':
                break;
            case 'html':
                break;
            default:
                var closestColorInGamut = this.
                var index = commonColors.indexOf(color);
                var offset =
                return '\033[100m',
        }
    }

    var Color = function(value){
        this.id = Array.prototype.join.apply(arguments);
        if(typeof value == 'string'){

            if(value[0] === '#'){

            }else{
                throw new Error('only hex values and short-names are currently supported')
            }
        }
    };

    Color.of = function(value, cache){

    }

    return AsciiArt;
}));
