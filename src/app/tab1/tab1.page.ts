import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  adresFiltresi : boolean;
  tumDukkanlar : any;

  doRefresh(event) {
    this.http.get ( 'http://esnafimapi.azurewebsites.net/api/app/get_all_shops')
    .subscribe (data => {  
    this.tumDukkanlar = data;  
    event.target.complete();
    })  
  }
  
  constructor(private route:Router,public http: HttpClient) {  
    this.http.get ( 'http://esnafimapi.azurewebsites.net/api/app/get_all_shops')
  .subscribe (data => {  
  this.tumDukkanlar = data;  

  })  
  }

  

  goDukkanDetay (shop){
    this.route.navigateByUrl("/tabs/dukkan-detay/" + shop["id"]);

  }
  adresSec(){
    if(this.adresFiltresi == true)
    this.adresFiltresi = false;
    else  
    this.adresFiltresi = true;
  }
}
