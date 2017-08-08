/*
*   Name: charcounter v1.0
*   Date: 03-04-2016
*   Description: This function is used to create charcounter.
*
*   Parameters:
*	- charcounter-limit (string) : characters limit
*   - charcounter-template (string) : template for X characters left
*
*   Dependencies:
*   - jquery (latest version)
*
*/


;(function ( $, window, document, undefined ) {
    // create the defaults once
    var pluginName = "charcounter",
    	defaults = {
			charcounterLimit: 400,
			charcounteTemplate: null,
            charcounterItem: MY_PROJECT_NAME.s_namespaceClass + 'charcounter-item'
		};

	// create methods that will be accessible from outside
    var methods = {
    	init: function(element, options) {
        	var $element = $(element),
                _this = this;
            $element.on('keyup', function(){
                _this.calculate(element, options);
            });
        },
        calculate: function(element, options){
            var $element = $(element),
                elementValue = $element.val(),
                elementValueLength = elementValue.length,
                limit = options.charcounterLimit,
                diff = limit - elementValueLength,
                elementValueCut,
                template = "";
            if(elementValueLength > limit){
                elementValueCut = elementValue.substring(0,limit);
                $element.val(elementValueCut);
                diff = 0;
            } 
            if(options.charcounterTemplate){
                template = options.charcounterTemplate;
                template = template.replace('%', diff);
            }
            if(!$(options.charcounterItem).length){
                _charcounterItem = options.charcounterItem.replace('.', '');
                $('<span class="' + _charcounterItem + '"></span>').insertAfter($element);
            }
            $(options.charcounterItem).html(template);
        }
    };

    $.fn.charcounter = function(methodOrOptions, parameters) {
    	// if there's an object or some function that has been passed
     	if(methodOrOptions !== "undefined"){
     		// if methodOrOptions exist in the list of plugin methods, example 'destroy'
			if ( methods[methodOrOptions] ) {
				var options = $.extend( {}, defaults, parameters); // we take parameters and merge them with the default options
				return methods[methodOrOptions](this, options); // we call the method and pass the element and its options
			} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
				// Default to "init"
				var options = $.extend( {}, defaults, methodOrOptions); // we take parameters and merge them with the default options
				methods.init( this, options ); // we call init and pass the element and its options
			} else {
				$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.' + pluginName );
			}
     	} else {
        	var options = defaults; // options are the default ones
            return methods.init( this, options ); // we call init and pass the element and its options
     	}
	};
})( jQuery, window, document );

// if we need to have a callback when the equalizer is done
$(document)
	.on('charcounter.done', '[data-charcounter]', function() {
		//console.log('done')
	});

// function to call from init or after ajax call to init the custom form elements
function doInitCharcounter(){
    $('[data-charcounter]').each(function(){
        var $this = $(this),
            options = $this.data(); // its options
        $this.charcounter(options);
    });
}
