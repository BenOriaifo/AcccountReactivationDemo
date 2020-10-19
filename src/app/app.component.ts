import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QuickServices';
  isHomePage:boolean = true;

  constructor(private router: Router){}
  goToHome(route) {
    this.router.navigate([route])
  }

//   constructor(private router : Router){
    
//   }
//   ngOnInit() {
//     this.isHomePage = true;
//   }
//  goToHomePage(){
//     this.router.navigate(['home']);
//   }
}


