import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-repos',
  templateUrl: './profile-repos.component.html',
  styleUrls: ['./profile-repos.component.scss']
})
export class ProfileReposComponent {
  @Input() repos:any[] = [];
}
