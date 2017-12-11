exports.browse = function(url, domainWhitelist, exitOnDone, closeSplashScreenOnLoad, success, error) {
    var domainWhiteListPattern = "http(s*):\\\/\\\/(" + domainWhitelist.join("|") + ")";
    var inAppBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no,fullscreen=yes,hardwareback=yes');
    window.open = cordova.InAppBrowser.open;
    inErrorState = false;

    document.addEventListener('online', function () {
        // If you're currently in an error state, reload the current page.
        if ( inErrorState ) {
            inAppBrowser.executeScript({
                code: 'location.reload();'
            });
        }
    }, false);

    inAppBrowser.addEventListener('loaderror', function () {
        inErrorState = true;

        if ( typeof navigator !== "undefined" && typeof navigator.splashscreen !== "undefined" ) {
            navigator.splashscreen.show();
        }

        // If you're online and still got an error, just go back.
        if ( navigator.connection.type != Connection.NONE ) {
            inAppBrowser.executeScript({
                code: 'window.history.back();'
            });
        } else {
            // Otherwise we'll wait to come back online and then reload.
            window.plugins.toast.showLongBottom('Sorry, we couldn\'t load that. Please check your Internet connection and we\'ll try again when you\'re online.')
        }
    });

    inAppBrowser.addEventListener('loadstart', function () {
        // If you're currently in an error state, hide the error message.
        if ( inErrorState ) {
            window.plugins.toast.hide();
        }

        // No longer in error state until we fail again.
        inErrorState = false;
    });

    inAppBrowser.addEventListener('loadstop', function () {
        // If you're currently in an error state, or you should close the splash screen on first load, close it now.
        if ( typeof navigator !== "undefined" && typeof navigator.splashscreen !== "undefined" ) {
            navigator.splashscreen.hide();
        }

        // No longer in an error state.
        inErrorState = false;

        // Override tabs with local links.
        inAppBrowser.executeScript({
            code:   ' \
                var domainWhiteListPattern = new RegExp("' + domainWhiteListPattern + '"); \
                \
                function shouldBeInternal(url, target) { \
                    return (typeof target === "undefined" || (typeof target === "string" && target !== "_self")) && typeof url === "string" && (url.startsWith("#") || url.startsWith("/") || url.match(domainWhiteListPattern)); \
                } \
                \
                function noTab() { \
                    var elements = document.querySelectorAll("a[target=\\\"_blank\\\"], form[target=\\\"_blank\\\"]"); \
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
                (function(open) { \
                    XMLHttpRequest.prototype.open = function () { \
                        this.addEventListener("readystatechange", function () { \
                            if (this.readyState == 4) { \
                                noTab(); \
                            } \
                        }, false); \
                        open.apply(this, arguments); \
                    }; \
                })(XMLHttpRequest.prototype.open);'
        });
    });

    // If you're supposed to exit the app when heading back to home screen, do so.
    if ( typeof exitOnDone === "boolean" && exitOnDone ) {
        inAppBrowser.addEventListener('exit', function () {
            window.close();
        });
    }
};
