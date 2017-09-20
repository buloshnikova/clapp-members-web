import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormArray, FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Coupon } from "./coupon.model";
import { CouponService } from "./coupon.service";

@Component({
    selector: 'app-coupon-input',
    templateUrl: './coupon-input.component.html',
    styleUrls: ['./coupon.component.css']
})

export class CouponInputComponent implements OnInit{
    @Input() couponInput: Coupon;

    couponForm: FormGroup;
    coupon: Coupon;
    isHidden: boolean = true;
    businessCategories: any = [];
    businessLocations: any = [];
    selectedCategories:any = [];
    selectedCategory = {};
    selectedLocations:any = [];
    selectedLocation = {};
    selectedImage = '';
    coupon_type = { "_id": '598611b1dd737c09beaea250'};
    isFormChanged = false;

    constructor(private fb: FormBuilder, private couponService: CouponService){
        this.createForm();
    }

    createForm() {
        this.couponForm = this.fb.group({
            title: [''],
            description: [''],
            barcode_img: [''],
            exp_date: [''],
            selectedCategory: '',
            selectedLocation: '',
            businessCategories: this.fb.array([]),
            businessLocations: this.fb.array([])
        });
    }

    initFormWithObject() {
        this.couponForm.reset({
            title: this.coupon.title,
            description: this.coupon.description,
            barcode_img: this.coupon.barcode_img,
            exp_date: this.coupon.exp_date,
            selectedCategory: 0,
            selectedLocation: 0
        });
        this.selectedImage = this.coupon.barcode_img;
        this.setCategoriesArray(this.businessCategories);
        this.setLocationsArray(this.businessLocations);
    }

    setCategoriesArray(array: any) {
        const categoryFGs = array.map(category => this.fb.group(category));
        const categoryFormArray = this.fb.array(categoryFGs);
        this.couponForm.setControl('businessCategories', categoryFormArray);
    }

    setLocationsArray(array: any) {
        const locationFGs = array.map(location => this.fb.group(location));
        const locationFormArray = this.fb.array(locationFGs);
        this.couponForm.setControl('businessLocations', locationFormArray);
    }

    ngOnChanges() {
        console.log("ngOnChanges");
    }

    onSubmit(){
    const formModel = this.couponForm.value;

    if(null !== this.coupon && null !== this.coupon._id){
        this.coupon.title = formModel.title;
        this.coupon.description = formModel.description;
        this.coupon.exp_date = formModel.exp_date;
        this.coupon.barcode_img = formModel.barcode_img,
        this.coupon.categories = this.selectedCategories,
        this.coupon.locations = this.selectedLocations;

        this.couponService.updateCoupon(this.coupon)
            .subscribe(
                result => console.log(result)
            );
    } else {
        const coupon = new Coupon(
            null,
            null,
            null,
            formModel.title,
            formModel.barcode_img,
            this.coupon_type,
            formModel.description,
            Date.now(),//form.value.exp_date,
            Date.now(),//form.value.start_date,
            null,
            null,
            this.selectedCategories,
            this.selectedLocations
    );
        this.couponService.addCoupon(coupon)
            .subscribe(
                data => this.coupon._id = data.obj._id,
                error => console.error(error)
            );
    }
    //this.couponForm.resetForm();
}

    onClear() {
        this.coupon = null;
        this.onResetForm();
    }

    addCoupon() {
        this.coupon = new Coupon();
        this.onClear();
        this.isHidden = false;
    }

    discardCoupon() {
        this.isHidden = true;
        this.onClear();
    }

    // reset form
    onResetForm() {
        this.couponForm.reset({
            selectedCategory: 0,
            selectedLocation: 0
        });
        this.setCategoriesArray(this.businessCategories);
        this.setLocationsArray(this.businessLocations);
    }

    initCouponForEdit(coupon: Coupon) {
        this.coupon = coupon;
        // init categories
        this.initCategories();
        // init locations
        this.initLocations();
        // init form
        this.initFormWithObject();
        this.isHidden = false;
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
        this.selectedImage = window.location.origin + res.filename;
    }

