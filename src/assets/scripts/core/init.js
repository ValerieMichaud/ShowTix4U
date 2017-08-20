// Load combined svg file (with symbols) into body
var ajax = new XMLHttpRequest();
ajax.open("GET", MY_PROJECT_NAME.s_svgPath, true);
ajax.send();
ajax.onload = function(e) {
	var div = document.createElement("div");
	div.innerHTML = ajax.responseText;
	document.body.insertBefore(div, document.body.childNodes[0]);
}
var ajaxLogo = new XMLHttpRequest();
ajaxLogo.open("GET", MY_PROJECT_NAME.s_svgLogoPath, true);
ajaxLogo.send();
ajaxLogo.onload = function(e) {
	var div = document.createElement("div");
	div.innerHTML = ajaxLogo.responseText;
	document.body.insertBefore(div, document.body.childNodes[0]);
}

MY_PROJECT_NAME.utils.showtix = {
	
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
    doInitSwiper();

	// Toggle active class
	$('.js-toggle-active').click(function(){
		var $this = $(this),
			$target = $($this.data('target'));
		$this.toggleClass(MY_PROJECT_NAME.s_active);
		$target.siblings().removeClass(MY_PROJECT_NAME.s_active);
		$target.toggleClass(MY_PROJECT_NAME.s_active);

		// Change label
		if($this.data('active')){
			$target.hasClass(MY_PROJECT_NAME.s_active) ? $this.text($this.data('active')) : $this.text($this.data('start'))
		}

		return false;
	});

	if($(window).scrollTop() > 50){
		$('.showtix-page-header').addClass('is-floating');
	}

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop()
		if(scrollTop > 50){
			$('.showtix-page-header').addClass('is-floating');
		} else {
			$('.showtix-page-header').removeClass('is-floating');
		}
	});

	$('.js-anchor').click(function(){
		var anchor = $(this).data('anchor'),
			anchorTop = $('[data-anchor-id="' + anchor + '"]').position().top;
		$('html, body').animate({
	        scrollTop: anchorTop - 25
	    }, 500);
	    if($('.js-navigation').hasClass('is-active')){
	    	$('.js-navigation').removeClass('is-active')
	    }
	    return false;
	});

	// Truncate
	if($('.js-truncate').length){
		$('.js-truncate').each(function(){
			var $this = $(this),
				text = $this.text(),
				limit = 60;
			if(text.length > limit){
				var newText = text.substring(0,limit) + "...";
				$this.text(newText);
			}
		});
	}
	


	
});