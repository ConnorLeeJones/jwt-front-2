import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import {CookieService} from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from 'src/app/models/token';



@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loading = false;
    returnUrl: string;
    error: string;
    user: User = new User();
    token: Token;
    currentUser: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private cookieService: CookieService
    ) { 
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit() {
        const helper = new JwtHelperService();
        this.loading = true;
        console.log(this.returnUrl);
        this.authenticationService.login(this.user.username, this.user.password)
            // .subscribe(data => {
            //     this.token = data;
            //     this.cookieService.set('token', data)
            //     console.log(data);
            // })
        .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.cookieService.set('token', data)
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.log('er')
                    this.error = error;
                    this.loading = false;
                }),
                (console.log(helper.decodeToken(this.cookieService.get('token')))),
                (this.token = helper.decodeToken(this.cookieService.get('token'))),
                (this.authenticationService.findUserByUsername(this.token.sub)).subscribe(
                    data => {
                        this.currentUser = data;
                    }
                ),
                (console.log(this.currentUser))
                ;
    }
}
