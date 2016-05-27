var should = require("should");
var art = require('../ascii-art');
//art.fontPath 
var difference = require('color-difference');
var fs = require('fs');

function testImage(options, callback, complete){
	var image = new art.Image(options);
	var file = options.filepath.split('/').pop().split('.');
	file.pop();
	file = '/images/'+file.join('.')+'.nfo';
	var result = fs.readFileSync(__dirname+file).toString();
	image.write(function(err, ascii){
		callback(err, ascii, result, complete);
	});
}

function imageIsValid(err, ascii, expected, done){
	if(err) console.log(err.stack);
	should.exist(ascii);
	should.exist(expected);
	ascii.should.equal(expected);
	done();
}

var parentDir = __dirname.split('/');
parentDir.pop();
parentDir = parentDir.join('/');

//*
describe('AsciiArt', function(){
    describe('can render', function(){
        
        var text = 'blargh';
        
        it('ANSI codes', function(){
            var rendered = art.ansiCodes(text, 'red+blink+inverse');
            rendered.should.not.equal(text); //make sure string has been altered
        });
        
        it('a Figlet font', function(done){
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
        
        it('mixed expression', function(done){
	        this.timeout(10000);
	        var expected = fs.readFileSync(__dirname+'/images/mixed.nfo').toString();
            art.image({
	            width : 40,
	            filepath : parentDir+'/Images/initech.png',
	            alphabet : 'wide'
            }).font('INITECH', 'Doom', 'cyan', function(ascii){
                should.exist(ascii);
				should.exist(expected);
				ascii.should.equal(expected);
                done();
            });
        });
        
        describe('an Image with', function(){
	        
	        describe('the "average" renderer and ', function(){
	        
				it('is a JPEG with default settings', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/mucha-job.jpg'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in variant1', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/cernettes.jpg',
						alphabet:'variant1'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in variant2', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/gob.jpg',
						alphabet:'variant2'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in variant3', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/beyonce-upgrade.jpg',
						alphabet:'variant3'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in variant4', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/metropolis.jpg',
						alphabet:'variant4'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in blocks', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/grendel.jpg',
						alphabet:'blocks'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in greyscale', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/zero-cool.jpg',
						alphabet:'greyscale'
					}, imageIsValid, done);
				});
				
				it('is a GIF drawn in binary', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/gir.gif',
						alphabet:'binary'
					}, imageIsValid, done);
				});
				
				it('is a PNG drawn with defaults', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/seven-proxies.png'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn with defaults', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/peewee.jpeg'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn with defaults', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/animal_muppet.jpg'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn with defaults', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/serious-business.jpg'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn in greyscale', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/zero-cool.jpg',
						alphabet:'greyscale'
					}, imageIsValid, done);
				});
				
				it('is a JPEG drawn with a custom difference algorithm', function(done){
					this.timeout(5000);
					testImage({
						filepath: parentDir+'/Images/rene-cigler.jpg',
						distance: function(r1, g1, b1, r2, g2, b2){
							return difference.compare(
								'#'+r1.toString(16)+g1.toString(16)+b1.toString(16),
								'#'+r2.toString(16)+g2.toString(16)+b2.toString(16)
							);
						}
					}, imageIsValid, done);
				});
			});
        });
    });
});
//*/