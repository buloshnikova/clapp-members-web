import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import {AuthService} from "./auth.service.ts";
import { Business } from "./../business/business.model.ts";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {

    signinForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const business = new Business(
            this.signinForm.value.email,
            this.signinForm.value.password
        );
        this.authService.signin(business)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('businessId', data.business._id);
                    // TODO: check where leads default url '/'
                    this.router.navigateByUrl('/business');
                },
                error => console.error(error)
            );
        this.signinForm.reset();
    }

    ngOnInit() {
        this.signinForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}