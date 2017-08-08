/*
*   Name: form v1.0
*   Date: 03-03-2016
*   Description: This function is used to create custom form elements.
*
*   Parameters:
*	- custom-form-active-class (string) : class for active state
*   - custom-form-disabled-class (string) : class for disabled state
*   - custom-form-focus-class (string) : class for focus state
*   - custom-form-show-item (string) : element to show when selected
*
*   Dependencies:
*   - jquery (latest version)
*
*/

// Strings for accessibility
o_formErrorsLabels = {
    fr: {
        s_wrongFormat: "Mauvais format.",
        s_required: "Champs requis."
    },
    en: {
        s_wrongFormat: "Wrong format.",
        s_required: "Required field."
    }
}

o_formErrors = o_formErrorsLabels.en;
if(MY_PROJECT_NAME.s_language.indexOf('fr') == 0){
    o_formErrors = o_formErrorsLabels.fr;
}

;(function ( $, window, document, undefined ) {
    // create the defaults once
    var pluginName = "forms",
    	defaults = {
			formActiveClass: MY_PROJECT_NAME.s_namespacePrefix + 'active',
			formDisabledClass: MY_PROJECT_NAME.s_namespacePrefix + 'disabled',
            formFocusClass: MY_PROJECT_NAME.s_namespacePrefix + 'focus',
            formShowItem: null
		};

	// create methods that will be accessible from outside
    var methods = {
    	init: function(element, options) {
        	this.setChecked(element, options);
        },
        setChecked: function(element, options) {
        	$(element).parent().find("." + options.formActiveClass).removeClass(options.formActiveClass);
            $(element).parent().find('input').each(function(){
                if ($(this).is(':checked')) {
                    $(this).parent().addClass(options.formActiveClass);
                }
            });
            this.checkShow(element, options);
            return false;
        },
        setFocus: function(element, options) {
            $("." + options.formFocusClass).removeClass(options.formFocusClass);
            $(element).each(function(){
                $(this).parent().addClass(options.formFocusClass);
            });
            return false;
        },
        checkShow: function(element, options) {
            if(options.formShowItem){
                $(options.formShowItem).removeClass(MY_PROJECT_NAME.s_namespacePrefix + 'to-offscreen');
            } else {
                $(element).parents('fieldset').find('[data-form-show-item-js]').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'to-offscreen')
            }
            return false;
        },
        validateForm: function(element, options) {
            $(element).find(MY_PROJECT_NAME.s_namespaceClass + 'form-error').removeClass('bws-form-error');
            $(element).find(MY_PROJECT_NAME.s_namespaceClass + 'form-error-message').remove();
            var requiredError = '<span class="' + MY_PROJECT_NAME.s_namespaceClass + 'form-error-message">' + o_formErrors.s_required + '</span>',
                wrongFormatError = '<span class="' + MY_PROJECT_NAME.s_namespaceClass + 'form-error-message">' + o_formErrors.s_wrongFormat + '</span>',
                $requiredElements = $(element).find("[data-required]");
            $requiredElements.each(function(){
                var $this = $(this);
                //if not visible, dont validate
                if(!$this.parents().hasClass('bws-to-hide')){
                    // text field, chck only if empty
                    if($this.attr('type') == 'text'){
                        var val = $this.val();
                        if(val == ""){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this);
                        } else {
                            if($this.data('required-format') != ""){
                                switch($this.data('required-format')){
                                    case 'postalcode':
                                    var patternPostalCode = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i;
                                    if(!patternPostalCode.test(val)){
                                        $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                                        $(wrongFormatError).insertAfter($this);
                                    }
                                    break;

                                    case 'telephone':
                                    var patternTel = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
                                    if(!patternTel.test(val)){
                                        $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                                        $(wrongFormatError).insertAfter($this);
                                        return false;
                                    }
                                    break;

                                    case 'email':
                                    var patternEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    if(!patternEmail.test(val)){
                                        $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                                        $(wrongFormatError).insertAfter($this);
                                        return false;
                                    }
                                    break;   
                                }
                            }
                        }
                    }
                    // email field, chck if empty and right format
                    if($this.attr('type') == 'email'){
                        var val = $this.val();
                        if(val == ""){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this);
                        } else {
                            var patternEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(!patternEmail.test(val)){
                                $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                                $(wrongFormatError).insertAfter($this);
                                return false;
                            }
                        }
                    }
        
                    // tel field, chck if empty and right format
                    if($this.attr('type') == 'tel'){
                        var val = $this.val();
                        if(val == ""){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this);
                        } else {
                            var patternTel = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
                            if(!patternTel.test(val)){
                                $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                                $(wrongFormatError).insertAfter($this);
                                return false;
                            }
                        }
                    }
        
                    // select field, check if option is selected
                    if($this.find('option').size() > 0){
                        var val = $this.find('option:selected').val();
                        if(val == ""){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this);
                        }
                    }
                    // input file, check if empty
                    if($this.attr('type') == 'file'){
                        var val = $this.val();
                        if(val == ""){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form'));
                        }
                    }
                    // checkbox field, check if checked
                    if($this.attr('type') == 'checkbox'){
                        if(!$this.prop('checked')){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form ' + MY_PROJECT_NAME.s_namespaceClass + 'form-body'));
                        }
                    }
                    
                    // radio field, check if checked
                    if($this.attr('type') == 'radio'){
                        var radioChecked = false;
                        var name = $this.attr('name');
                        $('[name="' + name + '"]').each(function(){
                            if($(this).is(':checked')){
                                radioChecked = true;
                                return false;
                            }
                        });
                        if(!radioChecked){
                            if(!$this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').hasClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error')){
                                $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                                $(requiredError).insertAfter($this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form ' + MY_PROJECT_NAME.s_namespaceClass + 'form-body'));
                            }
                        }
                    }
                    // textarea, check if empty
                    if($this.is("textarea")){
                        var val = $this.val();
                        if(val == ""){
                            $this.parents(MY_PROJECT_NAME.s_namespaceClass + 'form').addClass(MY_PROJECT_NAME.s_namespacePrefix + 'form-error');
                            $(requiredError).insertAfter($this);
                        }
                    }
                }
            });

            if($(element).find(MY_PROJECT_NAME.s_namespaceClass + 'form-error').size() == 0){
                $(element).submit();
            } else {
                $('html, body').scrollTop($(element).find(MY_PROJECT_NAME.s_namespaceClass + 'form-error').eq(0).offset().top - 100, 500);
            }
            return false;
        }
    };

    $.fn.forms = function(methodOrOptions, parameters) {
    	// if there's an object or some function that has been passed
     	if(methodOrOptions !== "undefined"){
     		// if methodOrOptions exist in the list of plugin methods, example 'destroy'
			if ( methods[methodOrOptions] ) {
				var options = $.extend( {}, defaults, parameters); // we take parameters and merge them with the default options
				return methods[methodOrOptions](this, options); // we call the method and pass the element and its options
			} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
				// Default to "init"
				var options = $.extend( {}, defaults, methodOrOptions); // we take parameters and merge them with the default options
				methods.init( this, options ); // we call init and pass the element and its options
			} else {
				$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.' + pluginName );
			}
     	} else {
        	var options = defaults; // options are the default ones
            return methods.init( this, options ); // we call init and pass the element and its options
     	}
	};
})( jQuery, window, document );

