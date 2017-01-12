(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define([], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory();
    }else{
        // Browser globals (root is window)
        root.AsciiArtImage = factory();
    }
}(this, function(){
    var AsciiArt = {};
    var parentArt;

    function columnStatistics(columns, data){
        var result = {};
        columns.forEach(function(column){
            var stats = {
                total : 0,
                count : 0
            };
            data.forEach(function(item){
                var str = (item[column.value]||'')+'';
                stats.count++;
                stats.total += str.length;
                if((!stats.max) || str.length > stats.max){
                    stats.max = str.length;
                }
                if((!stats.min) || str.length < stats.min){
                    stats.min = str.length;
                }
                stats.average = Math.floor(stats.total/stats.count);
            })
            result[column.value] = stats;
        });
        return result;
    }

    function columnSizes(width, stats, obj){
        var sizes = [];
        var keys = Object.keys(stats);
        var remainingWidth = width - (keys.length+1);
        var ob = obj;
        keys.forEach(function(key, index){
            var column = stats[key];
            if(ob.headers[index].autosize){
                sizes[index] = undefined;
            }else{
                sizes[index] = column.max;
            }
        });
        var idealWidth = sizes.reduce(sum);
        //console.log(sizes, this.headers);
        if(idealWidth > remainingWidth){
            //try to convert column by column to average width until you've
            // tried them all (go backwards (assuming order of importance))
            (function(){
                try{
                    var sizeCache = sizes;
                    for(var lcv = sizes.length-1; lcv >= 0; lcv--){
                        sizes[lcv] = stats[ob.headers[lcv].value].average;
                        var width = sizes.reduce(sum);
                        //console.log(''+lcv, sizes, width);
                        if(width <= remainingWidth){
                            var rem = remainingWidth - width;
                            sizes[lcv] += rem;
                            //console.log(''+lcv, sizes, width);
                            return;
                        };
                    }
                    sizes = sizeCache;
                    throw new Error();
                }catch(err){
                    for(var lcv = sizes.length-1; lcv >= 0; lcv--){
                        sizes[lcv] = stats[ob.headers[lcv].value].min;
                        var width = sizes.reduce(sum);
                        //console.log(''+lcv, sizes, width);
                        if(width <= remainingWidth){
                            var rem = remainingWidth - width;
                            sizes[lcv] += rem;
                            //console.log(''+lcv, sizes, width);
                            return;
                        };
                    }
                }
            })();
        }
        return sizes;
    }

    function sum(a, b){
        return a + b;
    }

    function ansiAwareLength(value){
        var lcv = 0;
        var inEscape = false;
        var count = 0;
        while(value && lcv < value.length){
            if(inEscape){
                if(value[lcv] == 'm') inEscape = false;
            }else{
                if(value[lcv] == '\033' && value[lcv+1] == '['){
                    inEscape = true;
                    lcv++;
                }else{
                    count++;
                }
            }
            lcv++;
        }
        return count;
    }

    function ansiAwareTrimTo(value, length){
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
    }

    var defaultChar = ' ';

    function padRTo(text, width, padChar) {
        padChar = padChar || defaultChar;
        text = text + '';
        return text.length >= width ?
            text :
            padR(text, width - text.length, padChar);
    }

    function padLTo(text, width, padChar) {
        padChar = padChar || defaultChar;
        text = text + '';
        return text.length >= width ?
            text :
            padL(text, width - text.length, padChar);
    }

    function padR(text, amount, padChar) {
        padChar = padChar || defaultChar;
        text = text + '';
        return text + new Array(amount + 1).join(padChar);
    }

    function padL(text, amount, padChar) {
        padChar = padChar || defaultChar;
        text = text + '';
        return new Array(amount + 1).join(padChar) + text;
    }

    function bgFromStyle(style){
        var matches = style && style.match(/([a-z_]+)_bg/g );
        return backgroundColor = matches && matches
        .map(function(name){
            return name.substring(0, name.length-3);
        })[0];
    }

    AsciiArt.Table = function(options){
        this.options = options || {};
        if(!this.options.verticalBar) this.options.verticalBar = '|';
        if(!this.options.horizontalBar) this.options.horizontalBar = '-';
        if(!this.options.intersection) this.options.intersection = '+';
        this.headers = [];
        this.data = [];
    };

    AsciiArt.Table.prototype.write = function(width){
        var stats = columnStatistics(this.headers, this.data);
        var sizes = columnSizes(width, stats, this);
        var ob = this;
        //RENDER!!!
        var result = '';
        var horizontalRule = function(styleHandler){
            var lastStyle;
            ob.headers.forEach(function(header, index){
                var line = ob.options.intersection + padRTo(
                    '', sizes[index], ob.options.horizontalBar
                );
                if(styleHandler){
                    styleHandler(header, index, function(style){
                        if(style){
                            line = parentArt.style(line, style, true);
                        }
                        lastStyle = style;
                    });
                }
                result += line;
            });
            result += (lastStyle?
                parentArt.style(ob.options.intersection, lastStyle, true):
                ob.options.intersection);
            styleHandler(
                ob.headers[ob.headers.length-1],
                ob.headers.length-1,
                function(style){
                    var backgroundColor = bgFromStyle(style);
                    if(style){
                        if(ob.options.intersection.trim()){
                            result += parentArt.style(ob.options.intersection, style, true);
                        }else{
                            result += parentArt.style('X', style+'+'+backgroundColor, true);
                        }
                    }else{
                        result += ob.options.intersection
                    }
                }
            );
            result += "\n";
        }

        var horizontalRuleStylerMaker = function(styleGetter){
            return function(column, index, setStyle){
                var style = styleGetter(column, index);
                var backgroundColor = bgFromStyle(style);
                if(backgroundColor) setStyle(backgroundColor+'_bg');
            }
        }
        if(ob.options.drawRules !== false){
            horizontalRule(horizontalRuleStylerMaker(function(header, i, row){
                return (header && (
                    header.headerStyle ||
                    ob.options.headerStyle ||
                    header.style
                ));
            }));
        }
        var lastBG;
        ob.headers.forEach(function(header, index){
            var line = ob.options.verticalBar;
            var value = header.label;
            var backgroundColor;
            var style = header.headerStyle ||
                ob.options.headerStyle ||
                header.style;
            if(style){
                backgroundColor = bgFromStyle(style);
                value = parentArt.style(value, style, true);
                if(backgroundColor)
                    line = parentArt.style(line, backgroundColor+'_bg', true);
            }
            var length = ansiAwareLength(value);
            if(length > sizes[index]){
                line += ansiAwareTrimTo(value, sizes[index]);
            }else{
                line += padR(
                    value,
                    sizes[index] - length,
                    backgroundColor?parentArt.style(
                        'X', style+'+'+backgroundColor, true
                    ):' '
                );
            }
            result += line;
            lastBG = backgroundColor;
        });
        if(!lastBG){
            result += ob.options.verticalBar+"\n";
        }else{
            result += parentArt.style(
                ob.options.verticalBar+"\n", lastBG+'_bg', true
            )
        }
        if(ob.options.drawRules !== false){
            horizontalRule(horizontalRuleStylerMaker(function(header, i, row){
                return (header && (
                    header.headerStyle ||
                    ob.options.headerStyle ||
                    header.style
                ));
            }));
        }
        ob.data.forEach(function(item){
            ob.headers.forEach(function(header, index){
                var line = ob.options.verticalBar;
                var value = item[header.value] || '';
                var backgroundColor;
                if(header.style){
                    backgroundColor = bgFromStyle(header.style);
                    value = parentArt.style(value, header.style, true);
                    if(backgroundColor)
                        line = parentArt.style(line, backgroundColor+'_bg', true);
                }
                var length = ansiAwareLength(value);
                if(length > sizes[index]){
                    line += ansiAwareTrimTo(value, sizes[index]);
                }else{
                    line += padR(
                        value,
                        sizes[index] - length,
                        backgroundColor?parentArt.style(
                            'X', header.style+'+'+backgroundColor, true
                        ):' '
                    );
                }
                result += line;
            });
            result += ob.options.verticalBar+"\n";
        });
        if(ob.options.drawRules !== false){
            horizontalRule(horizontalRuleStylerMaker(function(header, i, row){
                return (header && header.style);
            }));
        }
        return result;
    }

    AsciiArt.Table.prototype.toString = function(){
        return this.write(80);
    }

    AsciiArt.Table.prototype.setHeading = function(){
        var headers = Array.prototype.slice.apply(arguments);
        var ob = this;
        headers.forEach(function(header){
            ob.addColumn(header);
        });
    }

    AsciiArt.Table.prototype.addRow = function(){
        var values = Array.prototype.slice.apply(arguments);
        var ob = this;
        var row = {};
        values.forEach(function(value, index){
            row[ob.headers[index].value] = value;
        });
        this.add(row);
    }

    AsciiArt.Table.prototype.add = function(item){
        this.data.push(item);
    }

    AsciiArt.Table.prototype.addColumn = function(options){
        if(typeof options == 'string') options = {
            value : options,
            label : options,
        };
        if(options.value && !options.label) options.label = options.value;
        this.headers.push(options);
    }

    AsciiArt.Table.setInstance = function(art){
        parentArt = art;
    }

    return AsciiArt;
}));
