import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpResponse, HttpHeaders } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve user data from the API', () => {
    const mockUser = { login: 'octocat', id: 1 };
    service.getUser('octocat').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('https://api.github.com/users/octocat');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should retrieve user repositories from the API', () => {
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    const mockResponse = new HttpResponse({
      body: mockRepos,
      headers: new HttpHeaders({ 'Link': '<https://api.github.com/users/octocat/repos?page=2>; rel="last"' })
    });

    service.getRepos('octocat', 1, 10).subscribe(data => {
      expect(data.repos).toEqual(mockRepos);
      expect(data.totalCount).toEqual(20); // assuming 2 pages, each with 10 items
    });

    const req = httpMock.expectOne('https://api.github.com/users/octocat/repos?page=1&per_page=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse, { headers: { 'Link': '<https://api.github.com/users/octocat/repos?page=2>; rel="last"' } });
  });

  it('should handle errors', () => {
    service.getUser('invalidUser').subscribe({
      next: () => fail('Expected an error, not user data'),
      error: (error) => {
        expect(error).toBe('STATUS: 404 MESSAGE: Not Found');
      }
    });

    const req = httpMock.expectOne('https://api.github.com/users/invalidUser');
    expect(req.request.method).toBe('GET');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});
