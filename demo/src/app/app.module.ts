import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { states } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UIRouterModule } from "@uirouter/angular";
import { componentsList } from './components';

@NgModule({
  declarations: [AppComponent].concat(componentsList),
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    UIRouterModule.forRoot({ states: states, useHash: true })
  ],
  providers: [/*GithubService*/],
  bootstrap: [AppComponent]
})
export class AppModule {}