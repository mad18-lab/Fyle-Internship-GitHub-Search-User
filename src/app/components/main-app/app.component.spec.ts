import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { ApiService } from '../../services/api.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
  let mockUser = { login: 'octocat', id: 1 };
  let mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
  let mockReposData = { repos: mockRepos, totalCount: 20 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [ApiService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);

    spyOn(apiService, 'getUser').and.returnValue(of(mockUser));
    spyOn(apiService, 'getRepos').and.returnValue(of(mockReposData));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get profile and repositories on search', () => {
    component.searchUser = 'octocat';
    component.getProfile();

    expect(apiService.getUser).toHaveBeenCalledWith('octocat');
    expect(apiService.getRepos).toHaveBeenCalledWith('octocat', 1, 10);
    expect(component.profile).toEqual(mockUser);
    expect(component.repos).toEqual(mockRepos);
    expect(component.totalRepos).toEqual(20);
  });

  it('should handle errors on getProfile', () => {
    const spyGetRepos = spyOn(apiService, 'getRepos').and.returnValue(throwError(() => 'Error message from service'));
    component.searchUser = 'octocat';
    component.displayRepos();
    expect(spyGetRepos).toHaveBeenCalledWith('octocat', 1, 10);
    expect(component.errorMessage).toBe('Error message from service');
    expect(component.loading).toBeFalse();
  });

  it('should handle errors on displayRepos', () => {
    spyOn(apiService, 'getRepos').and.returnValue(throwError(() => 'Error message'));
    component.searchUser = 'octocat';
    component.displayRepos();

    expect(apiService.getRepos).toHaveBeenCalledWith('octocat', 1, 10);
    expect(component.errorMessage).toBe('Error message');
    expect(component.loading).toBeFalse();
  });

  it('should change page and get repositories', () => {
    component.searchUser = 'octocat';
    component.onPageChange(2);

    expect(component.page).toBe(2);
    expect(apiService.getRepos).toHaveBeenCalledWith('octocat', 2, 10);
  });

  it('should change per page and get repositories', () => {
    component.searchUser = 'octocat';
    component.onPerPageChange(20);

    expect(component.perPage).toBe(20);
    expect(component.page).toBe(1);
    expect(apiService.getRepos).toHaveBeenCalledWith('octocat', 1, 20);
  });
});
