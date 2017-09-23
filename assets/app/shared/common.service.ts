import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { ErrorService } from "../errors/error.service";
import { GlobalVariable } from '../path/global';


@Injectable()
export class CommonService {
    private baseApiUrl = GlobalVariable.BASE_API_URL;
    categories: any[] = [];

    constructor (private http: Http) {}

    getAllCategories() {

        return this.http.get(this.baseApiUrl + 'category')
            .map((response: Response) => {
                const categories = response.json().obj;
                return categories;
            })
            .catch((error: Response) => {
                console.log(error.status);
                this.errorService.handleError(error.json());
                if (error.status === 401) {
                    this.authService.logout();
                }
                return Observable.throw(error.json());
            });
    }
}

