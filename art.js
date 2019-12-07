(function(root, factory){
    if(typeof define === 'function' && define.amd){
        define([
            'ascii-art-ansi',
            'ascii-art-font',
            'ascii-art-image',
            'ascii-art-table',
            'ascii-art-graph',
            'ascii-art-utf',
            'ascii-art-ansi/grid',
            'strangler'
        ], factory);
    }else if(typeof module === 'object' && module.exports){
        module.exports = factory(
            require('ascii-art-ansi'),
            require('ascii-art-font'),
            require('ascii-art-image'),
            require('ascii-art-table'),
            require('ascii-art-graph'),
            require('ascii-art-utf'),
            require('ascii-art-ansi/grid'),
            require('strangler')
        );
    }else{
        root.AsciiArt = factory(
            root.AsciiArtAnsi,
            root.AsciiArtFont,
            root.AsciiArtImage,
            root.AsciiArtTable,
            root.AsciiArtGraph,
            root.AsciiArtUTF,
            root.AsciiArtAnsiGrid,
            root.Strangler
        );
    }
}(typeof self !== 'undefined' ? self : this, function(Ansi, Font, Image, Table, Graph, utf, TextGrid, Strangler){

    var AsciiArt = { Ansi, Font, Image, Table, Graph };

    var boxEdge = function(type, size, options, style){
        var edge = '';
        switch(type){
            case 'l':
                edge += options.ul+"\n";
                for(var lcv=2; lcv< size; lcv++){
                    edge += style(options.l)+"\n";
                }
                edge += style(options.ll);
                break;
            case 'r':
                edge += options.ur+"\n";
                for(var lcv=2; lcv< size; lcv++){
                    edge += style(options.r)+"\n";
                }
                edge += style(options.lr);
                break;
            case 't':
                for(var lcv=0; lcv< size; lcv++){
                    edge += style(options.t);
                }
                break;
            case 'b':
                for(var lcv=0; lcv< size; lcv++){
                    edge += style(options.b);
                }
                break;
        }
        return edge;
    }

    var getTextFile = function(file, cb){
        var parts = (file ||'').split('/')
        if(!parts.filter(function(p){ return p.trim() }).length){
            throw new Error('incomplete path provided!');
        }

        /*switch(parts[0]){
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
        }*/
    }

    //todo: optional styling on font callback
    var combine = function(blockOne, blockTwo, style){
        var linesOne = blockOne.split("\n");
        var linesTwo = blockTwo.split("\n");
        var diff = Math.max(linesOne.length - linesTwo.length, 0);
        linesOne.forEach(function(line, index){
            if(index >= diff){
                if(style){
                    linesOne[index] = linesOne[index]+AsciiArt.Ansi.Codes(linesTwo[index-diff], style, true);
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
                cb(undefined, result);
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
                                         if(item.style && item.text){
                                             mode = 'style';
                                         }else{
                                             if(item.height && item.width && item.graph){
                                                 mode = 'graph';
                                             }else{
                                                 if(item.l && item.r && item.t && item.b){
                                                     mode = 'border';
                                                 }else{
                                                     mode = 'image';
                                                 }
                                             }
                                         }
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
                         var canvas = new TextGrid(result);
                         if(item.style){
                             item.text = Ansi.map(item.text, function(chr, codes){
                                 return (item.style?Ansi.codes(chr, item.style):'');
                             });
                         }
                         canvas.drawOnto(item.text, item.x, item.y, item.transparent);
                         result = canvas.toString();
                         done();
                     }, 1);
                    break;
                case 'style':
                    setTimeout(function(){
                        result = Ansi.codes(item.text || result, item.style);
                        done();
                    }, 1);
                    break;
                 case 'font':
                     if(item.font.indexOf('u:') === 0){
                         result = safeCombine(
                             result,
                             utf.font(item.text, item.font.substring(2)),
                             item.style
                         );
                         done();
                     }else{
                         AsciiArt.Font.create(item.text, item.font, function(err, text){
                             result = safeCombine(result, text, item.style);
                             done();
                         });
                     }
                     break;
                 case 'border':
                     var canvas = new TextGrid(result);
                     var styler = item.style?function(s){
                         return AsciiArt.style(s, item.style);
                     }:function(s){ return s };
                     canvas.drawOnto(boxEdge('l', canvas.height, item, styler), 0, 0);
                     canvas.drawOnto(boxEdge('r', canvas.height, item, styler), -1, 0);
                     canvas.drawOnto(boxEdge('t', canvas.width-3, item, styler), 1, 0);
                     canvas.drawOnto(boxEdge('b', canvas.width-3, item, styler), 1, -1);
                     result = canvas.toString();
                     setTimeout(function(){
                         done();
                     }, 0);
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
                    if(item.lineart){
                        image.writeLineArt(function(err, text){
                            if(!err) result = safeCombine(result, text);
                            done();
                        });
                    }else{
                        if(item.posterize){
                            image.writePosterized(function(err, text){
                                if(!err) result = safeCombine(result, text);
                                done();
                            });
                        }else{
                            image.write(function(err, text){
                                if(!err) result = safeCombine(result, text);
                                done();
                            });
                        }
                    }
                    break;
                 case 'graph':
                     AsciiArt.Graph.create(item, function(err, text){
                         if(!err) result = safeCombine(result, text);
                         done();
                     });
                     break;

             }
        }
        this.font = function(str, fontName, style, callback){
            if(arguments.length == 1 && typeof str === 'object'){
                chain.push(str);
            }else{
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
            }
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
        this.border = function(options, callback){
            if(callback) cb = callback;
            chain.push({
                options : options,
            });
            check();
            return ob;
        };
        this.graph = function(options, callback){
            if(callback) cb = callback;
            options.graph = true;
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
        this.style = function(text, styles, callback){
            return Ansi.codes(text, styles);
            var opts = {};
            if((typeof styles == 'function' || !styles) && !callback){
                callback = styles;
                opts = text;
            }else{
                opts.text = text;
                opts.style = style;
            }
            if(callback) cb = callback;
            chain.push(opts);
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
        };
        this.toPromise = function(){
            return new Promise(function(resolve, reject){
                cb = function(err, result){
                    if(err) return reject(err);
                    resolve(result);
                }
                check();
            });
        };//*/
        this.then = function(handler){
            var promise = new Promise(function(resolve, reject){
                cb = function(err, result){
                    if(err) return reject(err);
                    resolve(result);
                }
                check();
            });
            return promise.then(handler);
        };
        return this;
    };

    AsciiArt.Font.newReturnContext = function(options){
        var chain = fontChain.apply({});
        return chain.font(options);
    }
    AsciiArt.font = function(str, font, callback){
        if(font.indexOf('u:') === 0){
            var result =  utf.font(str, font.substring(2));
            if(callback){
                setTimeout(function(){
                    callback(undefined, result);
                }, 0);
                //todo: support promise returns here!
                return result;
            }
        }else return AsciiArt.Font.create(str, font, callback);
    }
    AsciiArt.style = function(text, styles){
        return Ansi.codes(text, styles);
    }
    AsciiArt.Image.newReturnContext = function(options){
        var chain = fontChain.apply({});
        return chain.image(options);
    }
    AsciiArt.image = function(options, callback){
        return AsciiArt.Image.create(options, callback);
    }
    AsciiArt.Table.newReturnContext = function(options){
        var chain = fontChain.apply({});
        return chain.table(options);
    }
    AsciiArt.table = function(options, callback){
        return AsciiArt.Table.create(options, callback);
    }
    AsciiArt.Graph.newReturnContext = function(options){
        var chain = fontChain.apply({});
        return chain.font(options);
    }
    AsciiArt.graph = function(options, callback){
        return AsciiArt.Graph.create(options, callback);
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
    return AsciiArt;
}));
