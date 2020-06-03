import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public user : any;
  orderApproved : object;
  orders: object;
  orderDetailCheck : boolean;
  orderApprovedCheck : boolean;

  constructor(public toastController: ToastController,public route: ActivatedRoute,public router:Router,public http: HttpClient,public alertController: AlertController) { 
    this.user = JSON.parse(localStorage.getItem('user'));    
    if(this.user == null){
      this.router.navigateByUrl("/login");
      return;
    }

}
ngOnit(){

}

doRefresh(event) {
  this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_orders_approved/' + parseInt(this.user['id']) ).toPromise()
  .then(data =>{         
    this.orderApproved = data;
    event.target.complete();

    if(this.orderApproved[0]){
    this.orderApprovedCheck = true; 
    }
    else{
      this.orderApprovedCheck = false; 
    }
 })   
}

ionViewWillEnter(){
  this.user = JSON.parse(localStorage.getItem('user'));  
  
  if(this.user == null){
    this.router.navigateByUrl("/login");
    return;
  }

  this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_orders_approved/' + parseInt(this.user['id']) ).toPromise()
    .then(data =>{         
      this.orderApproved = data;

      if(this.orderApproved[0]){
      this.orderApprovedCheck = true; 
      }
      else{
        this.orderApprovedCheck = false; 
      }
   })   

}

async orderDetail(order) {

  this.router.navigateByUrl("/tabs/siparis-detay/" + order["id"]); 

}

exit(){
  localStorage.removeItem('user');
  this.router.navigateByUrl("/tabs/tab1"); 
}

goHome(){
  this.router.navigateByUrl("/tabs/tab1"); 
}

}