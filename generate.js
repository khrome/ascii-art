#!/usr/bin/env node
var art = require('./art');
var difference = require('color-difference');
var arrays = require('async-arrays');
var fs = require('fs');

function moreAccurateColor(r1, g1, b1, r2, g2, b2){
	return difference.compare(
		'#'+r1.toString(16)+g1.toString(16)+b1.toString(16),
		'#'+r2.toString(16)+g2.toString(16)+b2.toString(16)
	);
}

art.Font.fontPath = './Fonts/';

var needsAccurateColor = [
	'./node_modules/ascii-art-docs/Images/sewer-grate.jpg',
	'./node_modules/ascii-art-docs/Images/max-headroom.jpg',
	'./node_modules/ascii-art-docs/Images/truth.png',
	'./node_modules/ascii-art-docs/Images/rene-cigler.jpg',
	'./node_modules/ascii-art-docs/Images/tony_harrison.jpg'
];
var alternateAlphabets = {
	'./node_modules/ascii-art-docs/Images/gir.gif':'binary',
	'./node_modules/ascii-art-docs/Images/cernettes.jpg':'variant1',
	'./node_modules/ascii-art-docs/Images/gob.jpg':'variant2',
	'./node_modules/ascii-art-docs/Images/beyonce-upgrade.jpg':'variant3',
	'./node_modules/ascii-art-docs/Images/metropolis.jpg':'variant4',
	'./node_modules/ascii-art-docs/Images/grendel.jpg':'blocks',
	'./node_modules/ascii-art-docs/Images/zero-cool.jpg':'greyscale'
};
var result = [];
var images = fs.readdirSync('./node_modules/ascii-art-docs/Images');
images = images.filter(function(image){
	return image[0] !== '.';
}).map(function(image){
	return './node_modules/ascii-art-docs/Images/'+image;
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
		art.font(label, 'Doom', function(rendered){
			result[key] += art.style(rendered, 'white');
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
	/*art.image({
		width : 40,
		filepath : './node_modules/ascii-art-docs/Images/initech.png',
		alphabet : 'wide'
	}).font('INITECH', 'Doom', 'cyan', function(err, rendered){
		if(process.argv[2] === 'save'){
			fs.writeFile('./test/images/mixed.nfo', rendered, function(){

			});
			count++;
		}
		if(process.argv[2] === 'save') console.log(count+' files saved.');
		else console.log(rendered);
	});*/
});
