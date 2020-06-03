import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-siparis-detay',
  templateUrl: 'siparis-detay.page.html',
  styleUrls: ['siparis-detay.page.scss']
})
export class SiparisDetayPage {
  orderId: number;
  orders: object;
  shopName : string;
  totalPrice : number;
  orderCheck : boolean;
  orderApproved : any;

  constructor(public toastController: ToastController,public route: ActivatedRoute,public router:Router,public http: HttpClient,private alertController: AlertController) { 
    
  }

  
ionViewWillEnter(){
  this.orderId = this.route.snapshot.params['id']; 
  this.totalPrice = 0;

  this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_product_order/' + this.orderId ).toPromise()
  .then(data =>{         
    this.orderApproved = data;   

  }) 

  this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_approved_orders/' + this.orderId ).toPromise()
  .then(data =>{         
    this.orders = data;
    
    this.shopName = this.orders[0]["dukkan_adi"];

    for (let i in this.orders) {
      this.totalPrice = this.totalPrice + this.orders[i]['urun_fiyat'];
    }

  })   

}

goDukkanDetail(){
  this.router.navigateByUrl("/tabs/dukkan-detay/" + this.orders[0]["dukkan_id"]);

}

}
