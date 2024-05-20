import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public profile:any;   //gets profile data
  public repos:any[] = [];     //gets user's repositories
  public searchUser!:string;  //to search for user
  public errorMessage!:string;  //for the error message
  public page:number=1;
  public perPage:number=10;
  public totalRepos:number=0;
  
  constructor(
    private apiService: ApiService
  ) {}

  public getProfile() {
    this.apiService.getUser(this.searchUser).subscribe({next: (data) => {
      this.profile = data;
      this.page = 1;
      this.displayRepos();
    }, error: (error) => {
      this.errorMessage = error;
    }});
  }

  public displayRepos() {
    this.apiService.getRepos(this.searchUser, this.page, this.perPage).subscribe({next: (data) => {
      this.repos = data;
      this.totalRepos = data.length;
    }, error: (error) => {
      this.errorMessage = error;
    }});
  }

  public onPageChange(newPage: number) {
    this.page = newPage;
    this.displayRepos();
  }

  public onPerPageChange(newPerPage: number) {
    this.perPage = newPerPage;
    this.page = 1;
    this.displayRepos();
  }

  ngOnInit() {
    
  }
}
