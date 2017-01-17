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
            }, request);
        });
    } else if (typeof module === 'object' && module.exports) {

        module.exports = factory(function(){
            return require('./image');
        },function(){
            return require('./table');
        },function(){
            return require('./figlet');
        }, require('fs'), require('request'));

    } else {
        root.AsciiArt = factory(function(){
            return root.AsciiArtImage;
        }, function(){
            return root.AsciiArtTable;
        }, function(){
            return root.AsciiArtFiglet;
        }, root.fs);
    }
}(this, function(getImage, getTable, getFiglet, fs, request) {
    var get ={
        Image : getImage,
        Table : getTable,
        Figlet : getFiglet
    };
    var AsciiArt = {
        value : 'variant1',
        valueScales : {
            solid : '█'.split(''),
            variant1 : ' .,:;i1tfLCG08@'.split(''),
            variant2 : '@%#*+=-:. '.split('').reverse(),
            variant3 : '#¥¥®®ØØ$$ø0oo°++=-,.    '.split('').reverse(),
            variant4 : '#WMBRXVYIti+=;:,. '.split('').reverse(),
            'ultra-wide' : ('MMMMMMM@@@@@@@WWWWWWWWWBBBBBBBB000000008888888ZZZZZZZZZaZaaaaaa2222222SSS'
                +'SSSSXXXXXXXXXXX7777777rrrrrrr;;;;;;;;iiiiiiiii:::::::,:,,,,,,.........    ').split('').reverse(),
            wide : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.split(''),
            hatching : '##XXxxx+++===---;;,,...    '.split('').reverse(),
            bits : '# '.split('').reverse(),
            binary : '01 '.split('').reverse(),
            greyscale : ' ▤▦▩█'.split(''),
            blocks : ' ▖▚▜█'.split('')
        },
        color : ' CGO08@'.split(''),
        font : 'courier new',
        fontPath : 'fonts/',
        invert : false,
        alpha : false,
        errorMode : 'console',
    };
    AsciiArt.ansi = {
        length:function(value){
            var count = 0;
            AsciiArt.ansi.map(value, function(row, column, chr, pos, done){
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
            AsciiArt.ansi.map(str, function(row, column, chr, pos, done){
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
            if(x < 0) x = (AsciiArt.ansi.length(bgLines[0]) - AsciiArt.ansi.length(lines[0])) + x+1;
            var str = AsciiArt.ansi.map(background, function(row, column, chr, pos, done){
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
                        AsciiArt.ansi.charAt(lines[row-y], column-x)
                    , options.style);
                    else return AsciiArt.ansi.charAt(lines[row-y], column-x)
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



    var getTextFile = function(file, cb){
        var parts = (file ||'').split('/')
        if(!parts.filter(function(p){ return p.trim() }).length){
            throw new Error('incomplete path provided!');
        }

        switch(parts[0]){
            case 'textfiles.com':
                if(parts[1]){
                    var pre = '';
                    var post = '';
                    switch(parts[1]){
                        case 'NFOS':
                            post = 'asciiart/';
                        case 'asciiart':
                            pre = 'artscene.';
                            break;
                        case 'LOGOS':
                        case 'DECUS':
                            post = 'art/';
                            break;
                        case 'RAZOR':
                        case 'FAIRLIGHT':
                        case 'DREAMTEAM':
                        case 'HUMBLE':
                        case 'HYBRID':
                        case 'PRESTIGE':
                        case 'INC':
                        case 'TDUJAM':
                        case 'ANSI':
                            post = 'piracy/';
                            break;
                    }
                    request(
                        'http://'+pre+'textfiles.com/'+post+parts[1]+'/'+parts[2],
                        function(err, res, body){
                            var data = body ||
                                (
                                    res && res.request &&
                                    res.request.responseContent &&
                                    res.request.responseContent.body
                                ) || undefined;
                            cb(undefined, data);
                        }
                    );
                break;
            }
            //default : throw new Error('unknown art source:'+parts[0]);
        }
    }

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
    var safeCombine = function(oldText, newText, style){
        return combine(
            oldText||
                (new Array(newText.split("\n").length)).join("\n"),
            newText,
            style
        );
    }
    var fontChain = function(){
        var cb;
        var chain = [];
        var result;
        var ob = this;
        var done = function(){
            ob.working = false;
            check();
        }
        var check = function(){
            if(ob.working) return;
            else ob.working = true;
            if(result && cb && chain.length === 0){
                check = function(){};
                cb(result);
            }
            //todo: refactor this rat's nest into a mode switch
            var item;
            var mode;
            if(chain.length){
                 item = chain.shift();
                 if(item.options) item = item.options;
                 if(typeof item == 'string'){
                     mode = 'join';
                 }else{
                     if(item.artwork){
                         mode = 'artwork';
                     }else{
                         if(item.start !== undefined || item.stop ){
                             mode = 'lines';
                         }else{
                             if(item.x !== undefined &&
                                 item.y !== undefined
                             ){
                                 mode = 'overlay';
                             }else{
                                 if(item.font){
                                     mode = 'font';
                                 }else{
                                     if(item.data){
                                         mode = 'table';
                                     }else{
                                         mode = 'image';
                                     }
                                 }
                             }
                         }
                     }
                 }
             }
             switch(mode){
                 case 'join':
                     setTimeout(function(){
                         result = safeCombine(result, item);
                         done();
                     }, 1);
                    break;
                 case 'artwork':
                     getTextFile(item.artwork, function(err, artwork){
                         result = safeCombine(result, artwork);
                         done();
                     });
                    break;
                 case 'lines':
                     setTimeout(function(){
                         result = (
                             result.split("\n").slice( item.start || 0, item.stop)
                         ).join("\n");
                         done();
                     }, 1);
                    break;
                 case 'overlay':
                     setTimeout(function(){
                         var overlaid = AsciiArt.ansi.intersect(
                             result, item.text, item
                         );
                         if(overlaid) result = overlaid;
                         done();
                     }, 1);
                    break;
                 case 'font':
                     AsciiArt.Figlet.write(item.text, item.font, function(text){
                         result = safeCombine(result, text, item.style);
                         done();
                     });
                     break;
                 case 'table':
                     setTimeout(function(){
                         var opts = {};
                         [
                             'intersection', 'horizontalBar', 'verticalBar',
                             'dataStyle', 'headerStyle', 'bars', 'cellStyle',
                             'borderColor'
                         ].forEach(function(opt){
                             opts[opt] = item[opt];
                         })
                         var table = new AsciiArt.Table(opts);
                         var fields = item.columns ||
                            Object.keys(item.data[0]||{});
                         table.setHeading.apply(table, fields);
                         table.data = item.data;
                         var res = table.write(
                             item.width ||
                             (
                                 process &&
                                 process.stdout &&
                                 process.stdout.columns
                             ) || 80
                         );
                         result = safeCombine(result, res);
                         done();
                     }, 1);
                    break;
                 case 'image':
                    var image = new AsciiArt.Image(item);
                     image.write(function(err, text){
                         if(!err) result = safeCombine(result, text);
                         done();
                     });
                    break;
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
        this.artwork = function(artwork, callback){
            if(callback) cb = callback;
            chain.push({
                artwork : artwork,
            });
            check();
            return ob;
        }
        this.lines = function(start, stop, callback){
            var opts = { start : start };
            if(typeof stop == 'function'){
                cb = stop;
            }else{
                if(callback) cb = callback;
                opts.stop = stop;
            }
            chain.push(opts);
            check();
            return ob;
        }
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
        this.join = function(text, callback){
            if(callback) cb = callback;
            chain.push(text);
            check();
            return ob;
        };
        this.overlay = function(text, options, callback){
            if(typeof options == 'function'){
                callback = options;
                options = {x:0, y:0};
            }
            if(callback) cb = callback;
            chain.push({
                options : {
                    x: options.x ||0,
                    y: options.y ||0,
                    style: options.style,
                    transparent: !!options.transparent,
                    chroma: typeof options.transparent == 'string'?
                        options.transparent:undefined,
                    text: text
                }
            });
            check();
            return ob;
        };//*/
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

    AsciiArt.artwork = function(options, callback){
        if(!callback){
            var chain = fontChain.apply({});
            return chain.image(options);
        }else{
            getTextFile(options.artwork, function(err, artwork){
                callback(artwork);
            });
        }
    } //*/

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
            var fields = options.columns || Object.keys(options.data[0] ||{});
            table.setHeading.apply(table, fields);
            table.data = options.data;
            var result = table.write(
                options.width ||
                (
                    process &&
                    process.stdout &&
                    process.stdout.columns
                ) || 80
            );
            callback(result);
        }
    }

    AsciiArt.strings = function(strs, options, callback){
        if(typeof options == 'string') options = {font:options};
        var jobs = 0;
        var results = [];
        function checkComplete(){
            jobs--;
            if(jobs == 0) callback.apply(callback, results);
        }
        strs.forEach(function(str, index){
            jobs++;
            AsciiArt.font(str, options.font, options.style, function(rendered){
                results[index] = rendered;
                checkComplete();
            })
        });
    }

    AsciiArt.style = AsciiArt.ansiCodes;

    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return AsciiArt;
}));
