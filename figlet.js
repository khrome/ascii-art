(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['browser-request', 'dirname-shim'], function(request, dirname){
            factory({
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
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory(require('fs'));
    }else{
        // Browser globals (root is window)
        root.AsciiArtImage = factory();
    }
}(this, function(fs){
    var AsciiArt = {};
    var parentArt;

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
            //var fs = require('fs');
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
            AsciiArt.Figlet.parseFont(fontName, function(font){
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

    AsciiArt.Figlet.setInstance = function(art){
        parentArt = art;
    }

    return AsciiArt;
}));
