import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Business } from "../business/business.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit{
    signupForm: FormGroup;

    constructor(private authService: AuthService) {}

    onSubmit() {
        const business = new Business(
            this.signupForm.value.email,
            this.signupForm.value.password,
            this.signupForm.value.title
            //null,//description
            //null,//logo
            //null,//categories
            //null,//locations
            //null//coupons
        );
        this.authService.signup(business)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.signupForm.reset();
    }

    ngOnInit() {
        this.signupForm = new FormGroup({
           title: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}