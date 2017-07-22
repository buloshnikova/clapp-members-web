import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CouponsComponent } from "./coupons.component";
import { CouponComponent } from "./coupon.component";
import { CouponListComponent } from "./coupon-list.component";
import { CouponInputComponent } from "./coupon-input.component";
import { CouponService } from "./coupon.service";


@NgModule({
    declarations:[
        CouponComponent,
        CouponListComponent,
        CouponInputComponent,
        CouponsComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    providers: [CouponService]
})

export class CouponModule {

}