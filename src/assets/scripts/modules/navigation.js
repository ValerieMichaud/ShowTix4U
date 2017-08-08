;(function ( $, window, document, undefined ) {
	var o_navigationLabels = {
    	fr: {
    		s_back: "Retour"
    	},
    	en: {
    		s_back: "back"
    	}
    }
    var o_navigationLabel = o_navigationLabels.en;
    if(MY_PROJECT_NAME.s_language.indexOf('fr') == 0){
    	o_navigationLabel = o_navigationLabels.fr;
    }

	// create methods that will be accessible from outside
    var methods = {
        init: function(element, options) {
        	$('.js-toggle-navigation').unbind().bind('click', function(){
                var activeClass = "is-active";
				// $(this).toggleClass(activeClass);
                $('[data-navigation]').toggleClass(activeClass);
			});

            // keyboard controls for WCAG
			var $top_level_links = $(element.find('li > a'));
			$top_level_links.next('ul').attr({ 'aria-hidden': 'true', 'role': 'menu' });
			$top_level_links.each(function(){
				if($(this).next('ul').length > 0){
					$(this).parent('li').attr('aria-haspopup', 'true');
				}
			});

			element.find('> ul').attr('role', 'menubar').find('li').attr('role', 'menuitem');
			element.find('li').each(function(){
				if($(this).find('ul').length){
					$(this).addClass('has-sub');
				}
			});
			element.find('li > a').on('focus', function(){
				$('.' + options.navigationHoverClass).removeClass(options.navigationHoverClass);
				$(this).parents('li').addClass(options.navigationHoverClass).find('> ul').attr('aria-hidden', 'false');
			});

			var $links = $(element.find('ul > li > a'));
			$links.keydown(function(e){
				console.log(e.keyCode);
				// left
				if(e.keyCode == 37) {
					e.preventDefault();
					if($(this).parent('li').prev('li').length == 0) {
						$(this).parents('ul').parents('li').find('a').first().focus();
					} else {
						$(this).parent('li').prev('li').find('a').first().focus();
					}
				// right
				} else if(e.keyCode == 39) {
					e.preventDefault();
					if($(this).parent('li').next('li').length == 0) {
						$(this).parents('ul').parents('li').find('a').first().focus();
					} else {
						$(this).parent('li').next('li').find('a').first().focus();
					}
				}
			});

			var $sublinks = $(element.find('ul ul > li > a'));
			$sublinks.keydown(function(e){
                // console.log(e.keyCode);
				// top
				if(e.keyCode == 38) {
					e.preventDefault();
					if($(this).parent('li').prev('li').length == 0) {
						$(this).parents('ul').parents('ul').prev('ul').find('a').last().focus();
					} else {
						$(this).parent('li').prev('li').find('a').first().focus();
					}
				// down
				} else if(e.keyCode == 40) {
					e.preventDefault();
					if($(this).parent('li').next('li').length == 0) {
						$(this).parents('ul').parents('ul').next('ul').find('a').first().focus();
					} else {
						$(this).parent('li').next('li').find('a').first().focus();
					}
				// right
				} else if(e.keyCode == 39){
					e.preventDefault();
				// left
				} else if(e.keyCode == 37){
					e.preventDefault();
				}
			});
        }
    };

    $.fn.navigation = function(methodOrOptions, parameters) {
    	// if there's an object or some function that has been passed
     	if(methodOrOptions !== "undefined"){
     		// if methodOrOptions exist in the list of plugin methods, example 'destroy'
			if ( methods[methodOrOptions] ) {
				var options = parameters; // we take parameters and merge them with the default options
				return methods[methodOrOptions](this, options); // we call the method and pass the element and its options
			} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
				// Default to "init"
				var options = methodOrOptions; // we take parameters and merge them with the default options
				return methods.init( this, options ); // we call init and pass the element and its options
			} else {
				$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.' + pluginName );
			}
     	} else {
        	var options = defaults; // options are the default ones
            return methods.init( this, options ); // we call init and pass the element and its options
     	}
	};
})( jQuery, window, document );

function doInitNavigation(){
	$('[data-navigation]').each(function(){
		var $this = $(this),
			options = $this.data(); // its options
		$this.navigation(options);
	});

	$(window).resize(function() {
		MY_PROJECT_NAME.utils.global.waitForFinalEvent(function(){

		}, 500, "navigationResize"); // after the resize is done
	});
}