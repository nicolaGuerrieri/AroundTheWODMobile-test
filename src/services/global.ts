import { Injectable } from '@angular/core'; 
import { Platform  } from 'ionic-angular';
@Injectable()
export class Global {
	public title:string = "AroundTheWOD App";
	private _isAndroid: boolean;
	private androidVersion: any;
	private _isiOS: boolean; 
	public language: any;
   public preUrl:string;
 	constructor(public platform: Platform) {
		if(navigator.language){
			if(navigator.language.indexOf("it") > -1){
				this.language = "it";
			}else{
				this.language= "en";
			}
		}
		
		//alert(this.language);
		this._isAndroid = platform.is('android');
		this._isiOS = platform.is('ios');
 	
		if (this.platform.is('core')) {
			this.preUrl = 'provaV2/';
		}else{
			this.preUrl = 'http://app.nicolaguerrieri.it:3002/';
		}
	}
	
	openSocial(social){
		if(social == 'facebook'){
			window.open('https://www.facebook.com/aroundthewodapp/?ref=aymt_homepage_panel');
		}else{
			window.open('https://www.instagram.com/aroundthewodapp/?hl=it');
		}
	}
}