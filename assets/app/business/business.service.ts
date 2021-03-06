import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { Business } from "./business.model";
import { ErrorService } from "../errors/error.service";
import { AuthService } from "../auth/auth.service";
import { GlobalVariable } from '../path/global';

@Injectable()
export class BusinessService {
    private baseApiUrl = GlobalVariable.BASE_API_URL;
    private business: Business;

    constructor(private http: Http, private errorService: ErrorService, private authService: AuthService, private router: Router ) {}

    getBusinessInfo() {
        //const body = JSON.stringify(business);
        //const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.get(this.baseApiUrl + 'business/'+ business_id + token)
            .map((response: Response) => {
                const business = response.json().obj;
                return business;
            })
            .catch((error: Response) => {
                console.log(error.status);
                if (error.status == 405) {
                    this.router.navigate(['/auth', 'signin']);
                } else if (error.status === 401) {
                    this.authService.logout();
                }
                else {
                    this.errorService.handleError(error.json());
                    return Observable.throw(error.json());
                }

                return Observable.throw(error.json());
            });
    }

    updateBusinessInfo(business: Business) {
        const body = JSON.stringify(business);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.patch(this.baseApiUrl + 'business/' + business_id + token, body, {headers: headers})
            .map((response: Response) => {
                const business = response.json().obj;
                return business;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }


}