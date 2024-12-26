import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { jwtDecode } from 'jwt-decode';
import { MenuItems } from '../../../shared/menu-items';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  userRole:any;
  token:any = localStorage.getItem("token");
  tokenPayload:any;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems:MenuItems
  ) {
    this.tokenPayload = jwtDecode(this.token);
    this.userRole = this.tokenPayload?.role;
    
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
