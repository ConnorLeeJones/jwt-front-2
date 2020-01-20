import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import {CookieService} from 'ngx-cookie-service';
import { Token } from '../models/token';
import { JwtHelperService } from '@auth0/angular-jwt';


const helper = new JwtHelperService();


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private token: Token;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        // this.cookieService.set('test', 'test');

        // this.token = helper.decodeToken(this.cookieService.get('token'))

        // this.findUserByUsername(this.token.sub).subscribe(user => 
        //     {
        //     this.currentUser = user;
        //     this.currentUser.token = this.token.sub;
        //     });

    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        console.log('login'); 
        return this.http.post(`${environment.apiUrl}/signin`, {username, password}, {
            responseType: 'text'
          })
            // .pipe(map(user => {
            //     // store user details and jwt token in local storage to keep user logged in between page refreshes
            //     console.log(user)
            //     console.log("XXXXX")
            //     // localStorage.setItem('currentUser', JSON.stringify(user));
            //     // this.currentUserSubject.next(user);
                
            //     this.token = user;
            //     this.cookieService.set('token', user);
            //     return user;
            // }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    signup(user: User){
        return this.http.post(`${environment.apiUrl}/signup`, user)
    }



    findUserByUsername(username: string): Observable<User>{
        return this.http.get<User>(`${environment.apiUrl}/user/${username}`);
    }

}