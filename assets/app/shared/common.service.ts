import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { ErrorService } from "../errors/error.service";


@Injectable()
export class CommonService {
    categories: any[] = [];

    constructor (private http: Http) {}

    getAllCategories() {

        return this.http.get('http://localhost:3000/category')
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

