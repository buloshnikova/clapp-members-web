import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { CouponsComponent } from "./coupons.component";
import { CouponComponent } from "./coupon.component";
import { CouponListComponent } from "./coupon-list.component";
import { CouponInputComponent } from "./coupon-input.component";
import { CouponService } from "./coupon.service";
import { ImageUploadModule } from "angular2-image-upload";
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
    declarations:[
        CouponComponent,
        CouponListComponent,
        CouponInputComponent,
        CouponsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ImageUploadModule.forRoot(),
        BrowserModule,
        MyDatePickerModule
    ],
    providers: [CouponService]
})

export class CouponModule {

}