function doInitTypeahead(){
	if($('[data-typeahead]').length){
        $('[data-typeahead]').each(function(){
        	var $this = $(this),
				o_options = $this.data(); // its options
            var source = {
				source: function(term, suggest){
					term = term.toLowerCase();
					var suggestions = [];
					for (i=0;i<window[o_options.typeaheadSource].length;i++)
						if (~window[o_options.typeaheadSource][i].toLowerCase().indexOf(term)) suggestions.push(window[o_options.typeaheadSource][i]);
					suggest(suggestions);
				}
			}
           	$.extend(o_options, source);
			$this.autoComplete(o_options); // we could also pass the options this way : $this.tabs({equalizerItems:'> div'});
        });
	}
}