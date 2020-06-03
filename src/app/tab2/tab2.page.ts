import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  user : object;
  orders : object;
  totalPrice : number;
  shopId : number;
  orderCheck : boolean;
  shop : any;

  constructor(public toastController: ToastController,public route: ActivatedRoute,public router:Router,public http: HttpClient,public alertController: AlertController) { 
  }


  ionViewWillEnter(){
    this.user = JSON.parse(localStorage.getItem('user'));   
    this.totalPrice = 0;

    if(this.user == null){
      this.orders = null;
      this.orderCheck =false;
      return;
    }
    
    this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_order/' + parseInt(this.user['id']) ).toPromise()
      .then(data =>{         
        this.orders = data;

        if(this.orders[0]){
          this.orderCheck = true;
          this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_shop/' + parseInt(this.orders[0]["dukkan_id"]) ).toPromise()
          .then(data =>{         
            this.shop = data;
         })   
        }
        else{
          this.orderCheck = false;

        }

        for (let i in this.orders) {
          this.totalPrice = this.totalPrice + this.orders[i]['urun_fiyat'];
      }  

     })   

  }
  

  async orderApproved(orders){

    const toast2 = await this.toastController.create({
      message: 'Siparişiniz başarılı bir şekilde oluşturuldu.',
      position : 'bottom',
      color : 'success',
      duration: 2000
    });

    if(parseInt(this.shop["minimum_siparis_tutari"]) > this.totalPrice){
      const toast = await this.toastController.create({
        message: 'Sepetiniz minimum sipariş tutarından az.',
        position : 'bottom',
        color : 'danger',
        duration: 2000
      });
      toast.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Ödeme Tipi ',
      inputs: [
        {
          name: 'Nakit',
          type: 'radio',
          label: 'Nakit',
          value: 'Nakit',
          checked: true
        },
        {
          name: 'Kart',
          type: 'radio',
          label: 'Kart',
          value: 'Kart'
        }
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Onayla',
          handler: (value) => {
           

            let product = {};

            this.user = JSON.parse(localStorage.getItem('user'));    
            product["dukkanId"] = orders[0].dukkan_id;
            product["musteriId"] = this.user['id'];
            product["toplamTutar"] = this.totalPrice;   
            product["odemeTipi"] = value;   
            
            this.http.post<any>('http://esnafimapi.azurewebsites.net/api/app/order_approved', product).subscribe(dataId => {
              toast2.present();

             this.router.navigateByUrl("/tabs/siparis-detay/" + dataId);
            })

          }
        }
      ]
    });

    await alert.present();

  }

  goHome(){
    this.router.navigateByUrl("/tabs/tab1");
  }

  goDukkanDetail(){
    this.router.navigateByUrl("/tabs/dukkan-detay/" + this.orders[0]["dukkan_id"]);

  }

  orderProductRemove(id){
    this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/order_update/' + id ).toPromise()
      .then(data =>{         
        this.ionViewWillEnter();
     }) 
  }
}
