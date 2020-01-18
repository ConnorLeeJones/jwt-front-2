import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';


@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loading = false;
    returnUrl: string;
    error: string;
    user: User = new User();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit() {
        this.loading = true;
        this.authenticationService.login(this.user.username, this.user.password)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.log('er')
                    this.error = error;
                    this.loading = false;
                });
    }
}
