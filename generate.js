var art = require('./ascii-art');
var difference = require('color-difference');
var arrays = require('async-arrays');
var fs = require('fs');

function moreAccurateColor(r1, g1, b1, r2, g2, b2){
	return difference.compare(
		'#'+r1.toString(16)+g1.toString(16)+b1.toString(16),
		'#'+r2.toString(16)+g2.toString(16)+b2.toString(16)
	);
}

art.Figlet.fontPath = './Fonts/';

var needsAccurateColor = [
	'./Images/sewer-grate.jpg',
	'./Images/max-headroom.jpg',
	'./Images/truth.png',
	'./Images/rene-cigler.jpg',
	'./Images/tony_harrison.jpg'
];
var alternateAlphabets = {
	'./Images/gir.gif':'binary',
	'./Images/cernettes.jpg':'variant1',
	'./Images/gob.jpg':'variant2',
	'./Images/beyonce-upgrade.jpg':'variant3',
	'./Images/metropolis.jpg':'variant4',
	'./Images/grendel.jpg':'blocks',
	'./Images/zero-cool.jpg':'greyscale'
};
var result = [];
var images = fs.readdirSync('./Images');
images = images.filter(function(image){
	return image[0] !== '.';
}).map(function(image){
	return './Images/'+image;
});
var count = 0;
arrays.forAllEmissions(images, function(item, key, done){
	var options = { filepath: item };
	if(needsAccurateColor.indexOf(item) !== -1) options.distance = moreAccurateColor;
	if(alternateAlphabets[item]) options.alphabet = alternateAlphabets[item];
	var image = new art.Image(options);
	var file = options.filepath.split('/').pop();
	var pos = file.indexOf('.');
	var name = (pos===-1?file:file.substring(0, pos));
	var label = name.replace(/[_-]+/g, ' ').split(' ').map(function(str){
		return str[0].toUpperCase()+str.substring(1);
	}).join("        ");
	var complete = done;
	image.write(function(err, ascii){
		if(err) console.log(err);
		result[key] = ascii;
		art.font(label, 'Doom', 'white', function(rendered){
			result[key] += rendered;
			if(process.argv[2] === 'save'){
				fs.writeFile('./test/images/'+name+'.nfo', ascii, function(err){
					count++;
					complete();
				});
			}else{
				complete();
			}
		});
	});
}, function(){
	if(process.argv[2] !== 'save') console.log(result.join("\n"));
	art.image({
		width : 40,
		filepath : './Images/initech.png',
		alphabet : 'wide'
	}).font('INITECH', 'Doom', 'cyan', function(rendered){
		if(process.argv[2] === 'save'){
			fs.writeFile('./test/images/mixed.nfo', rendered);
			count++;
		}
		if(process.argv[2] === 'save') console.log(count+' files saved.');
		else console.log(rendered);
	});
});