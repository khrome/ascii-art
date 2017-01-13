(function (root, factory) { // UMD - returnExports
    if (typeof define === 'function' && define.amd) {
        define(['./image', './table', './figlet', 'browser-request', 'dirname-shim'], function(img, request, shim){
            return factory(function(){
                return img;
            },function(){
                return tbl;
            },function(){
                return fig;
            }, {
                readFile : function(filename, cs, fn){
                    var cb = typeof cs === 'string'?fn:cs;
                    request({
                        url: __dirname +'/'+filename
                    }, function(err, req, data){
                        if(err) return cb(err);
                        else cb(undefined, data);
                    })
                }
            });
        });
    } else if (typeof module === 'object' && module.exports) {

        module.exports = factory(function(){
            return require('./image');
        },function(){
            return require('./table');
        },function(){
            return require('./figlet');
        }, require('fs'));

    } else {
        root.AsciiArt = factory(function(){
            return root.AsciiArtImage;
        }, function(){
            return root.AsciiArtTable;
        }, function(){
            return root.AsciiArtFiglet;
        }, root.fs);
    }
}(this, function(getImage, getTable, getFiglet, fs) {
    var get ={
        Image : getImage,
        Table : getTable,
        Figlet : getFiglet
    };
    var AsciiArt = {
        value : 'variant1',
        valueScales : {
            variant1 : ' .,:;i1tfLCG08@'.split(''),
            variant2 : '@%#*+=-:. '.split('').reverse(),
            variant3 : '#¥¥®®ØØ$$ø0oo°++=-,.    '.split('').reverse(),
            variant4 : '#WMBRXVYIti+=;:,. '.split('').reverse(),
            'ultra-wide' : ('MMMMMMM@@@@@@@WWWWWWWWWBBBBBBBB000000008888888ZZZZZZZZZaZaaaaaa2222222SSS'
                +'SSSSXXXXXXXXXXX7777777rrrrrrr;;;;;;;;iiiiiiiii:::::::,:,,,,,,.........       ').split('').reverse(),
            wide : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.split('').reverse(),
            hatching : '##XXxxx+++===---;;,,...    '.split('').reverse(),
            bits : '# '.split('').reverse(),
            binary : '01 '.split('').reverse(),
            greyscale : ' ▤▦▩█'.split('').reverse(),
            blocks : ' ▖▚▜█'.split('').reverse()
        },
        color : ' CGO08@'.split(''),
        font : 'courier new',
        fontPath : 'fonts/',
        invert : false,
        alpha : false,
        errorMode : 'console',
    };
    AsciiArt.ansiCodes = function(str, color, forceOff) {
        if(!color) return str;
        if(!this.codes){
            this.codes = {
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
        }
        var color_attrs = color.split("+");
        var ansi_str = "";
        for(var i=0, attr; attr = color_attrs[i]; i++) {
            ansi_str += this.codes[attr];
        }
        ansi_str += str;
        if(forceOff) ansi_str += this.codes["off"];
        return ansi_str;
    };

    function proxyOnFirstReference(name){
        Object.defineProperty(AsciiArt, name, {
            get: function() {
                result = get[name]()[name];
                result.setInstance(AsciiArt);
                AsciiArt[name] = result;
                return result;
            },
            enumerable: true,
            configurable: true
        });
    }
    proxyOnFirstReference('Figlet');
    proxyOnFirstReference('Image');
    proxyOnFirstReference('Table');

    //todo: optional styling on font callback
    var combine = function(blockOne, blockTwo, style){
        var linesOne = blockOne.split("\n");
        var linesTwo = blockTwo.split("\n");
        var diff = Math.max(linesOne.length - linesTwo.length, 0);
        linesOne.forEach(function(line, index){
            if(index >= diff){
                if(style){
                    linesOne[index] = linesOne[index]+AsciiArt.ansiCodes(linesTwo[index-diff], style, true);
                }else{
                    linesOne[index] = linesOne[index]+linesTwo[index-diff];
                }
            }
        });
        return linesOne.join("\n");
    };
    var fontChain = function(){
        var cb;
        var chain = [];
        var result;
        var ob = this;
        var check = function(){
            if(ob.working) return;
            else ob.working = true;
            if(result && cb && chain.length === 0){
                check = function(){};
                cb(result);
             }
            if(chain.length){
                var item = chain.shift();
                if(item.font){
                    AsciiArt.Figlet.write(item.text, item.font, function(text){
                        result = combine(result||(new Array(text.split("\n").length)).join("\n"), text, item.style);
                        ob.working = false;
                        check();
                    });
                }else{
                    if(item.data){
                        var table = new AsciiArt.Table({
                            intersection : item.intersection,
                            horizontalBar : item.horizontalBar,
                            verticalBar : item.verticalBar,
                            verticalBar : item.verticalBar,
                            headerStyle : item.headerStyle,
                        });
                        if(item.columns) table.setHeading(item.columns);
                        var fields = Object.keys(item.data[0])
                        table.data = item.data;
                        var res = table.write(item.width || 80);
                        result = combine(result||(new Array(text.split("\n").length)).join("\n"), text, '');
                        check();
                    }else{
                        var image = new AsciiArt.Image(item.options);
                        image.write(function(err, text){
                            if(!err) result = combine(result||(new Array(text.split("\n").length)).join("\n"), text, '');
                            ob.working = false;
                            check();
                        });
                    }
                }
            }
        }
        this.font = function(str, fontName, style, callback){
            if(typeof style == 'function'){
                callback = style;
                style = undefined;
            }
            if(callback) cb = callback;
            chain.push({
                font : fontName,
                text : str,
                style : style
            });
            check();
            return ob;
        };
        this.image = function(options, callback){
            if(callback) cb = callback;
            chain.push({
                options : options,
            });
            check();
            return ob;
        };
        this.table = function(options, callback){
            if(callback) cb = callback;
            chain.push(options);
            check();
            return ob;
        };
        return this;
    };

    AsciiArt.font = function(str, fontName, style, callback){
        if(typeof style == 'function' && !callback){
            callback = style;
            style = undefined;
        }
        if(!callback){
            var chain = fontChain.apply({});
            return chain.font(str, fontName, style);
        }else{
            return AsciiArt.Figlet.write(str, fontName, function(text){
                if(style) text = AsciiArt.ansiCodes(text, style, true);
                callback(text);
            });
        }
    }

    AsciiArt.image = function(options, callback){
        if(!callback){
            var chain = fontChain.apply({});
            return chain.image(options);
        }else{
            var image = new AsciiArt.Image(options);
            image.write(function(err, text){
                callback(text);
            });
        }
    }

    AsciiArt.table = function(options, callback){
        if(!callback){
            var chain = fontChain.apply({});
            return chain.table(options);
        }else{
            var opts = {};
            [
                'intersection', 'horizontalBar', 'verticalBar',
                'dataStyle', 'headerStyle', 'bars', 'cellStyle',
                'borderColor'
            ].forEach(function(opt){
                opts[opt] = options[opt];
            })
            var table = new AsciiArt.Table(opts);
            if(options.columns) table.setHeading.apply(
                table, options.columns
            );
            var fields = Object.keys(options.data[0])
            table.data = options.data;
            var result = table.write(options.width || 80);
            callback(result);
        }
    }

    AsciiArt.style = AsciiArt.ansiCodes;

    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return AsciiArt;
}));
