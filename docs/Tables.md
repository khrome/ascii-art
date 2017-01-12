Tables
------
we can produce ASCII/ANSI tables in a similar manner to [ascii-table](https://www.npmjs.com/package/ascii-table), but with colors and styles!

To produce a standard box style (and it will attempt to be smart about column widths **without** truncating ansi codes):

	    art.table({
	    	width : 80,
	    	data : [ /* ... */ ]
	    });

![Table Example](http://patternweaver.com/Github/Ascii/docs/ascii_table.png)

If you add some additional options you get:

		art.table({
			width : 80,
			data : [ /* ... */ ],
			columns : [
				{
					value : 'Product',
					style : 'black+gray_bg'
				}, {
					value : 'Maker',
					style : 'white'
				}, {
					value : 'Location',
					style : 'white'
				}
			]
		});

which will output:

![Styled Table Example](http://patternweaver.com/Github/Ascii/docs/ansi_table.png)
