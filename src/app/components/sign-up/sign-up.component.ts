import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';



@Component({
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
  loading = false;
  error: string;
  user: User;
  success = false;
  returnUrl: string;


  constructor(private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute,
    ) {
    this.user = new User();
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  onSubmit() {
    if (this.user.password != this.user.token){
      this.error = 'Passwords must match';
    } else {
      this.error = '';

    this.loading = true;
    this.authenticationService.signup(this.user).pipe(first())
    .subscribe(
        data => {
          this.success = true;
          this.loading = false;
        },
        error => {
            console.log('er')
            this.error = error;
            this.loading = false;
        });
      
  }
}

}
