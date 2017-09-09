function typeAhead() {
    $.typeahead({
        input: '.showtix-search-input',
        minLength: 1,
    	offset: false,
        order: "asc",
        dynamic: true,
        delay: 500,
    	cancelButton: true,
    	loadingAnimation: true,
    	filter: false,
    	maxItem: 15,
    	hint: true,
        backdrop: {
            "background-color": "#fff"
        },
        template: function (query, item) {
     
            var color = "";
            if (item.status === "owner") {
                color = "#ff1493";
            }
     
            return '' +
                '<div class="poster">' +
                    '<img src="https://www.showtix4u.com/graphics_globals/graphics_posters.php?id={{event_id}}">' +
                "</div>" +
                "<div class='venue'>" +
                '<span class="event_name">{{event_name}} <span style="color: ' + color + ';">({{client_name}})</span></span>' +
                '<span class="venue_name">({{venue_name}})</span>' +
                "</div>" +
            ""
        },
        emptyTemplate: "No result for '{{query}}'",
        source: {
            events: {
                display: "event_name",
                href: "http://www.showtix4u.com/index.php?submit=Search+for+Events&current_client=040000691231{{client_id}}",
                ajax: function (query) {
                    return {
                        type: "GET",
                        url: "http://www.showtix4u.com/popup/data.php",
                        path: "data.events",
                        data: {
                            q: "{{query}}"
                        },
                        callback: {
                            done: function (data) {
                                for (var i = 0; i < data.data.events.length; i++) {
                                    if (data.data.events[i].event_name === 'running-coder') {
                                        data.data.events[i].status = 'owner';
                                    } else {
                                        data.data.events[i].status = 'contributor';
                                    }
                                }
                                return data;
                            }
                        }
                    }
                }
     
            }
        },
        callback: {
            onClick: function (node, a, item, event) {
     
                // You can do a simple window.location of the item.href
                // alert(JSON.stringify(item));
     
            },
            onSendRequest: function (node, query) {
                console.log('request is sent')
            },
            onReceiveRequest: function (node, query) {
                console.log('request is received')
            }
        },
        debug: true
    });

    // Form submit
    $('#form_event_search').submit(function(ev) {
        ev.preventDefault(); // to stop the form from submitting
        window.location.href = "https://www.showtix4u.com/?query_search=" + $("#showtix-search-input").val();
    });
}