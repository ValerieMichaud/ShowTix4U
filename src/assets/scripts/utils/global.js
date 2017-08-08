MY_PROJECT_NAME.utils.global = {
	// Function to call when resizing or scrolling to avoid multiple calls
	waitForFinalEvent: (function(){
        var timers = {};
    	return function (callback, ms, uniqueId) {
    		if (!uniqueId) {
    			uniqueId = "Don't call this twice without a uniqueId";
    		}
    		if (timers[uniqueId]) {
    			clearTimeout (timers[uniqueId]);
    		}
    		timers[uniqueId] = setTimeout(callback, ms);
    	};
    })(),
    transitionEnd: function(){
    	var el = document.createElement('bootstrap');
		var transEndEventNames = {
		  'WebkitTransition' : 'webkitTransitionEnd',
		  'MozTransition'    : 'transitionend',
		  'OTransition'      : 'oTransitionEnd otransitionend',
		  'transition'       : 'transitionend'
		}
		for (var name in transEndEventNames) {
		  if (el.style[name] !== undefined) {
			return { end: transEndEventNames[name] }
		  }
		}
		return false // explicit for ie8 (  ._.)
    }
}