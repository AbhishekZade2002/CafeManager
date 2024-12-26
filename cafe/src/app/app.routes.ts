import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouteGuardService } from './services/route-guard.service';
import { FullComponent } from './layouts/full/full.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    {
      path: 'cafe',
      component: FullComponent,
      children: [
        {
          path: '',
          redirectTo: '/cafe/dashboard',
          pathMatch: 'full',
        },
        {
          path: '',
          loadChildren:
            () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
            canActivate:[RouteGuardService],
            data:{
              expectedRole:['admin', 'user']
            }
        },
        {
          path: 'dashboard',
          loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
          canActivate:[RouteGuardService],
          data:{
            expectedRole:['admin', 'user']
          }
        }
      ]
    },
    { path: '**', component: HomeComponent }
  ];
  