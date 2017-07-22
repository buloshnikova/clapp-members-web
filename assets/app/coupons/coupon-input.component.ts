import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Coupon } from "./coupon.model";
import { CouponService } from "./coupon.service";

@Component({
    selector: 'app-coupon-input',
    templateUrl: './coupon-input.component.html',
    providers: [CouponService]
})

export class CouponInputComponent implements OnInit{
    coupon: Coupon;

    constructor(private couponService: CouponService){}

    onSubmit(form: NgForm){
        if(this.coupon){
            this.coupon.title = form.value.title;
            this.coupon.exp_date = form.value.exp_date;
            this.coupon.barcode_img = form.value.barcode_img;

            this.couponService.updateCoupon(this.coupon)
                .subscribe(
                    result => console.log(result)
                );
            this.coupon = null;
        } else {
            const coupon = new Coupon(
                form.value.business._id,
                form.value.title,
                form.value.barcode_img,
                form.value.coupon_type,
                '',//form.value.description,
                Date.now(),//form.value.exp_date,
                Date.now(),//form.value.start_date,
                '',//form.value.img_type,
                'https://imgs-steps-dragoart-386112.c.cdn77.org/how-to-draw-the-grumpy-cat-tard-the-grumpy-cat-step-9_1_000000122943_5.gif'//form.value.logo,
                //form.value.categories,
                //form.value.locations
            );
            this.couponService.addCoupon(coupon)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
        }
        form.resetForm();
    }

    onClear(form: NgForm) {
        this.coupon = null;
        form.resetForm();
    }

    ngOnInit() {
        this.couponService.couponIsEdit.subscribe(
            (coupon: Coupon) => this.coupon = coupon
        );
    }
}