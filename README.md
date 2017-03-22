# NoTab

Want to create an in app browser in your Cordova app, but `target="_blank"` links keep opening outside your app? Trash them with NoTab.

Just specify the URL you want to browse to, and a list of regexes for domain names whose links you want to keep in that in app browser, even if they specificy `target="_blank"` in the DOM.

NoTab will even watch for AJAX responses and update your links after your DOM changes.

## Usage

Launch the in app browser by providing a URL to browse to and an array of regular expressions of URLs to open in the in app browser, even if they specificy `target="_blank"` in the DOM.

```
notab.browse("https://www.google.com", [".*google\\\.com", "www\\\.gmail\\\.com"]);
```

Optionally, you can tell the app to quit when attempting to browse back beyond the original page.

```
notab.browse("https://www.google.com", [".*google\\\.com", "www\\\.gmail\\\.com"], true);
```