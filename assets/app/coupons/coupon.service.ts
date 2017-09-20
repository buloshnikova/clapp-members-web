import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Coupon } from "./coupon.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class CouponService {
    private coupons: Coupon[] = [];
    couponIsEdit = new EventEmitter<Coupon>();
    private _storedCategories: any = [];
    private _storedLocations: any = [];
    private _business_id = '';

    constructor(private http: Http, private errorService: ErrorService){
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
        return this.http.post('http://localhost:3000/coupon' + token, body, {headers: headers})
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
        return this.http.get('http://localhost:3000/coupon/' + business_id + token)
            .map((response: Response) => {
                const coupons = response.json().obj;
                this.coupons = coupons;
                return coupons;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    // CATEGORIES
    getCategoriesByBusinessId() {

        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.get('http://localhost:3000/category/' + business_id)
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
        return this.http.get('http://localhost:3000/location/' + business_id)
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

    // UPDATE COUPON
    updateCoupon(coupon: Coupon) {
        const body = JSON.stringify(coupon);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch('http://localhost:3000/coupon/' + coupon._id + token, body, {headers: headers})
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

        return this.http.delete('http://localhost:3000/coupon/' + coupon._id + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

}