
Compositing functions
---------------------

The functions only exist on the chain and not on the root (`art.x().overlay()` not `art.overlay()`).

#### .overlay(overlain, options[, callback]);

Inset the passed ascii graphic onto the existing buffer

#### .lines(start, stop[, callback]);

subset the lines of the buffer

#### .join(text[, callback]);

attach the given multi-line text to the current buffer at it's end.

Examples
--------

`ascii-art` allows you to construct complex ASCII/ANSI compositions easily.

Let's say you want to impress your friends with oblique references to sci-fi but also address the challenges humanity faces in regards to the environment, but to do it with a glib comedic wit. I might try something like:

	art.artwork({
		artwork:'textfiles.com/art/st-char.asc'
	}).lines(31, 45, function(rendered){
		//cleanup non-unix terminators
		rendered = rendered.replace(/\r/g, '');
		rendered = colorInBonesShirt(rendered);
		art.image({
			filepath :'~/Images/earth_in_space.jpg',
			alphabet : 'ultra-wide'
		}).overlay(rendered, {
			x: 0,
			y: -1,
			style: 'red+blink',
			transparent: '&'
		}, function(final){
			console.log(final);
		});
	});

to get:

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/bones_earth.png)

Or maybe I've got A BBS wall I want to have some dynamic info on.. I could make that with:

	art.font('Ghost Wire BBS', 'Doom', function(logo){
	    art.font('No place like home', 'rusted', function(subtext){
	        art.table({
	            verticalBar : ' ',
	            horizontalBar : ' ',
	            intersection : ' ',
	            data:[
	                {name: art.style('current users', 'red'), value: '203'},
	                {name: 'operator', value: 'vince.vega'},
	                {name: 'dial-in', value: '(917)555-4202'},
	            ]
	        }).lines(2, function(table){
	            art.image({
	                filepath :'~/Images/starburst_red.jpg',
	                alphabet : 'ultra-wide'
	            }).lines(2, 30).overlay(logo, {
	                x: 0,
	                y: 0,
	                style: 'blue',
	            }).overlay(subtext, {
	                x: 19,
	                y: 8,
	                style: 'yellow',
	            }).overlay(table, {
	                x: -1,
	                y: -1,
	                style: 'green',
	            }, function(final){
	                console.log(final);
	            });
	        });
	    });
	});

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/ghostwire.png)


Sometimes we have to create a splash for an intranet app:

    art.image({
    	width : 40,
    	filepath : parentDir+'/Images/initech.png',
    	alphabet : 'wide'
    }).font('INITECH', 'Doom', 'cyan', function(ascii){
		console.log(ascii);
    });

Which produces (from [this](Images/initech.png) and [this](Fonts/Doom.flf)):

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/initech.png)

I used to have an apartment in Savannah in the mid 90s where a young artist slapped a (now well known) sticker on the door. I came home to see this sticker everyday for quite a while, so it became an old friend. But when you digitize an image, the text becomes unreadable... so to recreate that image in ascii would take a bunch of tedious hand work, so what would it take to regenerate that?

	art.table({
	    data:[
	        {text: '    .\'ANDRE.    '},
	        {text: '   ..THE.GIANT\'.  '},
	        {text: '.With.Bobby."The.Brain"'},
	        {text: '.Heenan.'}
	    ],
	    verticalBar : ' ',
	    horizontalBar : ' ',
	    intersection : ' '
	}).lines(2, function(table){
	    art.strings([
	        'ANDRE',
	        'the',
	        'GIANT',
	        'POSSE',
	        '7\'4"',
	        '520 LB'
	    ], 'rusted', function(andre, the, giant, posse, height, weight){
	        art.strings([ 'has', 'a'], 'twopoint', function(has, a){
	            art.image({
	                filepath :'/Images/andre_has_a_posse.jpeg',
	                alphabet : 'ultra-wide'
	            }).overlay(andre, {
	                x: 8, y: 4,
	                style: 'white'
	            }).overlay(the, {
	                x: 10, y: 7,
	                style: 'white',
	                transparent : true
	            }).overlay(giant, {
	                x: 8, y: 10,
	                style: 'white',
	                transparent : true
	            }).overlay(has, {
	                x: 10, y: 14,
	                style: 'white'
	            }).overlay(a, {
	                x: 13, y: 17,
	                style: 'white'
	            }).overlay(posse, {
	                x: 5, y: 20,
	                style: 'bright_black',
	                transparent: true
	            }).overlay(height, {
	                x: 59, y: 3,
	                style: 'bright_black',
	                transparent: true
	            }).overlay(weight, {
	                x: 59, y: 8,
	                style: 'bright_black',
	                transparent: true
	            }).overlay(table, {
	                x: 6, y: -6,
	                style: 'bright_black',
	                transparent: true
	            }, function(final){
	                console.log(final);
	            });
	        });
	    });
	});

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/andre.png)

Now I can put it on any portal I like!
