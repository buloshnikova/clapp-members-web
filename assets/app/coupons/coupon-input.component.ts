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
    isFormChanged = false;

    constructor(private fb: FormBuilder, private couponService: CouponService){
        this.createForm();
    }

    createForm() {
        this.couponForm = this.fb.group({
            title: [''],
            exp_date: [''],
            selectedCategory: '',
            businessCategories: this.fb.array([]),
            businessLocations: this.fb.array([])
        });
    }

    initFormWithObject() {
        this.couponForm.reset({
            title: this.coupon.title,
            exp_date: this.coupon.exp_date,
            selectedCategory: 0
        });
        this.setCategoriesArray(this.businessCategories);
    }

    setCategoriesArray(array: any) {
        const categoryFGs = array.map(category => this.fb.group(category));
        const categoryFormArray = this.fb.array(categoryFGs);
        this.couponForm.setControl('businessCategories', categoryFormArray);
    }

    ngOnChanges() {
        console.log("ngOnChanges");
    }

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

    onClear() {
        this.coupon = null;
        this.onResetForm();
    }

    addCoupon() {
        this.isHidden = false;
    }

    discardCoupon() {
        this.isHidden = true;
        this.onResetForm();
    }

    // reset form
    onResetForm() {
        this.couponForm.reset();
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
        if (null !== this.coupon && this.coupon.locations.length > 0) {
            if (null === this.selectedLocations) {
                this.selectedCategories = [];
            }
            console.log(this.coupon.locations);
            for (var i = 0; i < this.coupon.locations.length; i++) {
                //set each location id from locations
                let locId = this.coupon.locations[i];
                // find the location from coupon in the whole list of business locations
                let location = this.businessLocations.find( l => l._id === locId);
                // add the found category to selected
                this.selectedCategories.push(location);
                const index: number = this.businessLocations.indexOf(location);
                // remove selected category from the general list
                if (index !== -1) {
                    this.businessLocations.splice(index, 1);
                }
            }
        }
        this.selectedCategory = 0;
        console.log(this.businessLocations);
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