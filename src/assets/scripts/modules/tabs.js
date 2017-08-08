/*
*   Name: tabs v1.0
*   Date: 05-02-2016
*   Description: This function is used to create a tabs element.
*
*   Parameters:
*	- tab-nav-items (string) : element that will handle click event
*	- tab-active-class (string) : class of the active element
*	- tab-element (string) : tab element
*	- tab-content-class (string) : Class of the tab content element
*	- tab-effect (string) : slideHorizontal, slideVertical, fade
*
*   Dependencies:
*   - jquery (latest version)
*
*   Usage:
*   To use this function, simply call it with : $('#myTabs').tabs({tabNavItems:'button', tabEffect:'fx-slide-vertical'});
*/

;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "tabs",
    	defaults = {
    		tabNavItems: 'button, a',
			tabActiveClass:  MY_PROJECT_NAME.s_namespacePrefix + 'active', // active class
			tabElement: 'li', // which element is used to define a tab
			tabContentClass: MY_PROJECT_NAME.s_namespaceClass + 'tabs-content', // class used to define a tab content
			tabEffect: null  // do we want an effect other than show/hide ?
		},
		$tabNavItems,
		$tab,
		$tabContent,
		tabTarget,
		animationRunning = false;

	// create methods that will be accessible from outside
    var methods = {
        init: function(element, options) {
        	var $this = this,
        		vars = this._getVars(element, options);

			// set accessibility data on tabs and tab contents
			vars.$tabNavItems.each(function(){
				$this._initAccessibility($(this), 'tab');
			});
			$tabContent.each(function(){
				$this._initAccessibility($(this), 'tabContent');
			});

			// if an effect has been defined, add the class to the tab content elements
			if(options.tabEffect){
				vars.$tabContent.addClass(options.tabEffect);
				if(options.tabEffect == "fx-fade-in"){
                	vars.$tabContent.addClass("fx-fade-out");
				}
			}

			// handle click event on tabs
			vars.$tabNavItems.on('click', function(){
				if(!animationRunning){
				 	$this._hide(element, options);
					$this._show($(this), options);
				} else {
					return false;
				}
			});

			// if there's no active tab
			if ($(element).find(MY_PROJECT_NAME.s_namespaceClass + 'tabs-nav ' + MY_PROJECT_NAME.s_namespaceClass + 'active').size() == 0) {
				$(element).find(MY_PROJECT_NAME.s_namespaceClass + 'tabs-nav > *').first().find('> *').trigger('click'); // activate the first tab
			} else {
				if ($(element).find(MY_PROJECT_NAME.s_namespaceClass + 'tabs-nav ' + MY_PROJECT_NAME.s_namespaceClass + 'active > *').data('tab-target')) {
					$(element).find(MY_PROJECT_NAME.s_namespaceClass + 'tabs-nav ' + MY_PROJECT_NAME.s_namespaceClass + 'active > *').trigger('click'); // trigger the click of the active tab to show its content
				}
			}
        },
        _getVars : function (element, options){
        	$tabNavItems = $(element).find(MY_PROJECT_NAME.s_namespaceClass + 'tabs-nav ' + options.tabNavItems), // items that will have onclick event
			$tab = $(element).find(MY_PROJECT_NAME.s_namespaceClass + 'tabs-nav ' + options.tabElement), // tab element objects $('li')
			$tabContent = $(element).find(options.tabContentClass) // tab content objects $('.bws-tab-content')
			return {
            	$tabNavItems : $tabNavItems,
                $tab : $tab,
                $tabContent : $tabContent
			}
        },
        _initAccessibility : function(element, type){
        	switch(type){
        		case 'tab':
        		return element.attr({
					"aria-controls" : element.data('tab-target').replace('#',''),
					"aria-expanded": "false",
					"role" : "tab"
				});
        		break;

        		case 'tabContent':
                return element.attr({
					"role" : "tabpanel",
					"aria-labelledby" : element.attr('id'),
					"aria-hidden" : "true"
				});
        		break;
        	}
        },
        _hide : function(element, options){
        	var vars = this._getVars(element, options);

        	this._transition(options.tabEffect, vars.$tabContent, false); // do the transition
        	element.find('.'+options.tabActiveClass).removeClass(options.tabActiveClass); // remove all active items
			element.find('[aria-expanded]').attr('aria-expanded', 'false'); //change the aria-expanded attribute to false for screen readers

			var e = $.Event('hide.tab', {
				element: vars.$tabContent
			}); // custom callback when a tab is hidden

			vars.$tabContent.trigger(e);
        },
        _show : function(element, options){
        	var vars = this._getVars(element, options),
        		$tabTarget = $($(element).data('tab-target'));

			element.find('[aria-expanded]').attr('aria-expanded', 'true');
			element.parent().addClass(options.tabActiveClass); // add the active class tab element and update the aria-expanded attribute to true for screen readers
			this._transition(options.tabEffect, $tabTarget, true);
			var e = $.Event('show.tab', {
				element: $tabTarget
			}); // custom callback when a tab is shown
			$tabTarget.trigger(e).addClass(options.tabActiveClass); // show the targeted tab by adding the class active
        },

        _transition : function (transition, element, isVisible){
        	animationRunning = true;
			switch(transition){
				case 'fx-slide-vertical':
				var toggleHeight = element.find('> *').outerHeight(true);
				element.animate({height:isVisible ? toggleHeight : 0 }, 500);
				setTimeout(function(){
					animationRunning = false;
				}, 500);
				break;

				case 'fx-fade-in':
				isVisible ? element.addClass(transition) : element.removeClass(transition);
				var toggleHeight = element.find('> *').outerHeight(true);
				isVisible ? element.css({'height':toggleHeight}) : element.css({'height':0 });
				element.one($.support.transition.end,
					function() {
						animationRunning = false;
					}
				);
				break;

				default:
				element.css({'height': isVisible ? 'auto' : 0});
				animationRunning = false;
				break;
			};
		},
		adjustHeight : function(element, options){
			var $this = this;

			if(options.tabEffect){
				this._transition(options.tabEffect, $(element).find(options.tabContentClass + '.' + options.tabActiveClass), true);
			}
		}
    };

    $.fn.tabs = function(methodOrOptions, parameters) {
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
    	.on('hide.tab', defaults.tabContentClass, function() {
    		//console.log('hide : ' + $(this).attr('id'))
    	})
    	.on('show.tab', defaults.tabContentClass, function() {
    		//console.log('show : ' + $(this).attr('id'))
    	})

})( jQuery, window, document );

function doInitTab(){
	if($('[data-tab]').length){
		$('[data-tab]').each(function(){
		 	var $this = $(this),
				o_options = $this.data(); // its options
			$this.tabs(o_options); // we could also pass the options this way : $this.tabs({tabNavItems:'> div'});
		});
		$(window).resize(function() {
			MY_PROJECT_NAME.utils.global.waitForFinalEvent(function(){
				$('[data-tab]').each(function(){
					var $this = $(this),
						options = $this.data(); // its options
					$this.tabs('adjustHeight', options); // we could also pass the options this way : $this.equalizer({equalizerItems:'> div'});
				});
			}, 500, "tabsResize"); // after the resize is done
		});
	}
}