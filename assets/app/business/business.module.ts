import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { BusinessComponent } from "./business.component";
import { BusinessService } from "./business.service";

import { ImageUploadModule } from "angular2-image-upload";
// examples: https://github.com/aberezkin/ng2-image-upload
// https://aberezkin.github.io/ng2-image-upload/

@NgModule({
    declarations:[
        BusinessComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ImageUploadModule.forRoot()
    ],
    providers: [BusinessService]
})

export class BusinessModule {

}