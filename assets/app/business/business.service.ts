import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Business } from "./business.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class BusinessService {
    private business: Business;

    constructor(private http: Http, private errorService: ErrorService) {}

    getBusinessInfo() {
        return this.http.get('http://localhost:3000/business/')
            .map((response: Response) => {
                const business = response.json.obj;
                return business;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    updateBusinessInfo(business: Business) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.patch('http://localhost:3000/business/' + business_id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}