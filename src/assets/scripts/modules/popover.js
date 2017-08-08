/*
*   Name: popover v1.0
*   Date: 05-02-2016
*   Description: This function is used to extend the Bell Flush Popover v1.10.1590
*	http://flush.bellwebsolutions.net/documentation/javascript.html#popovers
*
*   Parameters:
*	- appendto : "body",
*	- offscreen : null,
*	- speed : 200,
*	- debounce : 0,
*	- placement : "top", //top | bottom | left | right
*	- trigger : "click", // click | hover | focus
*	- items : null,
*	- attr : "data-target",
*	- autohide : true,
*	- offsetx : 0,
*	- offsety : 0,
*	- offsetauto : true,
*	- arrow : null,
*	- arrowcss : null,
*	- delay : 500,
*	- zindex : 2,
*	- showcomplete : $.noop(),
*	- hidecomplete : $.noop()
*
*   Dependencies:
*   - jquery (latest version)
*   - jqueryui
*   - popovers.js
*
*   Usage:
*   $('[data-popover]').popovers(options);
*/

// function to call from init or after ajax call to init the tooltips
function doInitPopover(){
	if($('[data-popover]').length){
		$("[data-popover]").each(function(){
			var $this = $(this),
				o_options = $this.data(); // its options
			$this.popovers(o_options);

			// if you want a callback
			/* $this.popovers(
				o_options, {
					showcomplete : function (event, data) {
						// data.source  element item who triggered the popovers
						// data.target  element item's target
					}
				}
			);*/
		});
	}
}