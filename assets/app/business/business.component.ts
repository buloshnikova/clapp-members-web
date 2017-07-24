import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { BusinessService } from "./business.service";
import { Business } from "./business.model";

@Component({
    selector: 'app-business',
    templateUrl: './business.component.html'
})

export class BusinessComponent implements OnInit{
    businessForm: FormGroup;
    business: Business;

    constructor(private businessService: BusinessService) {}


    onSubmit() {
        const business = new Business(
            this.signupForm.value.email,
            this.signupForm.value.password,
            this.signupForm.value.title,
            this.signupForm.value.info
            //this.signupForm.value.logo,
            //this.signupForm.value.categories,
            //this.signupForm.value.locations,
            //this.signupForm.value.coupons
        );
        this.businessService.updateBusinessInfo(business)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.businessForm.reset();
    }

    ngOnInit() {
        this.businessService.getBusinessInfo()
            .subscribe(
                (business: Business) => {
                    this.business = business;
                    console.log(this.business);
                }
            );
        this.businessForm = new FormGroup({
            title: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
            ]),
            password: new FormControl(null, Validators.required),
            logo: new FormControl(null),
            info: new FormControl(null)
        });
    }
}