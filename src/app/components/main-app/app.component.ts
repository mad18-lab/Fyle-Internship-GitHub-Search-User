import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  public profile:any;   //gets profile data
  public repos:any[] = [];     //gets user's repositories
  public searchUser!:string;  //to search for user
  public errorMessage!:string;  //for the error message
  
  constructor(
    private apiService: ApiService
  ) {}

  public getProfile() {
    this.apiService.getUser(this.searchUser).subscribe({next: (data) => {
      this.profile = data;
    }, error: (error) => {
      this.errorMessage = error;
    }});

    this.apiService.getRepos(this.searchUser).subscribe({next: (data) => {
      this.repos = data;
    }, error: (error) => {
      this.errorMessage = error;
    }});
  }

  ngOnInit() {
    
  }
}
