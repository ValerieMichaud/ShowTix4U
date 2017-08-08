/*!
 * popovers v1.10.1590
 *
 * Developer: Son Pham
 * Organization: Bell Customer Experience (BCX)
 *
 * Description: similar to toolTip behavior but can interact with the popover content
 *
 * depends:
 *	- jquery.js 1.10
 *	- jquery-ui-widget.js v1.10 
 *
 * Date: May 28th, 2015 -0500
 */
(function ($) {
$.widget( "fui.popovers", {
	version: "1.10.1590",
		
    // Default options.
    options: {
		appendto : "body",
		offscreen : null,
		speed : 200,
        debounce : 0, 
		placement : "top", //top | bottom | left | right
		trigger : "click", // click | hover | focus
		items : null,
		attr : "data-target",
		autohide : true,
		offsetx : 0,
		offsety : 0,
		offsetauto : true,
		arrow : null,
		arrowcss : null,
		delay : 500,
		zindex : 2,
		showcomplete : $.noop(),
		hidecomplete : $.noop()
    },
 
 	_create: function () {
		var self = this, handlers = {}, target;
		if (this.options.attr !== null) { // Must specify a attr
			this._on(document, {
				"keyup" : function (event) {
					if (event.keyCode == 27) { // ESC
						self.hide();	
					}
				}
			});
			if (!$.data(document, "fui.popovers")) {
				$.data(document, "fui.popovers", true);
				this._on(document, {
					"click" : this.hide,
					"touchend" : this.hide
				});
			}
			handlers[this.options.trigger === "hover" ? "mouseenter" + (this.options.items === null ? "" : " " + this.options.items) : this.options.trigger + (this.options.items === null ? "" : " " + this.options.items)] = "_manageVisibility";
			handlers.keydown = "_manageVisibility";

			this._on(this.element, handlers);
            /*this._on(this.element, {
                mouseleave : function () {
                    if (this.options.debounce > 0) {
                      var self = this;
                      this.sourceMouseOn = false;
                      this.timerLeaveId = window.setTimeout(function () {
                          window.clearTimeout(this.timerLeaveId);
                          if (!self.sourceMouseOn) {
                              self.hide();
                          }
                      }, this.options.debounce);
                    }
                }
            });*/
		}
	},

	_manageVisibility : function (event) {
		var self = this,
            source = $( event ? event.target : this.element );
		if (this.options.items !== null) {
			source = source.closest(this.options.items);
		} else {
			source = source.closest("[" + this.options.attr + "]");
		}

        if (source.length) {
          this.uiTarget = $(source.attr(this.options.attr));
          this.uiSource = source;

          this.uiTarget.on("click touchend", function (event) {
              event.stopPropagation();
          });

          $.data(source.get(0), "fuipopoverstarget", this.uiTarget);

          // add list of active popovers
          if (!this.uiItems) { this.uiItems = $([]); }

          if (!source.attr("data-popover-initialized")) {			
              this.uiItems = this.uiItems.add(source);
              source.attr("data-popover-initialized", true);
              this._on(this.uiTarget, {
                  "click" : function (event) {
                      event.stopPropagation();	
                  }
              });
          }


          if (this.uiTarget.length === 0 || this.uiSource.length === 0) {
              return;	
          } else {
              event.preventDefault();
              event.stopPropagation();			
          }

          if (this.options.debounce === 0) {
              if (this.options.offscreen === null) {
                  if (!this.uiTarget.is(":visible")) {
                      this.show(event);
                  }
              } else {
                  this.show(event);
              }
          } else {
            this.sourceMouseOn = true;

            self.timerId = window.setTimeout(function () {
              window.clearTimeout(self.timerId);
              if (self.sourceMouseOn) {
                  if (self.options.offscreen === null) {
                      if (!self.uiTarget.is(":visible")) {
                          self.show(event);
                      }
                  } else {
                      self.show(event);
                  }
              } else {
                  self.hide();
              }                
            }, self.options.debounce);
          } 
        }
	},

	_isTouch : function () {
		return (typeof window.orientation !== "undefined");
	},

	_setTabIndex : function (element, index) {
		element.attr("tabindex", index);
		return element;
	},

	_position: function (init) {
		var offset = this.uiSource.offset(),
			targetHeight = this.uiTarget.show().outerHeight(),
			targetWidth = this.uiTarget.width(),
			hasArrow = this.uiArrow.length,
			top,
			left;

		switch (this.options.placement) {
			case "bottom" :
				top = (this.options.appendto === null ? 0 : offset.top) + this.uiSource.outerHeight();
				left = this.options.appendto === null ? 0 : offset.left - Math.ceil(targetWidth / 2) + Math.ceil(this.uiSource.outerWidth() / 2);
				if (this.options.offsetauto) {
					if (hasArrow) {
						top += this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderBottomWidth"), 10) : this.uiArrow.height();
					}
				}
				break;

			case "right" :
				top = (this.options.appendto === null ? 0 : offset.top) - Math.ceil(targetHeight / 2) + this.uiSource.height();
				left = this.options.appendto === null ? 0 : offset.left + this.uiSource.outerWidth(true);
				if (this.options.offsetauto) {
					if (hasArrow) {
						left += this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderRightWidth"), 10) : this.uiArrow.height();
					}
				}
				break;

			case "left" :
				top = (this.options.appendto === null ? 0 : offset.top) - Math.ceil(targetHeight / 2) + this.uiSource.height();
				left = this.options.appendto === null ? 0 : offset.left - targetWidth;
				if (this.options.offsetauto) {
					if (hasArrow) {
						left -= this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderLeftWidth"), 10) : this.uiArrow.height();
					}
				}
				break;

			default :
				top = (this.options.appendto === null ? 0 : offset.top) - targetHeight;
				left = this.options.appendto === null ? 0 : offset.left - Math.ceil(targetWidth / 2) + Math.ceil(this.uiSource.outerWidth() / 2);
				if (this.options.offsetauto) {
					if (hasArrow) {
						top -= this.uiArrow.height() === 0 ? parseInt(this.uiArrow.css("borderTopWidth"), 10) : this.uiArrow.height();
					}
				}
		}
		return { top: top + parseFloat(this.options.offsety), left: left + parseFloat(this.options.offsetx) };
	},

	show: function (event) {
		// hide previous popovers
		this.hide();

		var self = this;

		if (this.options.appendto !== null) {
			this.uiTarget.appendTo( this.options.appendto );
		}

		this.uiTarget.addClass(this.options.placement);
		this.originalStyles = this.uiTarget.attr("style");

		if (this.options.arrow !== null) {
			this.uiArrow = this.uiTarget.find(this.options.arrow);
			if (this.uiArrow.length && this.options.arrowcss !== null) {
				this.uiArrow.attr("style", this.options.arrowcss);	
			}
		} else {
			this.uiArrow = $([]);	
		}

		this.uiTarget.css(this._position())
		.css({
			zindex : this.options.zindex
		})
		.attr({
			"aria-hidden" : true,
			"tabindex" : -1, // Setting tabIndex makes the div focusable
			"role" : "dialog"
		});		

		if (this.options.offscreen === null) {
			$.when(this.uiTarget.stop().fadeIn(this.options.speed > 0 ? this.options.speed : 1))
				.then(function () {
					// accessibility
					self.uiTarget.attr({
						"aria-hidden" : false,
						"tabindex" : 0
					})
					.focus();

					self._trigger("showcomplete", event ? event : null, { source : self.element, target : self.uiTarget });
				});
		} else {
			this.uiTarget
				.removeClass(this.options.offscreen)
				.attr({
					"aria-hidden" : false,
					"tabindex" : 0
				})
				.focus();

			this._trigger("showcomplete", event ? event : null, { source : this.element, target : this.uiTarget });
		}
		
		if (this.options.autohide) {
			this.mouseOn = true;
			this._on(this.uiTarget, {
				"mouseleave" : function (event) {
					event.stopPropagation();
					self.mouseOn = false;
					self.timerId = window.setTimeout(function () {
						if (!self.mouseOn) {						
							window.clearTimeout(self.timerId);	
							self.hide();
						}
					}, self.options.delay);
				},
				"mouseenter" : function (event) {
					event.stopPropagation();					
					self.mouseOn = true;					
				}
			});
		}
	},
	
	hide: function () {
		var self = this, instance, outerElement, outerTarget;

        self.sourceMouseOn = false; 
        		
		$(":fui-popovers").each(function () {
			instance = $(this).data("fui-popovers");

			if (typeof instance.uiItems !== "undefined") {
				instance.uiItems.each(function () {
					options = instance.options;			
					if (options.offscreen === null) {
						(function (source, target) {
							if (target && target.is(":visible")) {
								$.when(target.stop().fadeOut(options.speed > 0 ? options.speed : 1))
									.then(function () {
										// accessibility
										target.attr({
											"aria-hidden" : true,
											"tabindex" : -1
										});
	
										instance._trigger("hidecomplete", null, { source : $(source), target : target });
									});
							}
						})(this, $.data(this, "fuipopoverstarget"));	
					} else {
						outerElement = this;
						outerTarget = $.data(this, "fuipopoverstarget");
						if (outerTarget) {
							outerTarget
								.addClass(options.offscreen)
								.attr({
									"aria-hidden" : true,
									"tabindex" : -1
								});						
						}
						self._trigger("hidecomplete", null, { source : $(outerElement), target : outerTarget });
					}
				});
			}
		});
	},

    destroy: function() {
		this.uiTarget.attr("style", this.originalStyles);

        // Call the base destroy function.
        $.Widget.prototype.destroy.call( this );
    }	
});
})(jQuery);