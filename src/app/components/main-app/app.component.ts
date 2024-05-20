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
  public isLastPage: boolean = false;
  public loading: boolean = false;
  
  constructor(
    private apiService: ApiService
  ) {}

  public getProfile() {
    this.apiService.getUser(this.searchUser).subscribe({next: (data) => {
      this.profile = data;
      this.page = 1;
      this.displayRepos();
      this.loading = false;
    }, error: (error) => {
      this.errorMessage = error;
      this.loading = false;
    }});
  }

  public displayRepos() {
    this.loading = true;
    this.apiService.getRepos(this.searchUser, this.page, this.perPage).subscribe({
      next: (data) => {
        this.repos = data.repos; // Update to access the 'repos' property of the returned object
        console.log(this.repos.length);
        this.totalRepos = data.totalCount; // Update to access the 'totalCount' property of the returned object
        this.isLastPage = this.page * this.perPage >= this.totalRepos;
        this.loading = false;
      }, error: (error) => {
      this.errorMessage = error;
      this.loading = false;
    }});
  }

  public onPageChange(newPage: number) {
    if (newPage < 1) return;
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
