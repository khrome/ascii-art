#!/usr/bin/env node
var art = require('../../art');
var Color = require('ascii-art-ansi/color');

Color.is256 = true;
Color.useDistance('euclideanDistance');

/*
art.font('Ghost Wire BBS', 'Doom', function(err, logo){
    art.font('No place like home', 'rusted', function(err, subtext){
        art.table({
            verticalBar : ' ',
            horizontalBar : ' ',
            intersection : ' ',
            data:[
                {name: art.style('current users', 'red'), value: '203'},
                {name: 'operator', value: 'vince.vega'},
                {name: 'dial-in', value: '(917)555-4202'},
            ]
        }).lines(2, function(err, table){
            art.image({
                filepath :'Images/sunburst_red.jpg',
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
            }, function(err, final){
                console.log(final);
            });
        });
    });
});
//*/
/*art.image({
    filepath :'Images/sunburst.jpg',
    alphabet : 'solid'
}, function(err, final){
    console.log(final);
})*/
//*
art.font('I N T E R N E T', 'Doom').lines(0, 6, function(err, logo){
    art.font('Serious      Business', 'rusted', function(err, subtext){
        art.table({
            verticalBar : ' ',
            horizontalBar : ' ',
            intersection : ' ',
            data:[
                {name: art.style('current users', 'red', true), value: '203'},
                {name: 'operator', value: 'vince.vega'},
                {name: 'dial-in', value: '(917)555-4202'},
            ]
        }).lines(2, function(err, table){
            art.image({
                filepath :'Images/serious-business.jpg',
                alphabet : 'blocks'
            }).lines(2, 50).overlay(logo, {
                x: 8,
                y: 0,
                style: 'blue',
            }).overlay(table, {
                x: -1,
                y: -4,
                transparent : true,
                style: 'green',
            }).overlay(subtext, {
                x: 12,
                y: -1,
                transparent : true,
                style: 'yellow',
            }, function(err, final){
                console.log(final);
            });
        });
    });
});
//*/
