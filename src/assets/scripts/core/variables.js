// @namespace Namespace for project classes and functions
var MY_PROJECT_NAME = MY_PROJECT_NAME || {};
MY_PROJECT_NAME.core = {};
MY_PROJECT_NAME.utils = {};
MY_PROJECT_NAME.global = {};

// Projet name prefix and class
MY_PROJECT_NAME.s_namespacePrefix = 'showtix-';
MY_PROJECT_NAME.s_namespaceClass = '.showtix-';

MY_PROJECT_NAME.s_active = 'is-active';

// Detect document language
MY_PROJECT_NAME.s_language = (document.documentElement.lang || (window.navigator.userLanguage || window.navigator.language)).substring(0,2);

// Set SVG path in project - to be overwritten in /docs/ folder
MY_PROJECT_NAME.s_svgPath = getSVGpath();
MY_PROJECT_NAME.s_svgLogoPath = getSVGLogopath();

// Mobile detection object
MY_PROJECT_NAME.o_isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (MY_PROJECT_NAME.o_isMobile.Android() || MY_PROJECT_NAME.o_isMobile.BlackBerry() || MY_PROJECT_NAME.o_isMobile.iOS() || MY_PROJECT_NAME.o_isMobile.Opera() || MY_PROJECT_NAME.o_isMobile.Windows());
	}
};

// Browser detection object
MY_PROJECT_NAME.o_browser = {
	IE6: function() {
		return navigator.userAgent.match(/MSIE 6.0/i);
	},
	IE7: function() {
		return navigator.userAgent.match(/MSIE 7.0/i);
	},
	IE8: function() {
		return navigator.userAgent.match(/MSIE 8.0/i);
	},
	IE9: function() {
		return navigator.userAgent.match(/MSIE 9.0/i);
	},
	IE10: function() {
		return navigator.userAgent.match(/MSIE 10.0/i);
	},
	IE11: function() {
		return navigator.userAgent.match(/Trident.*rv[ :]*11\./);
	},
	Firefox: function() {
		return navigator.userAgent.match(/Firefox/i);
	},
	Chrome: function() {
		return navigator.userAgent.match(/Chrome/i);
	},
	Safari: function() {
		return navigator.userAgent.match(/Safari/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera/i);
	},
	other: function() {
		return (o_browser.IE6() || o_browser.IE7() || o_browser.IE8() || o_browser.IE9() || o_browser.IE10() || o_browser.IE11() || o_browser.Firefox() || o_browser.Chrome() || o_browser.Safari() || o_browser.Opera());
	}
};
/* if(MY_PROJECT_NAME.o_browser.Firefox() == null){
    alert('not Firefox');
} */

function getSVGpath(){
	var urlpath = document.getElementsByTagName('meta')['meta-svgpath'];
	var svgfilepath = "dist/assets/svg/icons.svg";
	var startfilepath = "./";
	if ( typeof urlpath !== "undefined" ) {
		startfilepath =  urlpath.getAttribute('content');
		urlpath.parentNode.removeChild(urlpath);
	}
	return startfilepath + svgfilepath;
}

function getSVGLogopath(){
	var urlpath = document.getElementsByTagName('meta')['meta-svgpath'];
	var svgfilepath = "dist/assets/svg/logo.svg";
	var startfilepath = "./";
	if ( typeof urlpath !== "undefined" ) {
		startfilepath =  urlpath.getAttribute('content');
		urlpath.parentNode.removeChild(urlpath);
	}
	return startfilepath + svgfilepath;
}
