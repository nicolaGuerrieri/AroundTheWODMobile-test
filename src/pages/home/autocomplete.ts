import { Component, NgZone, ViewChild } from '@angular/core';

import { ViewController, Searchbar, Platform} from 'ionic-angular';
declare var google: any;

@Component({
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();
  private _isAndroid: boolean;
  private _isiOS: boolean; 
  @ViewChild('citta') searchbar:Searchbar;
  
  constructor (public viewCtrl: ViewController, private zone: NgZone, public platform: Platform,) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this._isAndroid = platform.is('android');
    this._isiOS = platform.is('ios');
  }
	
  dismiss() {
    this.viewCtrl.dismiss();
  }

   ngOnInit() {
	this.searchbar.setFocus();
  }
  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }
  
  
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query}, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
		if(predictions){
			predictions.forEach(function (prediction) {
				me.autocompleteItems.push(prediction);
			});
		}
      });
    });
  }
}
