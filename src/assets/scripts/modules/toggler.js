/*
 *   Name: toggler v1.0
 *   Date: 05-02-2016
 *   Description: This function is used to create a tabs element.
 *
 *   Parameters:
 *	- toggler-wrapper (string) : ID or class of the wrapper element
 *	- toggler-target (string) : ID or class of the target
 *	- toggler-label-start (string) : Text to show when the toggler is closed
 *	- toggler-label-end (string) : Text to show when the toggler is opened
 *	- toggler-open-class (string) : Class to add when the toggler is opened
 *	- toggler-effect (string) : fx-slide-vertical, fx-fade-in
 *   - toggler-close (boolean) : true or false
 *   - toggler-icon-reference (string) : icon name without the class prefix
 *
 *   Dependencies:
 *   - jquery (latest version)
 *
 *   Usage:
 *   To use this function, simply call it with : $('#mytoggler').toggler('toggler', {togglerTarget:'#toggler-1'});
 */

;(function ( $, window, document, undefined ) {
    // create the defaults once
    var pluginName = "toggler",
        defaults = {
            togglerWrapper : MY_PROJECT_NAME.s_projectClass + "toggler", // class of the toggler wrapper
            togglerGroup : MY_PROJECT_NAME.s_projectClass + "toggler-group", // class of the toggler wrapper
            togglerTarget : null, // target to toggler
            togglerLabelStart : null, // label when the toggler is closed
            togglerLabelEnd : null, // label when the toggler is open
            togglerOpenClass : MY_PROJECT_NAME.s_projectPrefix + "toggler-open", // class when the toggler is open
            togglerEffect : null, // which effect do you want ?
            togglerClose : false, // do other toggler in the same group will close ?
            togglerIconReference : null // Only Icon Name NO CLASS PREFIX
        };

    // create methods that will be accessible from outside
    var methods = {
        init: function(element, options) {
            element.attr({
                "aria-controls" : options.togglerTarget.replace(/#/gi, ""),
                "role" : "widget"
            });
            this._setAccessibility($(options.togglerTarget), false);

            // if toggler has open class
            var $togglerWrapper = element.closest(options.togglerWrapper); // get the toggler wrapper object
            if($togglerWrapper.hasClass(options.togglerOpenClass)){
                this.show(element, options);
            }
        },
        toggler: function(element, options) {
            var $togglerWrapper = element.closest(options.togglerWrapper); // get the toggler wrapper object
            closeAll = false;
            if($togglerWrapper.parent(options.togglerGroup).length){
                closeAll = true;
                this.hide($togglerWrapper.parent(options.togglerGroup).find(MY_PROJECT_NAME.s_projectClass + 'toggler-content:not('+options.togglerTarget+')'), options, closeAll);
            }

            // if item has open class
            if($togglerWrapper.hasClass(options.togglerOpenClass)){
                this.hide(element, options, closeAll);
            } else {
                this.show(element, options, closeAll);
            }
        },
        show: function(element, options){
            var labelText, labelIcon, iconHtml = '';
            var $togglerWrapper = element.closest(options.togglerWrapper); // get the toggler wrapper object
            $togglerWrapper.addClass(options.togglerOpenClass);
            if(options.togglerLabelEnd !== null) {
                labelText = $.trim(options.togglerLabelEnd);
                if(options.togglerIconReference !== null) {
                    labelIcon = $.trim(options.togglerIconReference);
                    iconHtml = '<svg class="'+MY_PROJECT_NAME.s_projectPrefix+'icon '+MY_PROJECT_NAME.s_projectPrefix+labelIcon+'" >'+
                        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#'+labelIcon+'"></use>'+
                        '</svg>';
                }
                element.html(labelText+' '+iconHtml);
            }
            this._setAccessibility($(options.togglerTarget), true); // change accessibility attributes on target
            var e = $.Event('show.toggler', {
                element: $togglerWrapper
            }); // custom callback when a toggler is shown
            $togglerWrapper.trigger(e);
            this._transition(options.togglerEffect, $(options.togglerTarget), true);
        },
        hide: function(element, options, closeAll){
            var labelText, labelIcon, iconHtml = '';
            var $togglerWrapper = element.closest(options.togglerWrapper); // get the toggler wrapper object
            $togglerWrapper.removeClass(options.togglerOpenClass); // remove the open class
            if(options.togglerLabelStart !== null) {
                labelText = $.trim(options.togglerLabelStart); // change the text of the link
                if(options.togglerIconReference !== null) {
                    labelIcon = $.trim(options.togglerIconReference);
                    iconHtml = '<svg class="'+MY_PROJECT_NAME.s_projectPrefix+'icon '+MY_PROJECT_NAME.s_projectPrefix+labelIcon+'" >'+
                        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#'+labelIcon+'"></use>'+
                        '</svg>';
                }
                element.html(labelText+' '+iconHtml);
            }
            this._setAccessibility($(options.togglerTarget), false) // change accessibility attributes on target
            var e = $.Event('hide.toggler', {
                element: $togglerWrapper
            }); // custom callback when a toggler is hidden
            $togglerWrapper.trigger(e);

            if(closeAll){
                this._transition(options.togglerEffect, $togglerWrapper.parents(options.togglerGroup).find(MY_PROJECT_NAME.s_projectClass + 'toggler-content'), false);
            } else {
                this._transition(options.togglerEffect, $(options.togglerTarget), false);
            }
        },
        _setAccessibility : function (element, isVisible) {
            return element.attr({
                "tabindex" : isVisible ? 0 : -1,
                "aria-expanded" : isVisible ? true : false,
                "aria-hidden" : !isVisible ? true : false
            });
        },
        _transition : function (transition, element, isVisible){
            switch(transition){
                case 'fx-slide-vertical':
                    var togglerHeight = element.find('> *').outerHeight(true);
                    element.animate({height:isVisible ? togglerHeight : 0 }, 500);
                    break;

                case 'fx-fade-in':
                    element.toggleClass(transition);
                    var togglerHeight = element.find('> *').outerHeight(true);
                    isVisible ? element.css({'height':togglerHeight}) : null;
                    element.one($.support.transition.end,
                        function() {
                            isVisible ? null : element.css({'height':0 });;
                        }
                    );
                    break;

                default:
                    element.css({'height': isVisible ? 'auto' : 0});
                    break;
            };
        },
        adjustHeight : function(element, options){
            var $this = this;

            if(options.tabEffect){
                this._transition(options.togglerEffect, $(options.togglerTarget), true);
            }
        }
    };

    $.fn.toggler = function(methodOrOptions, parameters) {
        // if there's an object or some function that has been passed
        if(methodOrOptions !== "undefined"){
            // if methodOrOptions exist in the list of plugin methods, example 'destroy'
            if ( methods[methodOrOptions] ) {
                var options = $.extend( {}, defaults, parameters); // we take parameters and merge them with the default options
                return methods[methodOrOptions](this, options); // we call the method and pass the element and its options
            } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
                // Default to "init"
                var options = $.extend( {}, defaults, methodOrOptions); // we take parameters and merge them with the default options
                return methods.init( this, options ); // we call init and pass the element and its options
            } else {
                $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.' + pluginName );
            }
        } else {
            var options = defaults; // options are the default ones
            return methods.init( this, options ); // we call init and pass the element and its options
        }
    };

    // if we need to have a callback when the tab is being shown or hide
    $(document)
        .on('hide.toggler', MY_PROJECT_NAME.s_projectClass + 'toggler', function() {
            //console.log('hide')
        })
        .on('show.toggler', MY_PROJECT_NAME.s_projectClass + 'toggler', function() {
            //console.log('show')
        })

})( jQuery, window, document );

function doInitToggler(){
    if($('[data-toggler]').length){
        $('[data-toggler]').each(function(){
            var $this = $(this),
                o_options = $this.data(); // its options
            if($this.attr('data-toggler') == ""){
                $this.toggler(o_options); // we initialize the toggler
            }
        });
        $(document).off('click', '[data-toggler]').on('click', '[data-toggler]', function(e) {
            var $this = $(this),
                o_options = $this.data(); // its options
            e.preventDefault();
            if($this.attr('data-toggler') == ""){
                $this.toggler('toggler', o_options); // we call the toggler function to show/hide content : $this.toggler('toggler', {togglerTarget:'#mytogglerContent'});
            }
        });
        $(window).resize(function() {
            MY_PROJECT_NAME.utils.global.waitForFinalEvent(function(){
                $('[data-toggler]').each(function(){
                    var $this = $(this),
                        options = $this.data(); // its options
                    $this.tabs('adjustHeight', options); // we could also pass the options this way : $this.equalizer({equalizerItems:'> div'});
                });
            }, 500, "togglerResize"); // after the resize is done
        });
    }
}