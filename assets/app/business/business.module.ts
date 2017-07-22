import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { BusinessComponent } from "./business.component";
import { BusinessService } from "./business.service";


@NgModule({
    declarations:[
        BusinessComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [BusinessService]
})

export class BusinessModule {

}