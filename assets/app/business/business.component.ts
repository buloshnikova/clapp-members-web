import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { BusinessService } from "./business.service";
import { Business } from "./business.model";
import { CommonService } from "../shared/common.service";

@Component({
    selector: 'app-business',
    templateUrl: './business.component.html'
})

export class BusinessComponent implements OnInit{
    businessForm: FormGroup;
    business: Business;
    categories:any = [];

    constructor(private businessService: BusinessService, private commonService: CommonService) {}


    onSubmit() {
        const business = new Business(
            this.businessForm.value.email,
            null,
            //this.businessForm.value.password,
            this.businessForm.value.title,
            this.businessForm.value.info,
            this.businessForm.value.logo,
            null, null, null
            //this.businessForm.value.categories,
            //this.businessForm.value.locations,
            //this.businessForm.value.coupons
        );
        console.log(business);
        this.businessService.updateBusinessInfo(business)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
    }

    // IMAGE UPLOAD
    imageRemoved($event) {
        if ($event) {
            console.log($event);
        }

    }

    imageFinishedUploading($event) {
        var res = JSON.parse($event.serverResponse._body);
        console.log(res.filename);
        this.business.logo = res.filename;
    }

    uploadStateChange($event) {
        if ($event) {
            console.log($event);
        }
    }

    ngOnInit() {
        this.businessService.getBusinessInfo()
            .subscribe(
                (business: Business) => {
                    this.business = business;
                    console.log(this.business);
                }
            );
        this.commonService.getAllCategories()
            .subscribe(
                data => {
                    this.categories = data;
                    console.log(data);
                }
            );

        this.businessForm = new FormGroup({
            title: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required
                //Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
            ]),
            //password: new FormControl(null, Validators.required),
            logo: new FormControl(null),
            info: new FormControl(null)
        });

    }
}