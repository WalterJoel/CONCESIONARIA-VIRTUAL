import {Component, OnInit} from '@angular/core';
// import Equiviewer from '../../../dist/equiviewer';
// require
// var Equiviewer = require('../../../dist').Equiviewer;
// var Equiviewer = require('../../../dist').Equiviewer;
// var eqMod = require('../../../dist/index.js');
var eqMod = require('../../..');
var Equiviewer = eqMod.Equiviewer;

@Component({
  template: require('./app.component.pug')(),
  selector: 'app',
})
export class AppComponent implements OnInit {

  suggestMsg: boolean;

  constructor () {
    this.suggestMsg = false;
  }

  ngOnInit () {
    // Setup equiviewer
    var eqviewerDOM = document.getElementById('eqviewer');
    var eqviewer = new Equiviewer(eqviewerDOM);
    // Extract search params
    var searchParams: any = {};
    window.location.search.substring(
      1, window.location.search.length
    ).split('&').forEach(function (p) {
      searchParams[p.split('=')[0]] = p.split('=')[1];
    });
    // Show suggest msg
    if (!searchParams.imgUrl) {
      this.suggestMsg = true;
      return;
    }
    // Update image
    eqviewer.updateTHREEViewImage(
      searchParams.imgUrl,
      () => {
        eqviewerDOM.style.opacity = '1';
        console.log('Image updated');
      }
    )
  }
  
}