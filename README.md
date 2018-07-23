# Equiviewer

A simple module to render equirectangular images

## Install
```bash
npm install --save equiviewer
```

## Usage
```javascript
// Import library
var Equiviewer = require('equiviewer').Equiviewer;

// Initialize Equiviewer
var eqviewer = new Equiviewer(
    document.getElementById('myelement')
);

// Update Equiviewer image
eqviewer.updateTHREEViewImage(
    'http://myurl..',
    () => {
        console.log('Image updated');
    }
)
```

## Embed viewer

You can just embed the viewer and use it wherever you want.
Just place this url https://equiviewer.herokuapp.com/ and add the query param imgUrl with the image link you want to render

(Don't forget to allow CORS)

example:
https://equiviewer.herokuapp.com/?imgUrl=http://blog.topazlabs.com/wp-content/uploads/2013/06/Screen-shot-2013-06-17-at-3.37.16-PM.png
