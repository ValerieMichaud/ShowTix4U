var scrollScript = {};
scrollScript.scrollTimeout;
scrollScript.throttle = 50;

function initScroll() {
    // if ($(window).width() < 992) return false;

    var aChildren = $(".showtix-navigation").find("a:not([data-anchor='#'])");
    var aArray = [];
    for (var i=0; i < aChildren.length; i++) {
        var aChild = aChildren[i];
        var ahref = $(aChild).attr('data-anchor');
        aArray.push(ahref);
    }

    $(window).scroll(function(){
        if (!scrollScript.scrollTimeout) {
            scrollScript.scrollTimeout = setTimeout(function () {

                var windowPos = $(window).scrollTop();
                var windowHeight = $(window).height();
                var docHeight = $(document).height();

                for (var i=0; i < aArray.length; i++) {
                    var theID = aArray[i];
                    var div = $("[data-anchor-id='" + theID + "']");
                    var divPos = div.offset().top;
                    var divHeight = div.height();

                    if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
                        $("a[data-anchor='" + theID + "']").addClass("is-active");
                    } else {
                        $("a[data-anchor='" + theID + "']").removeClass("is-active");
                    }
                }

                if(windowPos + windowHeight == docHeight) {
                    if (!$(".showtix-navigation").find("li.contact a").hasClass("is-active")) {
                        var navActiveCurrent = $(".nav-active").attr('data-anchor');
                        $("[data-anchor-id='" + navActiveCurrent + "']").removeClass("is-active");
                        $(".showtix-navigation").find("li.contact a").addClass("is-active");
                    }
                }
                scrollScript.scrollTimeout = null;
            }, scrollScript.throttle);
        }
    });
}