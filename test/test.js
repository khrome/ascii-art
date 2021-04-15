(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            'browser-request', 'ascii-art-ansi/color', 'dirname-shim', '../art', 'color-difference'
        ], function(request, color, shim, a, diff){
            a.Figlet.fontPath = 'Fonts/'
            return factory(a, color, diff, {
                readFile : function(filename, cb){
                    request({
                        url: filename
                    }, function(err, req, data){
                        if(err) return cb(err);
                        else cb(undefined, data);
                    })
                }
            }, should);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../art'), require('ascii-art-ansi/color'), require('color-difference'), require('fs'), require('chai').should());
    } else {
        throw new Error('global testing not supported!');
    }
}(this, function (art, Color, difference, fs, should) {
    var isNode = typeof module === 'object' && module.exports;

    function testImage(options, callback, complete){
        var image = new art.Image(options);
        var file = options.filepath.split('/').pop().split('.');
        file.pop();
        file = '/images/'+file.join('.')+'.nfo';
        fs.readFile(__dirname+file, function(err, result){
            image.write(function(err, ascii){
                callback(err, ascii, result&&result.toString(), complete, image);
            });
        });
    }

    function testGraph(name, text, cb){
        var simple = fs.readFile(
            __dirname+'/../node_modules/ascii-art-graph/test/data/'+name,
            function(err, result){
                should.not.exist(err);
                text.should.equal(result.toString());
                cb();
            }
        );
    }

    function imageIsValid(err, ascii, expected, done){
        if(err) console.log(err.stack);
        should.exist(ascii);
        should.exist(expected);
        var asciiLines = ascii.split("\n")
        var expectedLines = expected.split("\n");
        asciiLines.length.should.equal(expectedLines.length);
        //TODO: recapture final values once color fn stabilizes
        /*
        asciiLines.forEach(function(line, index){
            asciiLines[index].length.should(expectedLines[index].length);
        }); //*/
        //if(isNode) ascii.should.equal(expected);
        done();
    }

    function longestLineLength(str){
        return str.split("\n").map(function(str){
            return str.length || 0
        }).reduce(function(a, b){
            return Math.max(a, b)
        })
    }

    var parentDir = __dirname.split('/');
    parentDir.pop();
    //if(! (typeof module === 'object' && module.exports)) parentDir.pop();
    parentDir = parentDir.join('/');
    parentDir = parentDir+'/node_modules/ascii-art-docs';

    var timeseriesA = [
      { value: 2, date: '2019-11-25T01:55:45.000Z' },
      { value: 5, date: '2019-11-25T01:56:45.000Z' },
      { value: 3, date: '2019-11-25T01:58:45.000Z' },
      { value: 11, date: '2019-11-25T01:59:45.000Z' }
    ];

    //*
    describe('AsciiArt', function(){
        describe.skip('supports legacy features', function(){
            it('returns a promise', function(done){
                var promise = art.font('blargh', 'Doom').toPromise().then(function(rendered){
                    var sample =
                    " _      _                      _     "+"\n"+
                    "| |    | |                    | |    "+"\n"+
                    "| |__  | |  __ _  _ __   __ _ | |__  "+"\n"+
                    "| '_ \\ | | / _` || '__| / _` || '_ \\ "+"\n"+
                    "| |_) || || (_| || |   | (_| || | | |"+"\n"+
                    "|_.__/ |_| \\__,_||_|    \\__, ||_| |_|"+"\n"+
                    "                         __/ |       "+"\n"+
                    "                        |___/        "+"\n";
                    rendered.should.equal(sample);
                    done();
                }).catch(function(err){
                    should.not.exist(err);
                });
            });

        });
        describe('can render', function(){

            var text = 'blargh';

            it('ANSI codes', function(){
                var rendered = art.Ansi.Codes(text, 'red+blink+inverse');
                rendered.should.not.equal(text); //make sure string has been altered
            });

            it('emulates a promise', function(done){
                art.font(text, 'Doom').then(function(rendered){
                    var sample =
                    " _      _                      _     "+"\n"+
                    "| |    | |                    | |    "+"\n"+
                    "| |__  | |  __ _  _ __   __ _ | |__  "+"\n"+
                    "| '_ \\ | | / _` || '__| / _` || '_ \\ "+"\n"+
                    "| |_) || || (_| || |   | (_| || | | |"+"\n"+
                    "|_.__/ |_| \\__,_||_|    \\__, ||_| |_|"+"\n"+
                    "                         __/ |       "+"\n"+
                    "                        |___/        "+"\n";
                    rendered.should.equal(sample);
                    done();
                }).catch(function(err){
                    should.not.exist(err);
                });
            });

            it('a UTF font', function(done){
                var immediate = art.font('BLARGH', 'u:sansserif', function(err, rendered){
                    rendered.should.equal('𝖡𝖫𝖠𝖱𝖦𝖧');
                    done();
                });
                immediate.should.equal('𝖡𝖫𝖠𝖱𝖦𝖧');
            });

            it('a Figlet font', function(done){
                art.font(text, 'Doom', function(err, rendered){
                    var sample =
                    " _      _                      _     "+"\n"+
                    "| |    | |                    | |    "+"\n"+
                    "| |__  | |  __ _  _ __   __ _ | |__  "+"\n"+
                    "| '_ \\ | | / _` || '__| / _` || '_ \\ "+"\n"+
                    "| |_) || || (_| || |   | (_| || | | |"+"\n"+
                    "|_.__/ |_| \\__,_||_|    \\__, ||_| |_|"+"\n"+
                    "                         __/ |       "+"\n"+
                    "                        |___/        "+"\n";
                    rendered.should.equal(sample);
                    done();
                });
            });

            it.skip('mixed expression', function(done){
                this.timeout(10000);
                var match = function(a, b){
                    a = a.split('');
                    b = b.split('');
                    var result = '';
                    a.forEach(function(charA, index){
                        if(charA === b[index]) result += ' ';
                        else result += charA;
                    });
                    return result;
                };
                var file = (isNode?__dirname:'base/test')+'/images/mixed.nfo';
                fs.readFile(__dirname+'/images/mixed.nfo', function(err, result){
                    var expected = result.toString();
                    Color.useDistance('closestByIntensity');
                    art.image({
                        width : 40,
                        filepath : parentDir+'/Images/initech.png',
                        invertValue : true,
                        alphabet : 'wide',
                    }).font('INITECH', 'Doom', 'cyan', function(err, ascii){
                        should.exist(ascii);
                        should.exist(expected);
                        var asciiLines = ascii.split("\n")
                        var expectedLines = expected.split("\n");
                        asciiLines.length.should.equal(expectedLines.length);
                        if(isNode) ascii.should.equal(expected);
                        Color.useDistance('classic');
                        done();
                    });
                });
            });

            describe('a table', function(){
                it('with data', function(done){
                    art.table({
                        columns : ['a', 'b', 'c', 'd'],
                        data : [
                            {
                                a : 'a',
                                b : 'b',
                                c : 'c',
                                d : 'd'
                            },{
                                a : 'e',
                                b : 'f',
                                c : 'g',
                                d : 'h'
                            },{
                                a : 'i',
                                b : 'j',
                                c : 'k',
                                d : 'l'
                            },{
                                a : 'm',
                                b : 'n',
                                c : 'o',
                                d : 'p'
                            },{
                                a : 'q',
                                b : 'r',
                                c : 's',
                                d : 't'
                            }
                        ]
                    }, function(rendered){
                        var sample =
                            "+-+-+-+-+"+"\n"+
                            "|a|b|c|d|"+"\n"+
                            "+-+-+-+-+"+"\n"+
                            "|a|b|c|d|"+"\n"+
                            "|e|f|g|h|"+"\n"+
                            "|i|j|k|l|"+"\n"+
                            "|m|n|o|p|"+"\n"+
                            "|q|r|s|t|"+"\n"+
                            "+-+-+-+-+"+"\n";
                        rendered.should.equal(sample);
                        done();
                    });
                });

                it('using headers', function(done){
                    art.table({
                    	width : 80,
                        includeHeader: true,
                    	data : [ {something : '1', another:'2', athird:'2'} ]
                    }, function(rendered){
                        longestLineLength(rendered).should.equal(26);
                        done();
                    });
                });

                it('using headers and justification', function(done){

                    art.table({
                    	width : 80,
                        includeHeader: true,
                        justify: true,
                    	data : [ {something : '1', another:'2', athird:'2'} ]
                    }, function(rendered){
                    	longestLineLength(rendered).should.equal(80);
                        done();
                    });
                });
            });

            describe('a graph', function(){
                it('with data', function(done){
                    art.graph({
                        height : 20,
                        width : 80,
                        node : '@',
                        data : {
                            'timeseriesA': timeseriesA
                        }
                    }, function(rendered){
                        testGraph('simpleLineGraph.json', rendered, function(){
                            done();
                        });
                    });
                });

                it('with braille', function(done){
                    art.graph({
                        height : 20,
                        width : 80,
                        node : '@',
                        renderMethod : 'braille',
                        data : {
                            'timeseriesA': timeseriesA
                        }
                    }, function(rendered){
                        testGraph('simple-braille.ansi', rendered, function(){
                            done();
                        });
                    });
                });
            });

            describe('an Image with', function(){

                describe('the "average" renderer and ', function(){

                    it('is a JPEG with default settings', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/mucha-job.jpg',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG with default settings and render', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/mucha-job.jpg',
                            lineart: true,
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in variant1', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/cernettes.jpg',
                            alphabet:'variant1',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in variant2', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/gob.jpg',
                            alphabet:'variant2',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in variant3', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/beyonce-upgrade.jpg',
                            alphabet:'variant3',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in variant4', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/metropolis.jpg',
                            alphabet:'variant4',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in blocks', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/grendel.jpg',
                            alphabet:'blocks',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in greyscale', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/zero-cool.jpg',
                            alphabet:'greyscale',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a GIF drawn in binary', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/gir.gif',
                            alphabet:'binary',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a PNG drawn with defaults', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/seven-proxies.png',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn with defaults', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/peewee.jpeg',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn with defaults', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/animal_muppet.jpg',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn with defaults', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/serious-business.jpg',
                            width: 80
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in greyscale', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/zero-cool.jpg',
                            width: 80,
                            alphabet:'greyscale'
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn with a custom difference algorithm', function(done){
                        this.timeout(5000);
                        testImage({
                            filepath: parentDir+'/Images/rene-cigler.jpg',
                            width: 80,
                            distance: function(r1, g1, b1, r2, g2, b2){
                                return difference.compare(
                                    '#'+r1.toString(16)+g1.toString(16)+b1.toString(16),
                                    '#'+r2.toString(16)+g2.toString(16)+b2.toString(16)
                                );
                            }
                        }, imageIsValid, done);
                    });

                    it('is a JPEG drawn in variant1 and can strip ansi chars', function(done){
                        this.timeout(5000);
                        art.image({
                            filepath: parentDir+'/Images/cernettes.jpg',
                            alphabet:'variant1',
                            width: 80
                        }).strip({}, function(err, result){
                            //console.log(result);
                            //todo:verify no ansi codes appear
                            done();
                        });
                    });
                });
            });
        });
    });


    return {};
}));
//*/
