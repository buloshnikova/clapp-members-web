import { Component, Input } from "@angular/core";
import { Coupon } from "./coupon.model";
import { CouponService } from "./coupon.service";

@Component({
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.css']
})

export class CouponComponent {
    @Input() coupon: Coupon;

    constructor(private couponService: CouponService) {}

    onEdit() {
        this.couponService.editCoupon(this.coupon);
    }

    onDelete() {
        this.couponService.deleteCoupon(this.coupon)
            .subscribe(
                result => console.log(result)
            );
    }
}