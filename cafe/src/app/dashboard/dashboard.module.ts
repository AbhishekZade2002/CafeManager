import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard.routing';

@NgModule({
  imports: [

    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: []
})
export class DashboardModule { }
