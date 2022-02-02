import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdvertiserComponent } from './advertiser/advertiser.component';
import { BuyerComponent } from './buyer/buyer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RefreshService } from './services/refresh.service';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule } from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import { NewAgencyComponent } from './new-agency/new-agency.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewMicrolocationComponent } from './new-microlocation/new-microlocation.component';
import { DeleteMicrolocationComponent } from './delete-microlocation/delete-microlocation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UpdateUserComponent } from './update-user/update-user.component';
import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';
import { NewRealEstateComponent } from './new-real-estate/new-real-estate.component';
import { UpdateRealEstateComponent } from './update-real-estate/update-real-estate.component';
import { JsonRealEstateComponent } from './json-real-estate/json-real-estate.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { RealEstateDetailsComponent } from './real-estate-details/real-estate-details.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import {MatCardModule} from '@angular/material/card';
import { FavoritesComponent } from './favorites/favorites.component';
import { AdvancedComponent } from './advanced/advanced.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordChangeComponent,
    AdministratorComponent,
    RegisterComponent,
    AdvertiserComponent,
    BuyerComponent,
    NavbarComponent,
    LogoutComponent,
    NewAgencyComponent,
    NewUserComponent,
    NewMicrolocationComponent,
    DeleteMicrolocationComponent,
    UpdateUserComponent,
    NewRealEstateComponent,
    UpdateRealEstateComponent,
    JsonRealEstateComponent,
    PersonalInfoComponent,
    RealEstateDetailsComponent,
    FavoritesComponent,
    AdvancedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileUploadModule,
    MatStepperModule,
    MatCarouselModule.forRoot(),
    MatCardModule
  ],
  providers: [
    RefreshService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
