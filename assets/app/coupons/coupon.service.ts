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

    constructor(private http: Http, private errorService: ErrorService){}

    addCoupon(coupon: Coupon){
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

    getCoupons() {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const business_id = localStorage.getItem('businessId')
            ? localStorage.getItem('businessId')
            : '';
        return this.http.get('http://localhost:3000/coupon/' + business_id + token)
            .map((response: Response) => {
                const coupon = response.json().obj;
                let transformedCoupons: Coupon[] = [];
                for (let coupon of coupons) {
                    transformedCoupons.push(new Coupon(
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
                        result.obj.locations )
                    );
                }
                this.coupons = transformedCoupons;
                return transformedCoupons;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    editCoupon(coupon: Coupon) {
        this.couponIsEdit.emit(coupon);
    }

    updateCoupon(coupon: Coupon) {
        const body = JSON.stringify(coupon);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch('http://localhost:3000/coupon/' + coupon.coupon_id + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    deleteCoupon(coupon: Coupon) {
        this.coupons.splice(this.coupons.indexOf(coupon), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        return this.http.delete('http://localhost:3000/coupon/' + coupon.coupon_id + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}