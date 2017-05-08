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

    function columnStatistics(columns, data, includeColumns){
        var result = {};
        columns.forEach(function(column){
            var stats = {
                total : 0,
                count : 0
            };
            if(includeColumns && column.label){
                stats.max = column.label.length;
            }
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
        if(idealWidth > remainingWidth){
            //try to convert column by column to average width until you've
            // tried them all (go backwards (assuming order of importance))
            (function(){
                try{
                    var sizeCache = sizes;
                    for(var lcv = sizes.length-1; lcv >= 0; lcv--){
                        sizes[lcv] = stats[ob.headers[lcv].value].average;
                        var width = sizes.reduce(sum);
                        if(width <= remainingWidth){
                            var rem = remainingWidth - width;
                            sizes[lcv] += rem;
                            return;
                        };
                    }
                    sizes = sizeCache;
                    throw new Error();
                }catch(err){
                    for(var lcv = sizes.length-1; lcv >= 0; lcv--){
                        sizes[lcv] = stats[ob.headers[lcv].value].min;
                        var width = sizes.reduce(sum);
                        if(width <= remainingWidth){
                            var rem = remainingWidth - width;
                            sizes[lcv] += rem;
                            return;
                        };
                    }
                }
            })();
        }
        if(ob.options.justify && idealWidth < remainingWidth){
            var diff = remainingWidth - idealWidth;
            var increment = diff / sizes.length;
            var rem = diff % sizes.length;
            sizes = sizes.map(function(size){
                return size + increment;
            });
            //todo: what's right?
            sizes[sizes.length-1] += rem;
        }
        return sizes;
    }

    function sum(a, b){
        return a + b;
    }

    var ansiAwareLength = function(value){
        return parentArt.Ansi.length(value);
    }

    var ansiAwareTrimTo = function(value, length){
        return parentArt.Ansi.trimTo(value, length);
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
        var ob = this;
        if(this.options.bars){
            if(this.options.bars === true) this.options.bars = 'single';
            if(typeof this.options.bars == 'string') switch(this.options.bars){
                case 'single':
                    this.options.bars = {
                        'ul_corner' : '┏',
                        'ur_corner' : '┓',
                        'lr_corner' : '┛',
                        'll_corner' : '┗',
                        'bottom_t' : '┻',
                        'top_t' : '┳',
                        'right_t' : '┫',
                        'left_t' : '┣',
                        'intersection' : '╋',
                        'vertical' : '┃',
                        'horizontal' : '━',
                    };
                    break;
                case 'double':
                    this.options.bars = {
                        'ul_corner' : '╔',
                        'ur_corner' : '╗',
                        'lr_corner' : '╝',
                        'll_corner' : '╚',
                        'bottom_t' : '╩',
                        'top_t' : '╦',
                        'right_t' : '╣',
                        'left_t' : '╠',
                        'intersection' : '╬',
                        'vertical' : '║',
                        'horizontal' : '═',
                    };
                    break;
                case 'block':
                    this.options.bars = {
                        'ul_corner' : '█',
                        'ur_corner' : '█',
                        'lr_corner' : '█',
                        'll_corner' : '█',
                        'bottom_t' : '█',
                        'top_t' : '█',
                        'right_t' : '█',
                        'left_t' : '█',
                        'intersection' : '█',
                        'vertical' : '█',
                        'horizontal' : '█',
                    };
                    break;
                case 'angles':
                    this.options.bars = {
                        'ul_corner' : '◤',
                        'ur_corner' : '◥',
                        'lr_corner' : '◢',
                        'll_corner' : '◣',
                        'bottom_t' : '▲',
                        'top_t' : '▼',
                        'right_t' : '◀',
                        'left_t' : '▶',
                        'intersection' : '◆',
                        'vertical' : ' ',
                        'horizontal' : ' ',
                    };
                    break;
            }
            var bars = this.options.bars;
            this.getBoundaryChar = function(t, l, b, r){
                if(t && l && b && r) return bars.intersection;
                //Ts
                if(t && l && b) return bars.right_t;
                if(t && l && r) return bars.bottom_t;
                if(t && b && r) return bars.left_t;
                if(l && b && r) return bars.top_t;

                //Corners
                if(l && b) return bars.ur_corner;
                if(t && l) return bars.lr_corner;
                if(t && r) return bars.ll_corner;
                if(b && r) return bars.ul_corner;

                //Straights
                if(l && r) return bars.horizontal;
                if(t && b) return bars.vertical;
            }
        }else{
            if(!this.options.verticalBar) this.options.verticalBar = '|';
            if(!this.options.horizontalBar) this.options.horizontalBar = '-';
            if(!this.options.intersection) this.options.intersection = '+';
            this.getBoundaryChar = function(t, l, b, r){
                var isVert = (t || b);
                var isHoriz = (l || r);
                if(isVert && isHoriz){
                    return ob.options.intersection;
                }else{
                    if(isVert) return ob.options.verticalBar;
                    if(isHoriz) return ob.options.horizontalBar;
                }
            }
        }
        this.headers = [];
        this.data = [];
    };

    AsciiArt.Table.prototype.write = function(width){
        var stats = columnStatistics(this.headers, this.data, this.options.includeHeader);
        var sizes = columnSizes(width, stats, this);
        var ob = this;
        //RENDER!!!
        var result = '';
        var y = true;
        var n = false;
        var fillerChar = '%';
        var horizontalRule = function(styleHandler, top, bottom){
            var rule = '';
            var t = !top;
            var b = !bottom;
            ob.headers.forEach(function(header, index){
                var f = index !== 0?true:false;
                var c = ob.getBoundaryChar(t, f, b, y);
                if(ob.options.borderColor) c = parentArt.style(
                    c, ob.options.borderColor, false
                );
                var line = c + padRTo(
                    '', sizes[index], ob.getBoundaryChar(n, y, n, y)
                );
                if(styleHandler){
                    styleHandler(header, index, function(style){
                        if(style){
                            line = parentArt.style(line, style, true);
                        }
                    });
                }
                rule += line;
            });
            var chr = ob.getBoundaryChar(t, y, b, n);
            if(ob.options.borderColor) chr = parentArt.style(
                chr, ob.options.borderColor, true
            );
            var pos = ob.headers.length-1;
            if(styleHandler){
                styleHandler(ob.headers[pos], pos, function(style){
                    var backgroundColor = bgFromStyle(style);
                    if(style){
                        var s = style;
                        var c = chr;
                        if(backgroundColor && !c.trim()){
                            c = 'X';
                            s = style+'+'+backgroundColor
                        }
                        rule += parentArt.style(c, s, true);
                    }else{
                        rule += chr;
                    }
                });
            }else{
                rule += chr;
            }
            rule += "\n";
            return rule;
        }

        var horizontalRuleStylerMaker = function(styleGetter){
            return function(column, index, done){
                var style = styleGetter(column, index);
                var backgroundColor = bgFromStyle(style);
                if(backgroundColor) done(backgroundColor+'_bg');
                else done();
            }
        }
        if(ob.options.drawRules !== false){
            result += horizontalRule(horizontalRuleStylerMaker(function(header, i, row){
                return (header && (
                    header.headerStyle ||
                    ob.options.headerStyle ||
                    header.style
                ));
            }), true);
        }
        var lastBG;
        var vb = ob.getBoundaryChar(y, n, y, n);
        ob.headers.forEach(function(header, index){
            var line = vb;
            if(ob.options.borderColor) line = parentArt.style(
                line, ob.options.borderColor, true
            );
            var value = header.label;
            var backgroundColor;
            var style = header.headerStyle ||
                ob.options.headerStyle ||
                header.style ||
                ob.options.cellStyle;
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
                        '.', style+'+'+backgroundColor, true
                    ):' '
                );
            }
            result += line;
            lastBG = backgroundColor;
        });
        if(!lastBG){
            if(ob.options.borderColor){
                result += parentArt.style(
                    vb, ob.options.borderColor, true
                )+"\n";;
            }else{
                result += vb+"\n";
            }
        }else{
            var c = vb;
            if(ob.options.borderColor) c = parentArt.style(
                c, ob.options.borderColor, true
            );
            result += parentArt.style(c, lastBG+'_bg', true)+"\n";
        }
        if(ob.options.drawRules !== false){
            result += horizontalRule(horizontalRuleStylerMaker(function(header, i, row){
                return (header && (
                    header.headerStyle ||
                    ob.options.headerStyle ||
                    header.style
                ));
            }));
        }
        ob.data.forEach(function(item){
            ob.headers.forEach(function(header, index){
                var style = header.style ||
                    ob.options.dataStyle ||
                    ob.options.cellStyle;
                var line = vb;
                if(ob.options.borderColor) line = parentArt.style(
                    line, ob.options.borderColor, true
                );
                var value = item[header.value] || '';
                var backgroundColor;
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
            });
            if(ob.options.borderColor){
                result += parentArt.style(
                    vb, ob.options.borderColor, true
                )+"\n";
            }else{
                result += vb+"\n";
            }
        });
        if(ob.options.drawRules !== false){
            result += horizontalRule(horizontalRuleStylerMaker(function(header, i, row){
                return (header && header.style);
            }), false, true);
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
