import { Component, defineInjectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service'


@Component({
  selector: 'app-Login',
  templateUrl: 'Login.page.html',
  styleUrls: ['Login.page.scss'],
})
export class Login {
  registerContent : boolean;
  userData : any;

  constructor(private route: Router, public authService: AuthService) {
   
  }

  registerPage() {
    this.registerContent = true;
  }

  loginPage() {
    this.registerContent = false;
  }

  ngOnit(){
  }

  goHome(){
    this.route.navigateByUrl("/tabs/tab1");
  }
}


