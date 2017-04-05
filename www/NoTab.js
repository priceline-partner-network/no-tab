exports.browse = function(url, domainWhitelist, exitOnDone, closeSplashScreenOnLoad, success, error) {
    var domainWhiteListPattern = "http(s*):\\\/\\\/(" + domainWhitelist.join("|") + ")";
    var inAppBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no,fullscreen=yes,hardwareback=yes');
    window.open = cordova.InAppBrowser.open;

    inAppBrowser.addEventListener('loadstop', function () {
        if ( typeof closeSplashScreenOnLoad === "boolean" && closeSplashScreenOnLoad && typeof navigator !== "undefined" && typeof navigator.splashscreen !== "undefined" ) {
            navigator.splashscreen.hide();
        }

        inAppBrowser.executeScript({
            code:   ' \
                var domainWhiteListPattern = new RegExp("' + domainWhiteListPattern + '"); \
                \
                function shouldBeInternal(url, target) { \
                    return (typeof target === "undefined" || (typeof target === "string" && target !== "_self")) && typeof url === "string" && (url.startsWith("#") || url.startsWith("/") || url.match(domainWhiteListPattern)); \
                } \
                \
                function noTab() { \
                    var elements = document.querySelectorAll("a[target=\"_blank\"], form[target=\"_blank\"]"); \
                    Array.prototype.forEach.call(elements, function(element, i){ \
                        if (shouldBeInternal((element.action ? element.action : element.href), element.target)) { \
                            element.target="_self"; \
                        } \
                    }); \
                } \
                \
                noTab(); \
                \
                var _windowOpen = window.open; \
                window.open = function(url, target, features) { \
                    if (shouldBeInternal(url, target)) { \
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

    if ( typeof exitOnDone === "boolean" && exitOnDone ) {
        inAppBrowser.addEventListener('exit', function () {
            window.close();
        });
    }
};
