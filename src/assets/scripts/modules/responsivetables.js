function doInitResponsiveTables(){
	if($('table').length){
		$('table').each(function(){
            $(this).wrap('<div class="' + MY_PROJECT_NAME.s_namespaceClass + 'table-responsive"></div>');
        });
	}
}