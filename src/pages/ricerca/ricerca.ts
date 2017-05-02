import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Platform, ActionSheetController, Content} from 'ionic-angular';
import {Global} from '../../services/global';
import {CittaLuogoService} from '../../providers/citta-luogo-service';
import { Geolocation, SocialSharing} from 'ionic-native';
import { AutocompletePage } from '../home/autocomplete';
import { Detail } from '../ricerca/detail';
import { Organizzazioni } from '../ricerca/organizzazioni';
import { DialogSocial } from '../dialog/dialogSocial';
import { FacebookAuth, User, Auth } from '@ionic/cloud-angular';
import { Login } from '../ricerca/login';

declare var google: any;
declare var cordova:any;
@Component({
  selector: 'ricerca',
  templateUrl: 'ricerca.html',
  providers: [CittaLuogoService]
})
export class Ricerca {
	
	public citta:any;
	@ViewChild(Content) content: Content;
	public cittaLuogo: any;
	public address:any;
	public cercaOrga;
	public allSearchPlace:any;
	public loader;
	@ViewChild('map') mapElement: ElementRef;
	map: any;
    public url  : string = 'www.aroundTheWOD.com';
    public message  : string = 'hey guys, i share new location on AroundTheWOD app...look here ' + this.url;
	
	navOptions = {
		animate: true,
		animation: 'wp-transition'
	};
	public listaAttivita: any;

		
	constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public global:Global, public params:NavParams, public user:User, public cittaLuogoService: CittaLuogoService, private modalCtrl: ModalController,  public loading: LoadingController, public plt: Platform, public facebookAuth:FacebookAuth, public auth:Auth) {
		this.loadAttivita();
		this.cittaLuogo = [];
		this.citta= params.get("citta"); 
		this.allSearchPlace = params.get("allSearchPlace");
		this.loadCity(this.citta);
		this.address = {
			place: this.citta
		}; 
		
	}
	loadAttivita(){
		this.cittaLuogoService.loadAttivita().then(data => {
			this.listaAttivita = data;
		});
	}
	presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
		  title: 'Menu',
		  buttons: [
			//{			  text: 'Add your new place',			  role: 'addPlace',			  handler: () => {				this.addPlace();			  }			},
			{
			  text: 'Search your place',
			  handler: () => {
				this.showAddressModalR();
			  }
			},{
			  text: 'Locate your position',
			  role: 'locate',
			  handler: () => {
				this.geolocalizza();
			  }
			},{
			  text: 'Share your experience',
			  role: 'Share',
			  handler: () => {
				this.share();
			  }
			},{
			  text: 'Friends',
			  role: 'Friends',
			  handler: () => {
				this.organizzazioni();
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	
	share(){
		let modal = this.modalCtrl.create(DialogSocial, {"from": "social"});
		modal.present();
	}

	
	addPlace(){
		this.navCtrl.push(Detail,{
			idLuogo: -1
		}, this.navOptions);
	} 
	
	doShare() {
		var full_name;
		try{
			console.log('do FB');
			//this.facebookAuth.login().then(() => {
			//this.auth.login('facebook').then(() => {
			//	  this.navCtrl.setRoot(Login);
			
			SocialSharing.share(this.message, null, null, this.url).then((data) => {
				alert(data);
			}).catch(() => {
			  // Error!
			});
			 
			
		}catch (e) {
		   alert("nic" + e);
		}
	}
	 
	ngAfterViewInit() {
		try {
		   this.loadMapWithPlace(null);
		}
		catch (e) {
		  alert("error" + e);
		}
		
	}
	scrollToBottom() {
		this.content.scrollToBottom();
	}
	
	//load with position
	loadGeolocalization(){
		var geocoder;
		geocoder = new google.maps.Geocoder();
		Geolocation.getCurrentPosition().then((position) => {
		console.log(position);
		let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		
		geocoder.geocode({'latLng': latLng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var add= results[0].address_components;
					let city=add[3];
				} else  {
					alert("address not found");
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
		let mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
 
			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		}, (err) => {
		  console.log(err);
		});
	 
	} 
	
	getMapElement(){
		return this.mapElement;
	}

	geolocalizza(){
		this.loader = this.loading.create({
			content: 'Please wait...',
		});
		this.loader.present();
		this.cittaLuogoService.localizza(this.loader).then(data => {
			if(data != "error"){
				if(data.formatted_address != null){
					this.address.place = data.formatted_address;
				}else if(data.address_components[1]){
					this.address.place = data.address_components[1].long_name;
				}else if(data.address_components[2]){
					this.address.place = data.address_components[2].long_name;
				}
				console.log(data)
				this.allSearchPlace = data;
				this.ricerca(); 
			}
			this.loader.dismiss();
		});
		
	}
	

	loadMapWithPlace(cittaResult){
		try {
			var localizzaRicerca;
			let mapOptions;
			let latLng;
			
			console.log("loadMap " + this.address.place);
			
			var elem = this.mapElement;
			var geocoder =  new google.maps.Geocoder();
			geocoder.geocode( { 'address': this.address.place}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
				
					localizzaRicerca=  results[0];
					
					latLng = new google.maps.LatLng(localizzaRicerca.geometry.location.lat(), localizzaRicerca.geometry.location.lng());
					mapOptions = {
					  center: latLng,
					  zoom: 12,
					  mapTypeId: google.maps.MapTypeId.ROADMAP
					}
					this.map = new google.maps.Map(elem.nativeElement, mapOptions);
					
					var marker = new google.maps.Marker({
						position: latLng,
						map: this.map,
						title: localizzaRicerca.formatted_address
					});
					
					var infowindow = new google.maps.InfoWindow({
						content: "<span>" + localizzaRicerca.formatted_address + "</span>"
					});
					google.maps.event.addListener(marker, 'click', function() {
					  infowindow.open(this.map,marker);
					});
					if(cittaResult != null){
						cittaResult.forEach((cittaLuogoItem: any) => {
							latLng = new google.maps.LatLng(cittaLuogoItem.latitudine, cittaLuogoItem.longitudine); 

							// Creating a marker and putting it on the map
							var marker = new google.maps.Marker({
								position: latLng,
								map: this.map,
								title: cittaLuogoItem.nome
							});
							latLng = null;	
							var infowindow = new google.maps.InfoWindow({
								content: "<span>" + cittaLuogoItem.nome + "</span>"
							});
							google.maps.event.addListener(marker, 'click', function() {
							  infowindow.open(this.map, marker);
							});
							
						});
					}
					
				
				}
			});
		} catch (e) {
		   alert("error: " + e);
		}
	}
	
	
	showAddressModalR () {
		let modal = this.modalCtrl.create(AutocompletePage);
		let me = this;
		modal.onDidDismiss(data => {
			if(data != null){
				console.log(data);
				this.address.place = data.description;
			}else{
				return;
			}
			this.allSearchPlace = data;
			this.ricerca();
		});
		modal.present();
	}
	ricerca(){
		try{
			if(this.address.place != ""){
				this.navCtrl.push(Ricerca,{
					citta: this.address.place,
					allSearchPlace: this.allSearchPlace
				}, this.navOptions);
			}else{
				console.log("bloccato");
				return;
			}
		}catch (e) {
		   alert("error: " + e);
		}
			
	}
	organizzazioni(){
		try{
			if(this.address.place != ""){
				this.navCtrl.push(Organizzazioni,{
					citta: this.cercaOrga
				}, this.navOptions);
			}else{
				console.log("bloccato");
				return;
			}
		}catch (e) {
		   alert("error: " + e);
		}
			
	}
	
	selectPlace(idPlace){
		try{
			if(this.address.place != ""){
				this.navCtrl.push(Detail,{
					idLuogo: idPlace
				}, this.navOptions);
			}else{
				console.log("bloccato");
				return;
			}
		}catch (e) {
		   alert("error: " + e);
		}
	}
	
	loadCity(cittaP){
		try{
			//troppi if
			console.log(this.allSearchPlace);
			if(this.allSearchPlace && this.allSearchPlace.types){
							console.log("ma passa di qua");		

				if(this.allSearchPlace.types[0] != 'locality' && this.allSearchPlace.types[0] != 'administrative_area_level_2'){
					console.log("ma passa di qua");		
					if(this.allSearchPlace.terms){
						if(this.allSearchPlace.types[0] == 'street_address'){
							//ho anche il civico al numero [1]
							cittaP = this.allSearchPlace.terms[2].value;
						}else{
							cittaP = this.allSearchPlace.terms[1].value;
						}
					}else{		
						if(this.allSearchPlace.address_components){		
							console.log("certo");
							cittaP = this.allSearchPlace.address_components[2].long_name;
						}
					}
				}else{
					cittaP = cittaP.split(",")[0];
					console.log(cittaP + "certo");				
				}
			}
			if(cittaP == null){
				cittaP = this.loadGeolocalization();
			}else{
				this.cercaOrga = cittaP;
				this.cittaLuogoService.load(cittaP).then(data => {
					this.cittaLuogo = data;
					this.loadMapWithPlace(this.cittaLuogo);
					 
				});
			}
		}catch (e) {
		   alert("error: " + e);
		}
	}
	
		
	back(){
		if(this.loader){
			this.loader.dismiss();
	    }
		this.navCtrl.popToRoot();
	}
}
