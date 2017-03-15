exports.browse = function(url, domainWhitelist, success, error) {
    var domainWhiteListPattern = "http(s*):\\\/\\\/(" + domainWhitelist.join("|") + ")";
    var inAppBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no,fullscreen=yes,hardwareback=yes');
    window.open = cordova.InAppBrowser.open;
    inAppBrowser.addEventListener('loadstop', function () {
        inAppBrowser.executeScript({
            code:   ' \
                var domainWhiteListPattern = new RegExp("' + domainWhiteListPattern + '"); \
                \
                function noTab() { \
                    var links = document.links, i, length; \
                    for (i = 0, length = links.length; i < length; i++) { \
                        if (typeof links[i].target == "string" && links[i].target == "_blank" && typeof links[i].href == "string" && (links[i].href.startsWith("#") || links[i].href.match(domainWhiteListPattern))) { \
                            links[i].target = "_self"; \
                        } \
                    } \
                } \
                \
                noTab(); \
                \
                var _windowOpen = window.open; \
                window.open = function(url, target, features) { \
                    if (typeof target == "string" && target == "_blank" && typeof url == "string" && (url.startsWith("#") || url.match(domainWhiteListPattern))) { \
                        _windowOpen(url, "_self", features); \
                    } else { \
                        _windowOpen(url, target, features); \
                    } \
                }; \
                \
                var _XMLHttpRequest = XMLHttpRequest; \
                XMLHttpRequest = function() { \
                    var xhr = new _XMLHttpRequest(); \
                    \
                    var _onload = xhr.onload; \
                    \
                    xhr.onload = function() { \
                        noTab(); \
                        \
                        if ( _onload != null && typeof _onload != "undefined" ) { \
                            \
                            return _onload.apply(this, arguments); \
                        } \
                    }; \
                    \
                    return xhr; \
                };'
        });
    });
};
