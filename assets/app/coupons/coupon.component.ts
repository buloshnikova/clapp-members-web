import { Component, Input } from "@angular/core";
import { Coupon } from "./coupon.model";
import { CouponService } from "./coupon.service";

@Component({
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
    `]
})

export class CouponComponent {
    @Input() coupon: Coupon;

    constructor(private couponService: CouponService) {}

    onEdit() {
        this.CouponService.editCoupon(this.coupon);
    }

    onDelete() {
        this.couponService.deleteCoupon(this.coupon)
            .subscribe(
                result => console.log(result)
            );
    }
}