/*
*   Name: tooltip v1.0
*   Date: 05-02-2016
*   Description: This function is used to extend the Bell Flush Tooltip v1.10.1206
*	http://flush.bellwebsolutions.net/documentation/javascript.html#tooltips
*
*   Parameters:
*	- items : null,
*	- placement : "top", //top | bottom | left | right
*	- html : '<div class="fui-popover"><div class="fui-popover-body"><div class="bws-padder"></div><div class="fui-popover-arrow"></div></div></div>',
*	- body : ".bws-padder",
*	- arrow : ".fui-popover-arrow",
*	- tooltipclass : "fui-tooltip",
*	- offsety : 0,
*	- offsetx : 0,
*	- offsetauto : true,
*	- speed : 200,
*	- preventDefault : true,
*	- attr: null,
*	- content : null,
*	- showcomplete : $.noop(),
*	- hidecomplete : $.noop()
*
*   Dependencies:
*   - jquery (latest version)
*   - jqueryui
*   - tooltips.js
*
*   Usage:
*   $('[data-tooltip]').tooltips(options);
*/
(function($){
	$.widget("fui.tooltips", $.fui.tooltips, {
    	options : {
			html : '<div class="fui-popover"><div class="fui-popover-body"><div class="bws-padder"></div><div class="fui-popover-arrow"></div></div></div>',
			body : MY_PROJECT_NAME.s_namespaceClass + "padder"
		}
	});
})(jQuery);

// function to call from init or after ajax call to init the tooltips
function doInitTooltip(){
	if($('[data-tooltip]').length){
		$("[data-tooltip]").each(function(){
			var $this = $(this),
				o_options = $this.data(); // its options
			$this.tooltips(o_options);

			// if you want a callback
			/* $this.tooltips(
				o_options, {
					showcomplete : function (event) {
						console.log('show')
					}
				}
			);*/
		});
	}
}