import { Component, OnInit } from "@angular/core";

import { Coupon } from "./coupon.nodel";
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

    ngOnInit() {
        this.couponService.getCoupons()
        .subscribe(
            (coupons: Coupon[]) => {
                this.coupons = coupons;
            }
        );
    }
}