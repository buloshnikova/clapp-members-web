import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { Coupon } from "./coupon.model";
import { ErrorService } from "../errors/error.service";
import { GlobalVariable } from '../path/global';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class CouponService {
    private baseApiUrl = GlobalVariable.BASE_API_URL;
    private coupons: Coupon[] = [];
    couponIsEdit = new EventEmitter<Coupon>();
    couponsChanged = new EventEmitter<any>();
    private _storedCategories: any = [];
    private _storedLocations: any = [];
    private _business_id = '';

    constructor(private http: Http, private errorService: ErrorService, private router: Router, private authService: AuthService ){
        this._business_id = localStorage.getItem('businessId');
    }

    // ADD NEW COUPON
    addCoupon(coupon: Coupon){
        coupon.business_id = this._business_id;
        const body = JSON.stringify(coupon);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post(this.baseApiUrl + 'coupon' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const coupon = new Coupon(
                    result.obj._id,
                    result.obj.business._id,
                    result.obj.business.title,
                    result.obj.title,
                    result.obj.barcode_img,
                    result.obj.coupon_type,
                    result.obj.description,
                    result.obj.exp_date,
                    result.obj.start_date,
                    result.obj.img_type,
                    result.obj.logo,
                    result.obj.categories,
                    result.obj.locations
                );

                this.coupons.push(coupon);
                return coupon;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    // GET ALL COUPONS BY BUSINESS
    getCoupons() {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.get(this.baseApiUrl + 'coupon/' + business_id + token)
            .map((response: Response) => {
                const coupons = response.json().obj;
                this.coupons = coupons;
                return coupons;
            })
            .catch((error: Response) => {
                if (error.status == 405) {
                    this.router.navigate(['/auth', 'signin']);
                } else if (error.status === 401) {
                    this.authService.logout();
                }
                else {
                    this.errorService.handleError(error.json());
                    return Observable.throw(error.json());
                }
            });
    }

    // CATEGORIES
    getCategoriesByBusinessId() {

        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.get(this.baseApiUrl + 'category/' + business_id)
            .map((response: Response) => {
                this.setStoredCategories(response.json().obj);
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });

    }

    getStoredCategories() {
        // copy the return array to keep original object untouched
        let copy = JSON.parse(JSON.stringify(this._storedCategories));
        return copy;
    }

    setStoredCategories(value: any[]) {
        this._storedCategories = value;
        //this._storedCategories = Object.assign({}, value);
    }

    // LOCATIONS
    getLocationsByBusinessId() {
        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.get(this.baseApiUrl + 'location/' + business_id)
            .map((response: Response) => {
                this.setStoredLocations(response.json().obj);
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    getStoredLocations() {
        // copy the return array to keep original object untouched
        let copy = JSON.parse(JSON.stringify(this._storedLocations));
        return copy;
    }

    setStoredLocations(value: any[]) {
        this._storedLocations = value;
    }

    // EDIT COUPON
    editCoupon(coupon: Coupon) {
        this.couponIsEdit.emit(coupon);
    }

    // RELOAD COUPONS
    reloadCoupons(obj: any) {
        this.couponsChanged.emit(obj);
    }

    // UPDATE COUPON
    updateCoupon(coupon: Coupon) {
        const body = JSON.stringify(coupon);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch(this.baseApiUrl + 'coupon/' + coupon._id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    // DELETE COUPON
    deleteCoupon(coupon: Coupon) {
        this.coupons.splice(this.coupons.indexOf(coupon), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        return this.http.delete(this.baseApiUrl + 'coupon/' + coupon._id + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

}