import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AlertController, IonDatetime } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-dukkan-detay',
  templateUrl: 'dukkan-detay.page.html',
  styleUrls: ['dukkan-detay.page.scss']
})
export class DukkanDetayPage {
  shopId: string;
  shop: any;
  user : any;
  shopWork : string;

  constructor(public loadingController: LoadingController,public toastController: ToastController,public route: ActivatedRoute,public router:Router,public http: HttpClient,private alertController: AlertController) { 
  
  }

  doRefresh(event) {
    this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_shop/' + parseInt(this.shopId) ).toPromise()
      .then(data =>{         
        this.shop = data;
        event.target.complete();

        var shopWorkTime = this.shop["calisma_saatleri"];
        var shopWorkTimeSplit = shopWorkTime.split("-");
        var startTime = parseInt(shopWorkTimeSplit[0]);
        var endTime = parseInt(shopWorkTimeSplit[1]);

        var date = new Date();
        var currentTime = date.getHours();

        if(currentTime >= startTime && currentTime <= endTime){
          this.shopWork = "online"
        }
        else{
          this.shopWork = "offline"
        }
     })  
  }

  ionViewWillEnter(){
    this.shopId = this.route.snapshot.params['id']; 

  
    this.http.get( 'http://esnafimapi.azurewebsites.net/api/app/get_shop/' + parseInt(this.shopId) ).toPromise()
      .then(data =>{         
        this.shop = data;

        var shopWorkTime = this.shop["calisma_saatleri"];
        var shopWorkTimeSplit = shopWorkTime.split("-");
        var startTime = parseInt(shopWorkTimeSplit[0]);
        var endTime = parseInt(shopWorkTimeSplit[1]);

        var date = new Date();
        var currentTime = date.getHours();

        if(currentTime >= startTime && currentTime <= endTime){
          this.shopWork = "online"
        }
        else{
          this.shopWork = "offline"
        }
     })   
  }

  async urunuSepeteEkle(orderProduct) {
    this.user = JSON.parse(localStorage.getItem('user'));   
    
    if(this.user == null){
      const toast = await this.toastController.create({
        message: 'Öncelikle giriş yapmalısınız.',
        position : 'bottom',
        color : 'danger',
        duration: 2000
      });

      toast.present();

      return;
    }


    var shopWorkTime = this.shop["calisma_saatleri"];
    var shopWorkTimeSplit = shopWorkTime.split("-");
    var startTime = parseInt(shopWorkTimeSplit[0]);
    var endTime = parseInt(shopWorkTimeSplit[1]);

    var date = new Date();
    var currentTime = date.getHours();

    if(currentTime >= startTime && currentTime <= endTime){
      let product = {};

      this.user = JSON.parse(localStorage.getItem('user'));    
      product["urunId"] = orderProduct.id;
      product["dukkanId"] = this.shopId;
      product["musteriId"] = this.user['id'];
      product["urunAdi"] = orderProduct.urun_adi
      product["urunFiyat"] = orderProduct.fiyat;
  
      const toast = await this.toastController.create({
        message: 'Ürün sepetinize eklendi.',
        position : 'bottom',
        color: 'success',
        duration: 500
      });

      const toast2 = await this.toastController.create({
        message: 'Ürün sepete eklenemedi.Sepetenizde başka dükkanın ürünü var.',
        position : 'bottom',
        color: 'danger',
        duration: 2000
      });
  
      this.http.post<any>('http://esnafimapi.azurewebsites.net/api/app/add_order_product', product).subscribe(data => {
        if(data == 2){
          toast2.present();
        }    
        else{
          toast.present();
        }   
      })
    }
    else{
      const toast2 = await this.toastController.create({
        message: 'Dükkan şuanda mesai saatleri dışında.',
        position : 'bottom',
        color : 'danger',
        duration: 2000
      });

      toast2.present();

    }

   
  }
}
