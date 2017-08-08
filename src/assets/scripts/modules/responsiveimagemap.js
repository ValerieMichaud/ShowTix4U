function doInitResponsiveImageMap(){
	if($('img[usemap]').length){
		$('map').imageMapResize();
	}
}