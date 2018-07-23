var THREE = require('three');

export class Equiviewer {
    
    constructor (containerElem) {
        this.userIsInteracting = false;
        this.containerElem = containerElem;
        this.threeElems = {};
        this.threeVars = {};
        this.setupContainer();
        this.setupTHREEElements();
        this.setupListeners();
    }

    setupContainer () {
        var pos = this.containerElem.style.position;
        if (pos != 'absolute' && pos != 'relative') {
            this.containerElem.style.position = 'relative';
        }
    }

    setupTHREEElements () {
        // Init THREE elems
        THREE.ImageUtils.crossOrigin = '';
        var domElem = this.containerElem;
        var camera = new THREE.PerspectiveCamera(
            70, domElem.clientWidth / domElem.clientHeight, 1, 1100
        );
        var scene = new THREE.Scene();
        var sphereMesh = new THREE.Mesh();
        var renderer = new THREE.WebGLRenderer();
        // Setup base THREE elems
        camera.target = new THREE.Vector3( 0, 0, 0 );
        sphereMesh.geometry = new THREE.SphereGeometry( 500, 60, 40 );
        sphereMesh.material = new THREE.MeshBasicMaterial({
            color: 0x333333
        });
        sphereMesh.material.side = THREE.DoubleSide;
        sphereMesh.scale.x = -1;
        scene.add( sphereMesh );
        // Setup renderer
        renderer.setSize( domElem.clientWidth, domElem.clientHeight );
        renderer.render( scene, camera );
        // Append renderer to container elem
        domElem.appendChild( renderer.domElement );
        // Attach to threeElems attribute
        this.threeElems.camera = camera;
        this.threeElems.scene = scene;
        this.threeElems.sphereMesh = sphereMesh;
        this.threeElems.renderer = renderer;
        this.threeVars.clientWidth = domElem.clientWidth;
        this.threeVars.clientHeight = domElem.clientHeight;
    }

    setupListeners () {
        var domElem = this.containerElem;
        // On resize event
        window.addEventListener('resize', () => {
            this.resizeTHREEView();
        });
        // On mouse down
        domElem.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            var mX = ev.offsetX;
            var mY = ev.offsetY;
            this.startTHREEViewInteraction(mX, mY);
        });
        // On touch start
        domElem.addEventListener('touchstart', (ev) => {
            ev.preventDefault();
            this.startTHREEViewInteraction(
                ev.changedTouches[0].pageX,
                ev.changedTouches[0].pageY
            );
        });
        // On mouse move
        domElem.addEventListener('mousemove', (ev) => {
            ev.preventDefault();
            var mX = ev.offsetX;
            var mY = ev.offsetY;
            this.updateTHREEViewInteractionState(mX, mY);
        });
        // On touch move
        domElem.addEventListener('touchmove', (ev) => {
            ev.preventDefault();
            this.updateTHREEViewInteractionState(
                ev.changedTouches[0].pageX,
                ev.changedTouches[0].pageY
            );
        });
        // On mouse up
        domElem.addEventListener('mouseup', (ev) => {
            ev.preventDefault();
            this.stopTHREEViewInteraction();
        });
        // On touch end
        domElem.addEventListener('touchend', (ev) => {
            ev.preventDefault();
            this.stopTHREEViewInteraction();
        });
    }

    resizeTHREEView () {
        var nw = domElem.clientWidth;
        var nh = domElem.clientHeight;
        this.threeElems.renderer.setSize( nw, nh );
        this.threeElems.camera.aspect = nw/nh;
        this.threeElems.camera.updateProjectionMatrix();
        this.threeElems.renderer.render(
            this.threeElems.scene,
            this.threeElems.camera
        );
    }

    startTHREEViewInteraction (posX, posY) {
        this.threeVars.userIsInteracting = true;
        this.threeVars.onPointerDownPointerX = posX;
        this.threeVars.onPointerDownPointerY = posY;
        // May have issues
        this.threeVars.onPointerDownLon = this.threeVars.lon || 0;
        this.threeVars.onPointerDownLat = this.threeVars.lat || 0;
        this.renderTHREEView();
    }

    updateTHREEViewInteractionState (posX, posY) {
        if ( !this.threeVars.userIsInteracting ) return;
        this.threeVars.lon = ( this.threeVars.onPointerDownPointerX - posX ) * 0.1 + this.threeVars.onPointerDownLon;
        this.threeVars.lon = ( this.threeVars.lon + 360 )%360;
        this.threeVars.lat = ( posY - this.threeVars.onPointerDownPointerY ) * 0.1 + this.threeVars.onPointerDownLat;
        this.renderTHREEView();
        this.threeVars.alpha = this.threeVars.lon;
        this.threeVars.beta = this.threeVars.lat;
    }

    stopTHREEViewInteraction () {
        this.threeVars.userIsInteracting = false;
        this.threeVars.alpha = this.threeVars.lon;
        this.threeVars.beta = this.threeVars.lat;
        this.renderTHREEView();
    }

    renderTHREEView () {
        var lat = Math.max( - 85, Math.min( 85, this.threeVars.lat ) );
        var phi = THREE.Math.degToRad( 90 - this.threeVars.lat );
        var theta = THREE.Math.degToRad( this.threeVars.lon );
        this.threeElems.camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        this.threeElems.camera.target.y = 500 * Math.cos( phi );
        this.threeElems.camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
        this.threeElems.camera.lookAt( this.threeElems.camera.target );
        this.threeElems.renderer.render( this.threeElems.scene, this.threeElems.camera );    
    }

    updateTHREEViewImage (imgUrl, callback) {
        if (!imgUrl) return;
        // THREE.ImageUtils.crossOrigin = 'use-credentials';
        THREE.ImageUtils.crossOrigin = '';
        this.threeElems.sphereMesh.material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imgUrl, null, () => {
                this.startTHREEViewInteraction(
                    Math.floor(this.threeVars.clientWidth/2),
                    Math.floor(this.threeVars.clientHeight/2)
                );
                setTimeout(() => {
                    callback();
                    this.startTHREEViewInteraction(
                        Math.floor(this.threeVars.clientWidth/2),
                        Math.floor(this.threeVars.clientHeight/2)
                    );
                    this.updateTHREEViewInteractionState(
                        Math.floor(this.threeVars.clientWidth/2),
                        Math.floor(this.threeVars.clientHeight/2)
                    );
                    this.stopTHREEViewInteraction();
                }, 100);
            })
        });
        this.threeElems.sphereMesh.material.side = THREE.DoubleSide;
    }

}