/* 
*   Name: modal v1.0
*   Date: 27-01-2016
*   Description: This function is used to extend the Bootstrap Modal v3.0.3
*
*   Parameters:
*   effect (string) : Name of the effect to use : slideDown, slideLeft, slideRight, pop, fadeIn
*   duration (number) : Number of seconds the effect should last
*   top (number) : Position from the top
*   width (number) : Custom width
*   height (number) : Custom height
*   title (string) : Custom title
*   header (boolean) : If you want to hide the header
*   footer (boolean) : If you want to hide the footer
*   url (string) : Path to the content you want to load in AJAX
*  
*   Dependencies:
*   - jquery (latest version)
*
*   Usage:
*   To use this function, simply call it with : $('#myModal').modal(options);
*/

(function($) {
    'use strict';

    // save the original plugin
    var _parent = $.fn.modal;

    // define your own constructor
    var Modal = function(element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$dialog = this.$element.find('.modal-dialog')
        this.$modalbody = this.$element.find('.modal-body')
        this.$title = this.$element.find('.modal-title')
        this.$header = this.$element.find('.modal-header')
        this.$footer = this.$element.find('.modal-footer')

        _parent.Constructor.apply(this, arguments);
    };

    // set custom default options
    Modal.DEFAULTS = $.extend({}, _parent.Constructor.DEFAULTS, {});

    // extend the prototype for your plugin from the original plugin
    Modal.prototype = $.extend({}, _parent.Constructor.prototype);

    // define a method for easy access to parent methods
    Modal.prototype.parent = function() {
        var args = $.makeArray(arguments),
            method = args.shift();
        _parent.Constructor.prototype[method].apply(this, args)
    };

    // override the show method to demonstrate
    Modal.prototype.show = function(_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', {
            relatedTarget: _relatedTarget
        })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function() {
			var transition = $.support.transition && that.$element.hasClass('fade')

			if (!that.$element.parent().length) {
				that.$element.appendTo(document.body) // don't move modals dom position
			}

			that.$element.show()

			if (transition) {
				that.$element[0].offsetWidth // force reflow
			}

			// Effects
			if (that.options.effect) {
				that.$element.addClass(that.options.effect)
			}

			// Duration
			if (that.options.duration) {
				that.$dialog.css('transition-duration', that.options.duration + 's')
			}

			/* Absolute
			if (that.options.absolute) {
				that.$element.addClass('absolute')
			}*/

			// Top
			if (that.options.top) {
				that.$dialog.css('margin-top', that.options.top)
			}

			// Width
			if (that.options.width) {
				that.$dialog.width(that.options.width)
			}

			// Height
			if (that.options.height) {
				var bodyheight = that.options.height - that.$header.height()
				that.$modalbody.css('height', bodyheight)
			}

			// Title
			if (that.options.title) {
				that.$title.text(that.options.title)
			}

			// Header
			if (that.options.header == false) {
				that.$header.hide();
			}

			// Footer
			if (that.options.footer == false) {
				that.$footer.hide();
			}

			// If data-url
			if(that.options.url){
				that.$modalbody.load(that.options.url);
			}

			that.calculateMaxHeight()


			that.$element
				.addClass('in')
				.attr('aria-hidden', false)

			that.enforceFocus()

			var e = $.Event('shown.bs.modal', {
				relatedTarget: _relatedTarget
			})

			transition ?
				that.$element.find('.modal-dialog') // wait for modal to slide in
				.one($.support.transition.end, function() {
					that.$element.focus().trigger(e)
				})
				.emulateTransitionEnd(300) :
				that.$element.focus().trigger(e)
		})
		//this.parent('show');
    };

    Modal.prototype.hide = function(e) {
        var that = this;
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.modal')

        /* $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideModal, this))
            .emulateTransitionEnd(300) :
          this.hideModal()*/

        setTimeout(function() {
            that.hideModal()
        }, 400)
    }

    Modal.prototype.calculateMaxHeight = function() {
        if (this.$modalbody.height() > $(window).height()) {
            var bodyheight = $(window).height() + this.$header.height() + 3 * this.$element.find('.modal-dialog').position().top - parseInt(this.$modalbody.css('padding-top')) - parseInt(this.$modalbody.css('padding-bottom'));
            this.$modalbody.css('height', bodyheight)
        }
    };

    // override the actual jQuery plugin method
    $.fn.modal = function(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.modal'),
                options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('bs.modal', (data = new Modal(this, options)));
            }
            if (typeof option === 'string') {
                data[option](_relatedTarget);
            } else if (options.show) {
                data.show(_relatedTarget);
            }
        });
    };

    // override the plugin constructor
    $.fn.modal.Constructor = Modal;

    // override the plugin no-conflict method
    $.fn.modal.noConflict = function() {
        $.fn.modal = _parent;
        return this;
    };
})(jQuery);


// ajax support
$(function() {
    /* $(window).resize(function() {
    waitForFinalEvent(function(){
    $.fn.modal.Constructor.prototype.calculateMaxHeight()
    }, 200, "calculateMaxHeight");
    });*/

    // Events
    $('.modal').on('show.bs.modal', function(e) {
        // do something...
    })
    $('.modal').on('shown.bs.modal', function(e) {
        // do something...
    })
    $('.modal').on('hide.bs.modal', function(e) {
        // do something...
    })
    $('.modal').on('hidden.bs.modal', function(e) {
        // do something...
    })
    $('.modal').on('loaded.bs.modal', function(e) {
        // do something...
    })
})