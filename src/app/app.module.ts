import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { ApiService } from './services/api.service';
import { AppComponent } from './components/main-app/app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProfileReposComponent } from './components/profile-repos/profile-repos.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ProfileCardComponent,
    ProfileReposComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
