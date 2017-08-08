import React from 'react';
import ReactDOM from 'react-dom';

var vendors = require.context('./vendors/', true, /\.(js)$/);
var modules = require.context('./modules/', true, /\.(js)$/);
var core = require.context('./core/', true, /\.(js)$/);
var utils = require.context('./utils/', true, /\.(js)$/);
var files = {};

var excludedFiles = ['./charcounter.js', './datepicker.js', './forms.js', './popover.js', './responsiveimagemap.js', './swiper.js', './tabs.js', './toggler.js', './tooltip.js', './typeahead.js', './imageMapResizer.js', './popovers.js', './tooltips.js', './jquery.auto-complete.js', './jquery-ui-widget.js', './ie/html5shiv.min.js', './ie/respond.min.js', './jquery.min.js']

core.keys().forEach((filename)=>{
    files[filename] = core(filename);
});

utils.keys().forEach((filename)=>{
    files[filename] = utils(filename);
});

vendors.keys().forEach((filename)=>{
    if(excludedFiles.indexOf(filename) == -1){
    	files[filename] = vendors(filename);
    }    
});

modules.keys().forEach((filename)=>{
    if(excludedFiles.indexOf(filename) == -1){
		files[filename] = modules(filename);
	}
});


// isotope.keys().forEach((filename)=>{
//     files[filename] = isotope(filename);
// });
console.log(files); //you have file contents in the 'files' object, with filenames as keys

