var AsciiArt = {
    value : 'variant1',
    valueScales : {
        variant1 : ' .,:;i1tfLCG08@'.split(''),
        variant2 : '@%#*+=-:. '.split('').reverse(),
        variant3 : '#´´¨¨¯¯$$¿0oo¡++=-,.    '.split('').reverse(),
        variant4 : '#WMBRXVYIti+=;:,. '.split('').reverse(),
        'ultra-wide' : ('MMMMMMM@@@@@@@WWWWWWWWWBBBBBBBB000000008888888ZZZZZZZZZaZaaaaaa2222222SSS'
            +'SSSSXXXXXXXXXXX7777777rrrrrrr;;;;;;;;iiiiiiiii:::::::,:,,,,,,.........       ').split('').reverse(),
        wide : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.split('').reverse(),
        hatching : '##XXxxx+++===---;;,,...    '.split('').reverse(),
        bits : '# '.split('').reverse(),
        binary : '01 '.split('').reverse(),
        greyscale : '"???? '.split('').reverse()
    },
    color : ' CGO08@'.split(''),
    font : 'courier new',
    fontPath : 'fonts/',
    invert : false,
    alpha : false,
    errorMode : 'console',
};
AsciiArt.ansiCodes = function(str, color) {
    if(!color) return str;
    if(!this.codes){
        this.codes = {
            "off"       : '\033[0m',
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
            "white"     : '\033[37m',
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
            "white_bg"  : '\033[47m'
        };
    }
    var color_attrs = color.split("+");
    var ansi_str = "";
    for(var i=0, attr; attr = color_attrs[i]; i++) {
        ansi_str += this.codes[attr];
    }
    ansi_str += str + this.codes["off"];
    return ansi_str;
};
// this code originates with http://github.com/scottgonzalez/figlet-js
// if that ever makes it to NPM, it will become a dependency
AsciiArt.Figlet = {
    fonts: {},
    fontPath : __dirname+'/Fonts/',
    parseFont: function(name, fn) { 
        if (AsciiArt.Figlet.fonts[name]) fn(AsciiArt.Figlet.fonts[name]);
        else AsciiArt.Figlet.loadFont(name, function(defn){
            AsciiArt.Figlet._parseFont(name, defn, function(font){
                AsciiArt.Figlet.fonts[name] = font;
                fn(font);
            });
        });
    },
    _parseFont: function(name, defn, fn) {
        var lines = defn.split("\n");
        var header = lines[0].split(" ");
        var hardblank = header[0].charAt(header[0].length - 1);
        var height = +header[1];
        var comments = +header[5];
        var font = {
            defn: lines.slice(comments + 1),
            hardblank: hardblank,
            height: height,
            char: {}
        };
        fn(font);
    },
    parseChar: function(char, font) {
        if(char > 122) return;
        if (char in font.char) return font.char[char];
        var height = font.height,
            start = (char - 32) * height,
            charDefn = [],
            i;
        for (i = 0; i < height; i++) {
            if(!font.defn[start + i]) return;
            charDefn[i] = font.defn[start + i].replace(/@/g, "")
            .replace(RegExp("\\" + font.hardblank, "g"), " ");
        }
        return font.char[char] = charDefn;
    },
    loadFont: function(name, fn) {
        var fs = require('fs');
        var fileName = this.fontPath + name+ '.flf';
        fs.readFile(fileName, 'utf8', function(error, data) {
            if(error) throw(error);
            if(data) fn(data);
        });
    },
    preloadDirectory : function(path, callback){
        //todo
    },
    write : function(str, fontName, callback) {
        AsciiArt.Figlet.parseFont(fontName, function(font) {
            var chars = {},
            result = "";
            for (var i = 0, len = str.length; i < len; i++) {
                chars[i] = AsciiArt.Figlet.parseChar(str.charCodeAt(i), font);
            }
            for (var i = 0, height = chars[0].length; i < height; i++) {
                for (var j = 0; j < len; j++) {
                    if(chars[j]) result += chars[j][i];
                }
                result += "\n";
            }
            callback(result, font);
        });
    }
};
//todo: optional styling on font callback
var combine = function(blockOne, blockTwo, style){
    var linesOne = blockOne.split("\n");
    var linesTwo = blockTwo.split("\n");
    var diff = Math.max(linesOne.length - linesTwo.length, 0);
    linesOne.forEach(function(line, index){
        if(index >= diff){
            if(style){
                linesOne[index] = linesOne[index]+AsciiArt.ansiCodes(linesTwo[index-diff], style);
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
    var check = function(){
        if(!this.checking) this.checking = true;
        if(result && cb && chain.length === 0) cb(result);
        if(chain.length){
            var item = chain.shift();
            AsciiArt.Figlet.write(item.text, item.font, function(text){
                result = combine(result||(new Array(text.split("\n").length)).join("\n"), text, item.style);
                check();
            });
        }
    }
    ob = this;
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
        if(!this.checking) check();
        return ob;
    };
    return this;
};

AsciiArt.font = function(str, fontName, style, callback){
    if(!callback){
        var chain = fontChain();
        return chain.font(str, fontName, style);
    }else{
        return AsciiArt.Figlet.write(str, fontName, function(text){
            if(style) text = AsciiArt.ansiCodes(text, style);
            callback(text);
        });
    }
}
//AsciiArt.font = AsciiArt.Figlet.write;
AsciiArt.style = AsciiArt.ansiCodes;
//todo: AsciiArt.image
module.exports = AsciiArt;