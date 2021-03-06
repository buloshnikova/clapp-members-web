import { Component, OnInit } from "@angular/core";

import { Coupon } from "./coupon.model";
import { CouponService } from "./coupon.service";

@Component({
    selector: 'app-coupon-list',
    template: `
        <div class="col-md-8 col-md-offset-2">
            <app-coupon
                    [coupon]="coupon"

                    *ngFor="let coupon of coupons"></app-coupon>
        </div>
    `
})

export class CouponListComponent implements OnInit {
    coupons: Coupon[];

    constructor(private couponService: CouponService) {}

    getCoupons() {
        this.couponService.getCoupons()
            .subscribe(
                (coupons: Coupon[]) => {
                    this.coupons = coupons;
                    console.log(coupons);
                }
            );
    }

    ngOnInit() {

        this.getCoupons();

        this.couponService.couponsChanged.subscribe(
            (obj: any) => this.getCoupons()

        );

        //this.couponService.getCoupons()
        //.subscribe(
        //    (coupons: Coupon[]) => {
        //        this.coupons = coupons;
        //    }
        //);
    }
}