import { Component, OnInit} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as ts from "typescript";

import { BusinessService } from "./business.service";
import { Business } from "./business.model";
import { CommonService } from "../shared/common.service";
import forEachChild = ts.forEachChild;


@Component({
    selector: 'app-business',
    templateUrl: './business.component.html'
})

export class BusinessComponent implements OnInit {
    businessForm: FormGroup;
    business: Business;
    categories:any = [];
    selectedCategories:any = [];
    selectedCategory:any = {};
    isFormChanged = false;

    constructor(private businessService: BusinessService, private commonService: CommonService) {}


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
                    this.initCategories(data);
                }
            );

        this.initBusinessForm();

    }

    initBusinessForm() {
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
        this.businessForm.get('selectedCategory').setValue('', { onlySelf: true,emitEvent:false });

        //this.businessForm.valueChanges.subscribe( data => {
        //    console.log('Form changes', data);
        //    this.isFormChanged = true;
        //});
        this.businessForm.get('title').valueChanges.subscribe( data => {
            this.isFormChanged = true;
        });

        this.businessForm.get('logo').valueChanges.subscribe( data => {
            this.isFormChanged = true;
        });

        this.businessForm.get('info').valueChanges.subscribe( data => {
            this.isFormChanged = true;
        });
    }

    onSubmit() {
        this.isFormChanged = false;
        const business = new Business(
            this.businessForm.value.email,
            null,
            //this.businessForm.value.password,
            this.businessForm.value.title,
            this.businessForm.value.info,
            this.businessForm.value.logo,
            this.business.categories,
            this.business.locations
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

    // CATEGORIES
    addCategory(index) {
        this.isFormChanged = true;

        if (null == this.business.categories) {
            this.business.categories = [];
        }
        if (null == this.selectedCategories) {
            this.selectedCategories = [];
        }

        this.selectedCategory = this.categories[index];
        if (this.selectedCategory._id){
            this.business.categories.push(this.selectedCategory._id);
        }

        this.selectedCategories.push(this.selectedCategory);

        // remove selected category from the whole list of categories
        this.categories.splice(index,1);

        // clean up selected category
        this.selectedCategory = 0;
    }

    removeCategory(item) {
        // passed an index in array of selected categories
        if (null != item) {
            this.isFormChanged = true;

            let category = this.selectedCategories[item];
            this.business.categories.splice(item, 1);
            this.selectedCategories.splice(item, 1);
            // push back removed category to the whole list of categories
            this.categories.push(category);
            this.sortCategories();
        }
    }

    onSelectedChanged() {
        this.isFormChanged = false;
    }

    initCategories(data){
            this.categories = data;

            if (null != this.business && this.business.categories.length > 0) {
                console.log(this.business.categories);
                // check if selectedCategories is inialized
                if (null === this.selectedCategories) {
                    this.selectedCategories = [];
                }
                for( var i = 0; i < this.business.categories.length; i++) {
                    // remove from categories all the items existed in business.categories
                    // insert into selected categories all items removed
                    let catId = this.business.categories[i];
                    // find the category by id in a list and store as a whole object
                    let category = this.categories.find( c => c._id === catId);
                    // add the found category to selected
                    this.selectedCategories.push(category);
                    const index: number = this.categories.indexOf(category);
                    // remove selected category from the general list
                    if (index !== -1) {
                        this.categories.splice(index, 1);
                    }
                }
            }
            console.log(this.selectedCategories);
            this.sortCategories();
            this.selectedCategory = 0;
            this.isFormChanged = false;
    }

    sortCategories() {
        this.categories.sort((a: any, b: any) => {
            if (a.name < b.name ){
                //a is the Object and args is the orderBy condition (data.likes.count in this case)
                return -1;
            }else if( a.name > b.name ){
                return 1;
            }else{
                return 0;
            }
        });
    }

    // LOCATIONS
    addLocation() {
        this.isFormChanged = true;
        var newLocation:any = {};
        newLocation.business_id = this.business._id;
        this.business.locations.push(newLocation);
    }

    removeLocation(item){
        if (null !== item) {
            this.isFormChanged = true;
            this.business.locations.splice(item, 1);
        }
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}