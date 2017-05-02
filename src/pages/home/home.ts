import { Component } from '@angular/core';
import {CittaLuogoService} from '../../providers/citta-luogo-service';
import { NavController, ModalController, LoadingController, Platform, ViewController } from 'ionic-angular';
import {Global} from '../../services/global';
import { Ricerca } from '../ricerca/ricerca';
import { AutocompletePage } from './autocomplete';
import { DialogSocial } from '../dialog/dialogSocial';

import { Success } from '../dialog/success';
declare var cordova:any;
declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [CittaLuogoService]
})
export class HomePage {
	splash= true;
	address;
	public allSearchPlace:any;
	plat: any;
	navOptions = {
		animate: true,
		animation: 'wp-transition'
	};
	constructor( public navCtrl: NavController, public global:Global,  public viewCtrl:ViewController, public cittaLuogoService: CittaLuogoService, private modalCtrl: ModalController, public loading: LoadingController, public plt: Platform) {
		this.address = {
		  place: 'bologna'
		}; 
	}
	info(){ 
		let modal = this.modalCtrl.create(DialogSocial, {"from": "info"});
		modal.present();
	}
	
	dismiss() {
		this.viewCtrl.dismiss();
	}
	ionViewDidLoad() {
		setTimeout(() => this.splash = false, 4000);
	}
	showAddressModal () {
		let modal = this.modalCtrl.create(AutocompletePage);
		let me = this;
		modal.onDidDismiss(data => { 
			if(data != null){
				this.allSearchPlace =data;
				this.address.place = data.description;
				this.ricerca();
			}else{
				return;
			}
		});
		modal.present();
	}
	showAddressModal2 () {
	let modal = this.modalCtrl.create(Success, {"from": "login"});
		modal.onDidDismiss(data => {
		    
	    });
		modal.present();
	}
	geolocalizza(){
		try{
			let loader = this.loading.create({
				content: 'Please wait...',
			});
			loader.present();
			this.cittaLuogoService.localizza(loader).then(data => {
				if(data != "error"){
					if(data.address_components[2]){
						this.address.place = data.address_components[2].long_name;
						this.allSearchPlace = data;
						this.ricerca();
					}
				}else{
					alert("No data found");
				}
				loader.dismiss();
			});
		} catch (e) {
		   alert("error" + e);
		}
	}
	
	chiamaLocalizzazione(loader){
	
		this.cittaLuogoService.localizza(loader).then(data => {
			if(data.address_components[2]){
				this.address.place = data.address_components[2].long_name;
				this.ricerca();
				loader.dismiss();
			}else{
				alert("No data found");
			}
		});
	}
	ricerca(){

		if(this.address.place != ""){
			this.navCtrl.push(Ricerca,{
				citta: this.address.place,
				allSearchPlace: this.allSearchPlace
			}, this.navOptions);
		}else{
			console.log("bloccato");
			return;
		}
	}
}