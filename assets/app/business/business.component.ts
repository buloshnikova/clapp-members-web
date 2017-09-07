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
    selectedCategories:any = [];
    selectedCategory = {};
    isFormChanged = false;

    constructor(private businessService: BusinessService, private commonService: CommonService) {}


    onSubmit() {
        this.isFormChanged = false;
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
        this.business.logo = window.location.origin + res.filename;
    }

    uploadStateChange($event) {
        if ($event) {
            console.log($event);
        }
    }

    addCategory(index) {
        console.log(index);
        if (null == this.business.categories) {
            this.business.categories = [];
        }
        if (null == this.selectedCategories) {
            this.selectedCategories = [];
        }

        this.business.categories.push(this.selectedCategory._id);
        this.selectedCategories.push(this.selectedCategory);

        // remove selected category from the whole list of categories
        this.categories.splice(this.selectedCategory,1);

        // clean up selected category
        this.selectedCategory = this.categories[0];

        console.log(this.business.categories);
    }

    removeCategory(item) {
        if (null != item) {
            this.business.categories.splice(item, 1);
            this.selectedCategories.splice(item, 1);
            // push back removed category to the whole list of categories
            this.categories.push(item);
            item = {};
        }

        console.log(this.business.categories);
    }

    onSelectedChanged() {
        console.log('select changed');
        this.isFormChanged = false;
    }

    ngOnInit() {
        this.businessService.getBusinessInfo()
            .subscribe(
                (business: Business) => {
                    this.business = business;
                    this.selectedCategories = business.categories;
                    console.log(this.business);
                }
            );
        this.commonService.getAllCategories()
            .subscribe(
                data => {
                    this.categories = data;
                    this.selectedCategory = data[0];
                    console.log(data);
                    this.isFormChanged = false;
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
            info: new FormControl(null),
            selectedCategory: new FormControl(null)
        });

        this.businessForm.valueChanges.subscribe( data => {
            console.log('Form changes', data);
            this.isFormChanged = true;
        })

    }

}