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