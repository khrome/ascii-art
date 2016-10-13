ascii-art.js
===========

Draw images, render fonts and manipulate terminal styles in Node.js & the browser. 100% JS.

Figlet fonts
------------
A slight mod of [Figlet.js](https://github.com/scottgonzalez/figlet-js) which I hope will make it to NPM in pure js form someday, rather than requiring a command line dependency.

Figlet fonts are an ASCII art font standard, widely used for terminal output.

It looks something like this:

    ______                          _ 
    |  _  \                        | |
    | | | |  ___  _ __ ___    ___  | |
    | | | | / _ \| '_ ` _ \  / _ \ | |
    | |/ / |  __/| | | | | || (_) ||_|
    |___/   \___||_| |_| |_| \___/ (_)

To set the directory of the fonts:

    art.Figlet.fontPath = 'Fonts';
        
Then to render some text:

    art.font('my text', 'Doom', function(rendered){
        //do stuff here
    });

Styles
------
ANSI terminals allow us to output style which format the text in the terminal. In order to do this you just need to:

    art.style('my text', 'red+underline');

1. **colors**
Foreground colors for characters are: black, red, green, yellow, blue, magenta, cyan, white and in some terminal environments:  bright_black, bright_red, bright_green, bright_yellow, bright_blue, bright_magenta, bright_cyan, bright_white (These generally default to their non-bright variants on systems without them)
            
2. **background colors**
Background terminal colors available are: black_bg, red_bg, green_bg, yellow_bg, blue_bg, magenta_bg, cyan_bg, white_bg
        
3. **styles**
To style the text you may use: bold, italic, underline, framed, encircled, overline, blink, inverse
        
4. **controls**
Control styles are: off, hidden
    
Images
------
Images require [canvas]() but only optionally upon first reference of `art.Image()` the constructor takes an options argument

- alphabet : requires one of `variant1`, `variant2`, `variant3`, `variant4`, `ultra-wide`, `wide`, `hatching`, `bits`, `binary`, `greyscale`, `blocks`
- filepath(*required*) : the path of the image
- width : # of terminal columns
- height : # of terminal rows
- distance : a function which takes in 6 args (2x rgb) and returns a measure of distance between these two colors

So for example, say we want to generate a copy of a metropolis poster:

![Image Output](http://patternweaver.com/Github/Ascii/docs/metropolis.jpg)

You just need to do something like this:

	var image = new art.Image({
		filepath: '~/Images/metropolis.jpg',
		alphabet:'variant4'
	});
	image.write(function(err, rendered){
		console.log(rendered);
	})

![Image Output](http://patternweaver.com/Github/Ascii/docs/metropolis.png)

Binary
------
You can run ascii-art as a commandline converter:

	ascii-art image -f path/to/my/file.jpg


Chaining
--------

The font method also allows you to optionally pass styles and supports chaining, so if I want something a little more complex I could do something like this:

    art.font('Prompt', 'Basic', 'red').font('v1', 'Doom', 'magenta', function(rendered){
        console.log(rendered);
    });

and that will look like this (in color, of course) and it will totally respect the multiline chars and add in ansi codes per line, so things look how you'd expect:

    d8888b. d8888b.  .d88b.  .88b  d88. d8888b. d888888b         __  
    88  `8D 88  `8D .8P  Y8. 88'YbdP`88 88  `8D `~~88~~'        /  | 
    88oodD' 88oobY' 88    88 88  88  88 88oodD'    88    __   __`| | 
    88~~~   88`8b   88    88 88  88  88 88~~~      88    \ \ / / | | 
    88      88 `88. `8b  d8' 88  88  88 88         88     \ V / _| |_
    88      88   YD  `Y88P'  YP  YP  YP 88         YP      \_/  \___/
    
Of course to match the `.font()` chain, there is also an `image()` chain, you can blend them like so:

    art.image({
    	width : 40,
    	filepath : parentDir+'/Images/initech.png',
    	alphabet : 'wide'
    }).font('INITECH', 'Doom', 'cyan', function(ascii){
		console.log(ascii);
    });
    
Which produces something like:

![Mixed Content Example](http://patternweaver.com/Github/Ascii/docs/initech.png);

Testing
-------
In the root directory run:

	npm run test
	
which runs the test suite directly. In order to test it in Chrome try:

	npm run browser-test
	
Please make sure to run the test suite before submitting a patch. Thanks!

Sample
------
To view a sample of graphics try:

	npm run sample

Hope that helps, please report any rough edges!

Enjoy,

-Abbey Hawk Sparrow