import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { Business } from "../business/business.model";
import { ErrorService } from "../errors/error.service";
import { GlobalVariable } from '../path/global';

@Injectable()

export class AuthService {
    private baseApiUrl = GlobalVariable.BASE_API_URL;

    constructor(private http: Http, private errorService: ErrorService, private router: Router ){}

    signup(business: Business) {
        const body = JSON.stringify(business);
        const headers = new Headers({'Content-Type': 'application/json'});
        // TODO: use global parameter domain url
        return this.http.post(this.baseApiUrl + 'business/signup', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    signin(business: Business) {
        const body = JSON.stringify(business);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.baseApiUrl + 'business/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/auth', 'signin']);
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}