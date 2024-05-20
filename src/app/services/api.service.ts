import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, tap, throwError, map } from 'rxjs';

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
  getRepos(githubUsername: string, page: number, per_page: number):Observable<{ repos: any[], totalCount: number }> {
    let dataURL = `https://api.github.com/users/${githubUsername}/repos?page=${page}&per_page=${per_page}`;
    return this.httpClient.get<any[]>(dataURL, {
      observe: 'response', // This will allow you to access the full HTTP response
      params: {
        page: page.toString(),
        per_page: per_page.toString()
      }
    }).pipe(
      map((response: HttpResponse<any[]>) => {
        const totalCountHeader = response.headers.get('Link');
        let totalCount = 0;
        if (totalCountHeader) {
          const match = totalCountHeader.match(/page=(\d+)>; rel="last"/);
          if (match) {
            totalCount = parseInt(match[1], 10) * per_page;
          }
        }
        return { repos: response.body as any[], totalCount: totalCount };
      }),
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
