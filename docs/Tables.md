Tables
------
we can produce ASCII/ANSI tables in a similar manner to [ascii-table](https://www.npmjs.com/package/ascii-table), but with colors and styles!

To produce a standard box style (and it will attempt to be smart about column widths **without** truncating ansi codes):

	    art.table({
	    	width : 80,
	    	data : [ /* ... */ ]
	    }, function(rendered){
			// use rendered text
		});

![Table Example](http://patternweaver.com/Github/Ascii/docs/ascii_table.png)

If you add some additional options you get:

		art.table({
			width : 80,
			data : [ /* ... */ ],
			verticalBar : ' ',
			horizontalBar : ' ',
			intersection : ' ',
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
		}, function(rendered){
			// use rendered text
		});

which will output:

![Styled Table Example](http://patternweaver.com/Github/Ascii/docs/ansi_table.png)

You can also play with border colorings and built-in borders (`single`, `double`, `block` and `angles`) using the UTF box drawing characters

	art.table({
		width : 80,
		data : [ /* ... */ ],
        bars : 'single',
        borderColor : 'bright_white'
	}, function(rendered){
		// use rendered text
	});

which will output:

![Styled Table Example](http://patternweaver.com/Github/Ascii/docs/single_table.png)

To define this manually it would look like:

    art.table({
        width : 80,
        data : [ /* ... */ ],
        bars : {
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
        },
        borderColor : 'bright_white',
    }, function(rendered){
		// use rendered text
	});

Another example:

	art.table({
		width : 80,
		data : [ /* ... */ ],
        bars : 'double',
        headerStyle : 'yellow',
        dataStyle : 'bright_white',
        borderColor : 'gray'
	}, function(rendered){
		// use rendered text
	});

which will output:

![Styled Table Example](http://patternweaver.com/Github/Ascii/docs/double_table.png)
