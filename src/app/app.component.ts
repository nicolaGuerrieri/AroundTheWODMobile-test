import { Component, ViewChild } from '@angular/core';
import {Platform, ViewController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen, Device } from 'ionic-native';  
import { Storage } from '@ionic/storage';

 

import { HomePage } from '../pages/home/home';


declare var  cordova:any;

@Component({
  templateUrl: 'app.html',
 
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;
 
  constructor(platform: Platform, public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
		this.storage.set('versionAndroid', Device.version).then(() => {
		  console.log('Name has been set');
		});
		StatusBar.styleDefault();
		Splashscreen.hide();
    });
  }
  
	registerBackButtonListener() {
		
		
	} 
}
