// Load combined svg file (with symbols) into body
var ajax = new XMLHttpRequest();
ajax.open("GET", MY_PROJECT_NAME.s_svgPath, true);
ajax.send();
ajax.onload = function(e) {
	var div = document.createElement("div");
	div.innerHTML = ajax.responseText;
	document.body.insertBefore(div, document.body.childNodes[0]);
}

MY_PROJECT_NAME.utils.intacthub = {
	initIsotope: function(filter){
		if(filter == 'all' || typeof filter === "undefined"){
			filter = ".js-isotope-item";
		} else {
			filter = '.' + filter;
		}
        $('.js-isotope').isotope({
            itemSelector: '.js-isotope-item',
            percentPosition: true,
            masonry: {
                columnWidth: '.js-isotope-item'
            },
            filter: filter
        });
        MY_PROJECT_NAME.utils.intacthub.filterItemsInit();
	},
	toggleSearch: function(){
		var $search = $('.js-search');
		$search.toggleClass('is-active');
	},
	filter: function($this){
		var category = $this.data('category'),
			$filters = $('.intacthub-filters');
		$filters.find('.' + MY_PROJECT_NAME.s_active).removeClass(MY_PROJECT_NAME.s_active);
		$this.addClass(MY_PROJECT_NAME.s_active);
		MY_PROJECT_NAME.utils.intacthub.initIsotope(category);
	},
	filterItemsInit: function(){
		var filters = $( '.js-filter' );
		var contentitem = $( '.js-isotope' ).find( '.js-isotope-item' );
		$.each( filters, function(){
			var category = $(this).data('category');
			if( category != 'all' ){
				if( !contentitem.hasClass( category ) ){
					$(this).parent().remove();
				}
			}
		});
	}
};



$(function(){
	//Your Ready Scripts
	// Add JS and language classes on HTML
	$('html').addClass('js').addClass(MY_PROJECT_NAME.s_language);

	// Add offscreen text for screen readers for target=_blank links
	$('a[target="_blank"]:not([class*="a2a"])').each(function(){
		var $this = $(this);
		MY_PROJECT_NAME.s_linkNewWindow = 'This link will open in a new window.';
		if(MY_PROJECT_NAME.s_language.indexOf('fr') == 0){
			MY_PROJECT_NAME.s_linkNewWindow = 'Ce lien s\'ouvrira dans une nouvelle fenêtre.';
		}
		$this.append('<span class="' + MY_PROJECT_NAME.s_namespacePrefix + 'to-offscreen">'+MY_PROJECT_NAME.s_linkNewWindow+'</span>');
		$this.attr('rel', 'noopener noreferrer');
	});

	// support of onTransitionEnd
	$.support.transition = MY_PROJECT_NAME.utils.global.transitionEnd();

	// init all swipers
    // doInitSwiper();

	// init all tabs
    // doInitTab();

	// init all toggler
    // doInitToggler();

	// init all tooltips
    // doInitTooltip();

    // init all popovers
    // doInitPopover();

	// init accessible navigation
    doInitNavigation();

	// init responsive image map
	//doInitResponsiveImageMap();

	// init typeahead
    // doInitTypeahead();

	// init datepicker
    // doInitDatepicker();

	// init responsive tables
    //doInitResponsiveTables();

    // init forms (validate and custom form elements)
    // doInitForm();

    // init charcounter
    //doInitCharcounter();



	$('.js-toggle-search').click(function(){
		MY_PROJECT_NAME.utils.intacthub.toggleSearch();
		return false;
	});

	$('.js-filter').click(function(){
		MY_PROJECT_NAME.utils.intacthub.filter($(this));
		return false;
	});

	
});

window.onload = function(){
	// masonry
    if($('.js-isotope').length){
        MY_PROJECT_NAME.utils.intacthub.initIsotope();
    }
    if( $('.fb_iframe_widget_lift').length ){
    	console.log( $('.fb_iframe_widget_lift').attr( 'src' ) );
    }
}
