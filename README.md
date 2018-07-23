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