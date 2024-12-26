import { Component,AfterViewInit } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';

import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
	responseMessage:any;
	data:any;

	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackBarServices:SnackbarService) {
			this.ngxService.start();
			this.dashboardData();
	}

	dashboardData() {
		// retrieve data from database via backend
		this.dashboardService.getDetails().subscribe((response:any)=>{
			this.ngxService.stop();
			this.data = response;
		}, (error:any)=>{
			this.ngxService.stop();
			console.log(error)

			if (error.error?.message) {
				this.responseMessage = error.error?.message;
			  }
			  else {
				this.responseMessage = GlobalConstants.genericError;
			  }
			  this.snackBarServices.openSnackBar(this.responseMessage, GlobalConstants.error);
		})
	}
}
