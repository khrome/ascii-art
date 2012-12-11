var should = require("should");
var art = require('./ascii-art');

describe('AsciiArt', function(){
    describe('can render', function(){
        
        var text = 'blargh';
        
        it('ANSI codes', function(){
            var rendered = art.ansiCodes(text, 'red+blink+inverse');
            rendered.should.not.equal(text); //make sure string has been altered
        });
        
        it('Figlet font', function(done){
            art.font(text, 'Doom', function(rendered){
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
    });
});