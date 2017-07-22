import { Routes, RouterModule } from "@angular/router";

import { CouponsComponent } from "./coupons/coupons.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { BusinessComponent } from "./business/business.component";

const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo: '/coupons',
        pathMatch: 'full'
    },
    {
        path: 'coupons',
        component: CouponsComponent
    },
    {
        path: 'business',
        component: BusinessComponent
    },
    {
        path: 'auth',
        component: AuthenticationComponent,
        loadChildren: './auth/auth.module#AuthModule'
    }
];

export const appRouting = RouterModule.forRoot(APP_ROUTES);