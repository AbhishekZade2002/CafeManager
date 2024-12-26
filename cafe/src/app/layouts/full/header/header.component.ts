import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../../../material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from '../../../material-component/dialog/confirmation/confirmation.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class AppHeaderComponent {
  role:any;

  constructor(private router:Router,
    private dialog:MatDialog) {
  }

  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'logout',
      confirmation:true
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      dialogRef.close();
      localStorage.clear(); // clear token from local storage to restart the session
      this.router.navigate(['/']); // route the user back to the home page
    })
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}