import {Component} from '@angular/core';

@Component({
  template: require("./template.pug")(),
  styles: [require('./styles.styl').toString()]
})
export class AboutComponent {
}