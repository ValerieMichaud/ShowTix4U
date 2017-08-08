/*!
 * tooltips v1.10.1206
 *
 * Developer: Son Pham
 * Organization: Bell Customer Experience (BCX)
 *
 * Description: toolTips on mouseover
 *
 * depends:
 *	- jquery.js 1.10
 *	- jquery-ui-widget.js v1.10 
 *
 * Date: August 7th, 2014 -0500
 */
(function ($) {
 $.widget("fui.tooltips", {
	version: "1.10.1206",

	options : {
		items : null,
		placement : "top", //top | bottom | left | right
		html : '<div class="fui-popover"><div class="fui-popover-body"><div class="fui-padder"></div><div class="fui-popover-arrow"></div></div></div>',
		body : ".fui-padder",		
		arrow : ".fui-popover-arrow",
		tooltipclass : "fui-tooltip",
		offsety : 0,
		offsetx : 0,
		offsetauto : true,
		speed : 200,
		preventDefault : true,
		attr: null,
		content : null,
		showcomplete : $.noop(),
		hidecomplete : $.noop()
	},
	
	_create : function () {
		var self = this, handlers = {}, handler = {};
		handlers["mouseover" + (this.options.items === null ? "" : " " + this.options.items)] = "show";
		handlers["focusin" + (this.options.items === null ? "" : " " + this.options.items)] = "show";
		this._on(this.element, handlers);		

		if (this.options.preventDefault) {
			if (this.options.items !== null) {
				this.element.on("click.tooltips", this.options.items, function (event) {
					event.preventDefault();
				});
			} else {
				this.element.on("click.tooltips", function (event) {
					event.preventDefault();
				});				
			}
		}

		this._on(document, {
			"keydown" : function (event) {
				if (event.keyCode === 27) { // ESC
					this.hide(event);	
				}
			}
		});	
		if (!$.data(document, "fui.tooltips")) {
			$.data(document, "fui.tooltips", true);
			this._on(document, {
				"click" : function (event) { this.hide(event); },
				"touchend" : function (event) { this.hide(event); }
			});
		}			
	},

	_generateHTML : function () {
		this.uiWidget = $(this.options.html);
		this.uiWidgetBody = this.uiWidget.find(this.options.body);
		this.uiWidget.addClass(this.options.placement).addClass(this.options.tooltipclass);
	},

	_position : function (pos) {
		var offset = this.uiTarget.offset(),
			widgetHeight = this.uiWidget.show().outerHeight(),
			widgetWidth = this.uiWidget.width(),
			top,
			left,
			hasArrow = this.uiArrow.length,
			position = this.options.placement;

		if (pos) { position = pos; }

		switch (position) {
			case "bottom" :
				top = offset.top + this.uiTarget.outerHeight();
				left = offset.left - Math.ceil(widgetWidth / 2) + Math.ceil(this.uiTarget.outerWidth() / 2);
				if (this.options.offsetauto) {
					if (hasArrow) {
						top += this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderBottomWidth"), 10) : this.uiArrow.height();
					}
				}			
				break;

			case "right" :
				top = offset.top - Math.ceil(widgetHeight / 2) + this.uiTarget.height() - Math.ceil(this.uiTarget.height() / 2);
				left = offset.left + this.uiTarget.outerWidth(true);
				if (this.options.offsetauto) {
					if (hasArrow) {
						left += this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderRightWidth"), 10) : this.uiArrow.height();
					}
				}
				break;

			case "left" :
				top = offset.top - Math.ceil(widgetHeight / 2) + this.uiTarget.height() - Math.ceil(this.uiTarget.height() / 2);
				left = offset.left - widgetWidth;
				if (this.options.offsetauto) {
					if (hasArrow) {
						left -= this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderLeftWidth"), 10) : this.uiArrow.height();
					}
				}				
				break;

			default :
				top = offset.top - widgetHeight;
				left = offset.left - Math.ceil(widgetWidth / 2) + Math.ceil(this.uiTarget.outerWidth() / 2);
				if (this.options.offsetauto) {
					if (hasArrow) {
						top -= this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderTopWidth"), 10) : this.uiArrow.height();
					}
				}
		}
		return { top: top + parseFloat(this.options.offsety), left: left + parseFloat(this.options.offsetx) };		
	},

	show : function (event) {
		event.stopPropagation();
		
		this.hide();

		var self = this,
			target = $( event ? event.target : this.element ),
			title,
			content;

		if (this.options.items !== null) {
			target = target.closest(this.options.items);
		} else if (this.options.attr) {
			target = target.closest("[" + this.options.attr + "]");
		} else {
			target = target.closest("[title]");
		}

		// already open
		if ( !target.length ) {
			return;
		}

		this.uiTarget = target;
		
		title = target.attr( "title" );
		if ( title ) {
			target.data( "fui-tooltip-title", title ).removeAttr("title");
		}

		this._generateHTML();
		this.uiArrow = this.uiWidget.find(this.options.arrow);
		
		content = title;
		if (this.options.content !== null) {
			content = this.options.content;
		}
		if (this.options.attr !== null) {
			content = $(target.attr(this.options.attr)).html();
		}
		this.uiWidgetBody.html(content);
		$("body").append(this.uiWidget);

		$.when(this.uiWidget
			.css(this._position())
			.hide()
			.attr({
				"aria-hidden" : true,
				"tabindex" : -1, // Setting tabIndex makes the div focusable
				"role" : "dialog"
			})			
			.stop()
			.fadeIn(this.options.speed))
		.then(function () {
			self.uiWidget.
				attr({
					"aria-hidden" : false,
					"tabindex" : 0
				})
				.focus();
		});

		target.data( "fui-tooltip-open", true );
		
		if (!target.data("bindmouselease")) {
			this._on(target, {
				mouseleave : this.hide
			});
			target.data("bindmouselease", true);
		}
		
		if (this._isOffScreen()) {
			switch (this.options.placement) {
				case "top":
					this.uiWidget.removeClass("top").addClass("bottom").css(this._position("bottom"));
					break;
				case "bottom":
					this.uiWidget.removeClass("bottom").addClass("top").css(this._position("top"));
					break;
				case "right":
					this.uiWidget.removeClass("right").addClass("left").css(this._position("left"));
					break;
				case "left":
					this.uiWidget.removeClass("left").addClass("right").css(this._position("right"));
					break;															
			}
		}
		this._trigger("showcomplete", event);
	},

	hide : function (event) {
		var self = this,
			target,
			ui;

		$(":fui-tooltips").each(function () {
			ui = $(this).data("fui-tooltips");
			target = ui.uiTarget;

			if (target) {
				if (target.data( "fui-tooltip-title" )) {
					target.attr( "title", target.data( "fui-tooltip-title" ) );
				}
		
				target.removeData( "fui-tooltip-open" );
				
				$.when(ui.uiWidget.stop().fadeOut(ui.options.speed)).then(function () {
					$(this).remove();
					ui._trigger("hidecomplete", event);
				});
			}
		});
	},

	_isOffScreen : function () {
		var $window = $(window),
			viewport = {
				top : $window.scrollTop(),
				left : $window.scrollLeft()
			},
			bounds = this.uiWidget.offset();

		viewport.right = viewport.left + $window.width();
		viewport.bottom = viewport.top + $window.height();
		
		bounds.right = bounds.left + this.uiWidget.outerWidth();
		bounds.bottom = bounds.top + this.uiWidget.outerHeight();

		switch (this.options.placement) {
			case "top":
				return bounds.top < viewport.top;
				//break;
			case "right":
				return bounds.right > viewport.right;
				//break;
			/*case "bottom":
				return bounds.bottom > viewport.bottom;
				break;
			case "left":
				return bounds.left < viewport.left;
				break;*/
			default:
				return false;
		}
	},

	destroy : function () {
		$.Widget.prototype.destroy.call( this );	
	}
 });
})(jQuery);