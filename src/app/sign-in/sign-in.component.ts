import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Correct path to AuthService

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loginError = false; // for error popup purpose 

  constructor(
    private authService: AuthService,
    private router: Router
  ) {} 

  login(username: string, password: string): void {
    this.authService.login(username, password)
      .subscribe(
        (response: any) => {
          const token = response; 
          if (token) {
            localStorage.setItem('token', token);
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Token not found in response:', response);
            this.loginError = true;
            this.validateData(username,password);
          }
        },
        error => {
          console.error('Login failed:', error);
          this.loginError = true;
          this.validateData(username,password);
        }
      );
  }


  validateData(username:string,password:string):void{
    //validate credentials from pouchdb from auth.service.ts
    this.authService.validatePouchDb(username, password)
    .then((valid: boolean) => {
      if (valid) {
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Invalid credentials');
        this.loginError = true;
      }
    })
    .catch(error => {
      console.error('Error validating credentials:', error);
      this.loginError = true;
    });
  }
  
}
