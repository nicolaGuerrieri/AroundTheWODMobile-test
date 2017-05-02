import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Platform, ViewController} from 'ionic-angular';
import {Global} from '../../services/global'; 
import {SocialSharing} from 'ionic-native'; 
import { FacebookAuth, User, Auth, GoogleAuth } from '@ionic/cloud-angular';
import { Login } from '../ricerca/login';

declare var google: any;
declare var cordova:any;
@Component({
  selector: 'success',
  templateUrl: 'success.html',
})
export class Success {
	
	 
	public from:String;
		
	constructor(public navCtrl: NavController, public global:Global, public viewCtrl:ViewController, public params:NavParams, public user:User, private modalCtrl: ModalController, public plt: Platform) {
		this.from = this.params.get("from");
	}
	
	dismiss() {
		this.viewCtrl.dismiss();
	}
	 
	back(){
	    this.navCtrl.pop();
	}
}
