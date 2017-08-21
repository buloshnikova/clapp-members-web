import { Component } from "@angular/core";

import { AuthService } from "../auth/auth.service.ts";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {

    constructor(private authService: AuthService){}

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}