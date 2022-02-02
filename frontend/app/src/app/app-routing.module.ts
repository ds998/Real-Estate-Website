import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { AdvertiserComponent } from './advertiser/advertiser.component';
import { BuyerComponent } from './buyer/buyer.component';
import { DeleteMicrolocationComponent } from './delete-microlocation/delete-microlocation.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { JsonRealEstateComponent } from './json-real-estate/json-real-estate.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NewAgencyComponent } from './new-agency/new-agency.component';
import { NewMicrolocationComponent } from './new-microlocation/new-microlocation.component';
import { NewRealEstateComponent } from './new-real-estate/new-real-estate.component';
import { NewUserComponent } from './new-user/new-user.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { RealEstateDetailsComponent } from './real-estate-details/real-estate-details.component';
import { RegisterComponent } from './register/register.component';
import { UpdateRealEstateComponent } from './update-real-estate/update-real-estate.component';
import { UpdateUserComponent } from './update-user/update-user.component';

const routes: Routes = [
  {path:'', redirectTo:'login',pathMatch: 'full'},
  {path:'login',component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'administrator', component:AdministratorComponent},
  {path:'buyer', component:BuyerComponent},
  {path:'advertiser', component:AdvertiserComponent},
  {path:'change_password',component:PasswordChangeComponent},
  {path:'logout',component:LogoutComponent},
  {path:'administrator/new_agency',component:NewAgencyComponent},
  {path:'administrator/new_user',component:NewUserComponent},
  {path:'administrator/new_microlocation',component:NewMicrolocationComponent},
  {path:'administrator/delete_microlocation',component:DeleteMicrolocationComponent},
  {path:'administrator/update_user/:username',component:UpdateUserComponent},
  {path:'advertiser/new_real_estate',component:NewRealEstateComponent},
  {path:'advertiser/update_real_estate/:_id',component:UpdateRealEstateComponent},
  {path:'advertiser/json_real_estate',component:JsonRealEstateComponent},
  {path:'advertiser/personal_info',component:PersonalInfoComponent},
  {path:'buyer/real_estate_details/:_id',component:RealEstateDetailsComponent},
  {path:'buyer/favorites',component:FavoritesComponent},
  {path:'buyer/advanced',component:AdvancedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
