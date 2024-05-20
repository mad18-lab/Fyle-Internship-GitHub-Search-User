import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  //for displaying GitHub profile details
  getUser(githubUsername: string):Observable<any> {
    let dataURL = `https://api.github.com/users/${githubUsername}`;
    return this.httpClient.get<any>(dataURL).pipe(
      catchError(this.handleErrors)
    );
  }

  //for displaying GitHub repo details
  getRepos(githubUsername: string, page: number, per_page: number):Observable<any[]> {
    let dataURL = `https://api.github.com/users/${githubUsername}/repos`;
    return this.httpClient.get<any[]>(dataURL, {
      params: {
        page: page.toString(),
        per_page: per_page.toString()
      }
    }).pipe(
      catchError(this.handleErrors)
    );
  }


  handleErrors(error: HttpErrorResponse) {
    let errorMessage:String;
    if (error.error instanceof ErrorEvent) {
      //error is client side
      errorMessage = `MESSAGE: ${error.error.message}`;
    } else {
      //error is server side
      errorMessage = `STATUS: ${error.status} MESSAGE: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
