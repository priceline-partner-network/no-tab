# NoTab

Want to create an in app browser in your Cordova app, but `target="_blank"` links keep opening outside your app? Trash them with NoTab.

Just specify the URL you want to browse to, and a list of regexes for domain names whose links you want to keep in that in app browser, even if they specificy `target="_blank"` in the DOM.

NoTab will even watch for AJAX responses and update your links after your DOM changes.

## Usage

```
notab.browse("https://www.google.com", [".*google\\\.com", "www\\\.gmail\\\.com"]);
```