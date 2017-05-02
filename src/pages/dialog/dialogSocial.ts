import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Platform, ViewController} from 'ionic-angular';
import {Global} from '../../services/global'; 
import {SocialSharing} from 'ionic-native'; 
import {CittaLuogoService} from '../../providers/citta-luogo-service';
import {FacebookAuth, User, Auth, GoogleAuth } from '@ionic/cloud-angular';
import { Login } from '../ricerca/login';
import { Storage } from '@ionic/storage';
declare var google: any;
declare var cordova:any;
@Component({
  selector: 'dialogSocial',
  templateUrl: 'dialogSocial.html',
  providers: [CittaLuogoService]
})
export class DialogSocial {
	
	public citta:any;
	
	public cittaLuogo: any;
	public address:any;

	public loader;
	@ViewChild('map') mapElement: ElementRef;
	map: any;
    public url  : string = 'www.aroundTheWOD.com';
    public subject  : string = 'AroundTheWOD App';
    public message  : string = 'Hey guys, i use AroundTheWOD app...Share and find new location for your WOD... look on site';
	public image    : string	= 'http://app.nicolaguerrieri.it:3000/images/ket.jpg'; 
	private _isAndroid: boolean;
	private androidVersion: any;
	private _isiOS: boolean; 
	
	public from:String;
		
	constructor(public navCtrl: NavController, public global:Global, public viewCtrl:ViewController, public params:NavParams, public user:User, private modalCtrl: ModalController,  public loading: LoadingController, public googleAuth:GoogleAuth, public platform: Platform, public facebookAuth:FacebookAuth, public auth:Auth, public cittaLuogoService: CittaLuogoService, public storage: Storage) {
		this.from = this.params.get("from");
		this._isAndroid = platform.is('android');
		this._isiOS = platform.is('ios');
		this.androidVersion = 5;
		if(this._isAndroid){
			this.storage.get('versionAndroid').then((va) => {
				this.androidVersion = parseInt(va, 10);
			});
		}
	}
	
	loginGoogle(){
		this.viewCtrl.dismiss("google");
	}
	

	loginSocial(data){
		this.loader = this.loading.create({
			content: 'Please wait...',
		});
		this.loader.present();
		this.cittaLuogoService.loginSocial(data).then(data => {
			if(data){
				//alert(JSON.stringify(data));	
				this.loader.dismiss();
			}
		});
	}
	
	//f33b26b8
	dismiss() {
		this.viewCtrl.dismiss();
	}
	doInstagram() { 
	   this.platform.ready().then(() => {
			SocialSharing.shareViaInstagram(this.message, this.image) 
			 .then((data) => {
				console.log('Shared via shareViaInstagram');
			 }) .catch((err) => {
				alert('Was not shared via Instagram' + err);
			 }); 
		});
   }

   loginInstagram(){  
		this.viewCtrl.dismiss("instagram");
   }
   loginFacebook(){
   		this.viewCtrl.dismiss("facebook");  		
   } 
  
//facebook android
//   ionic plugin add cordova-plugin-facebook4 --save --variable APP_ID="1116576615134600" --variable APP_NAME="aroundTheWodMobile"
//google ios
//   cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID="com.googleusercontent.apps.923547097240-eqmutiom8bvb95u9bjv14vg410cpd5gm"

//	https://forum.ionicframework.com/t/ionic-2-ionic-cloud-auth-google-auth-failing-12501/72967/3	
  
	doShare() {  
		try{
			SocialSharing.share(this.message, this.subject, this.image, this.url).then((data) => {
				 
			}).catch((err) => {
			  alert('Not able to be shared ' + err);
			});
		}catch (e) {
		   alert("error: " + e);
		}
	}
	doFacebook() {
		this.platform.ready().then(() => {
			SocialSharing.shareViaFacebookWithPasteMessageHint(this.message, null, this.url, 'AroundTheWOD app').then((data) =>{
			 
			}).catch((err) =>			{
			   alert('Was not shared via Facebook');
			});
		});
	}
	doTwitter() {
		SocialSharing.shareViaTwitter(this.message, this.image, this.url).then((result) => {
				 
		}).catch((err) =>{
			alert('Not able to be shared via twitter ' + err);
		});
	}
 
	back(){
		if(this.loader){
			this.loader.dismiss();
		}
	    this.navCtrl.pop();
	}
}