// if we need to have a callback when the equalizer is done
$(document)
	.on('forms.done', '[data-forms]', function() {
		//console.log('done')
	});

// function to call from init or after ajax call to init the custom form elements
function doInitForm(){
	//create custom select
	$(MY_PROJECT_NAME.s_namespaceClass + 'form-select-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-select, ' + MY_PROJECT_NAME.s_namespaceClass + 'form-radio-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-radio, ' + MY_PROJECT_NAME.s_namespaceClass + 'form-checkbox-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-checkbox').each(function(){
		var $this = $(this),
			options = $this.data(); // its options
		$this.forms(options); // we could also pass the options this way : $this.equalizer({equalizerItems:'> div'});
	})

	$(MY_PROJECT_NAME.s_namespaceClass + 'form-radio-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-radio, ' + MY_PROJECT_NAME.s_namespaceClass + 'form-checkbox-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-checkbox').change(function(){
		var $this = $(this);
		$this.forms('setChecked', $(this))
	});
	$(MY_PROJECT_NAME.s_namespaceClass + 'form-radio-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-radio input, ' + MY_PROJECT_NAME.s_namespaceClass + 'form-checkbox-custom ' + MY_PROJECT_NAME.s_namespaceClass + 'input-checkbox input').on('focus', function(){
		var $this = $(this);
		$this.forms('setFocus', $(this))
	});
	$(MY_PROJECT_NAME.s_namespaceClass + 'input-radio, ' + MY_PROJECT_NAME.s_namespaceClass + 'input-checkbox').change(function(){
		var $this = $(this),
			options = $this.data(); // its options
		$this.forms('checkShow', options)
	});
	$('[data-form-validation]').each(function(){
		$(this).submit(function(){
			formVal = $(this).forms('validateForm');
			if(!formVal){
				return false;
			}
			return false;
		});
	});
}