    uploadStateChange($event) {
        if ($event) {
            console.log($event);
        }
    }
    // CATEGORIES
    initCategories() {
        this.selectedCategories = [];
        this.businessCategories = this.couponService.getStoredCategories();
        if (null !== this.coupon && this.coupon.categories.length > 0) {
            for (var i = 0; i < this.coupon.categories.length; i++) {
                //set each category id from coupon
                let catId = this.coupon.categories[i]._id;
                // find the category from coupon in the whole list of business categories
                let category = this.businessCategories.find( c => c._id === catId);
                // add the found category to selected
                this.selectedCategories.push(category);
                const index: number = this.businessCategories.indexOf(category);
                // remove selected category from the general list
                if (index !== -1) {
                    this.businessCategories.splice(index, 1);
                }
            }
        }
        console.log(this.selectedCategories);
        this.selectedCategory = 0;
        this.sortCategories();
    }

    addCategory(index) {
        this.isFormChanged = true;

        if (null == this.coupon.categories) {
            this.coupon.categories = [];
        }
        if (null == this.selectedCategories) {
            this.selectedCategories = [];
        }

        this.selectedCategory = this.businessCategories[index];
        this.coupon.categories.push(this.selectedCategory._id);
        this.selectedCategories.push(this.selectedCategory);

        // remove selected category from the whole list of categories
        this.businessCategories.splice(index,1);

        // clean up selected category
        this.selectedCategory = 0;
    }

    removeCategory(index) {
        // pass index of array
        if (null != index) {
            this.isFormChanged = true;

            let category = this.selectedCategories[index];
            this.coupon.categories.splice(index, 1);
            this.selectedCategories.splice(index, 1);
            // push back removed category to the whole list of categories
            this.businessCategories.push(category);
            this.sortCategories();
        }
    }

    sortCategories() {
        this.businessCategories.sort((a: any, b: any) => {
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
    initLocations() {
        this.selectedLocations = [];
        this.businessLocations = this.couponService.getStoredLocations();
        console.log(this.businessLocations);
        if (null !== this.coupon && this.coupon.locations.length > 0) {
            for (var i = 0; i < this.coupon.locations.length; i++) {
                //set each location id from locations
                let locId = this.coupon.locations[i]._id;
                // find the location from coupon in the whole list of business locations
                let location = this.businessLocations.find( l => l._id === locId);
                // add the found category to selected
                this.selectedLocations.push(location);
                const index: number = this.businessLocations.indexOf(location);
                // remove selected category from the general list
                if (index !== -1) {
                    this.businessLocations.splice(index, 1);
                }
            }
        }
        this.selectedLocation = 0;
    }

    addLocation(index) {
        this.isFormChanged = true;

        if (null == this.coupon.categories) {
            this.coupon.categories = [];
        }
        if (null == this.selectedCategories) {
            this.selectedCategories = [];
        }

        this.selectedLocation = this.businessLocations[index];
        this.coupon.locations.push(this.selectedLocation._id);
        this.selectedLocations.push(this.selectedLocation);

        // remove selected category from the whole list of categories
        this.businessLocations.splice(index,1);

        // clean up selected category
        this.selectedLocation = 0;
    }

    removeLocation(index) {
        // pass index of array
        if (null != index) {
            this.isFormChanged = true;

            let location = this.selectedLocations[index];
            this.coupon.locations.splice(index, 1);
            this.selectedLocations.splice(index, 1);
            // push back removed category to the whole list of categories
            this.businessLocations.push(location);
            this.sortLocations();
            this.selectedLocation = 0;
        }
    }

    sortLocations() {
        this.businessLocations.sort((a: any, b: any) => {
            if (a.name < b.name ){
                return -1;
            }else if( a.name > b.name ){
                return 1;
            }else{
                return 0;
            }
        });
    }

    ngOnInit() {
        this.couponService.couponIsEdit.subscribe(
            (coupon: Coupon) => this.initCouponForEdit(coupon)

        );
        this.couponService.getCategoriesByBusinessId().subscribe(
            (categories) => this.businessCategories = categories

        );
        this.couponService.getLocationsByBusinessId().subscribe(
            (locations) => this.businessLocations = locations
        );
    }
}