import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ForgotPasswordComponent } from '../../../forgot-password/forgot-password.component';
import { SnackbarService } from '../../../services/snackbar.service'; 
import { UserService } from '../../../services/user.service'; 
import { GlobalConstants } from '../../../shared/global-constants'; 
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone:true,
  imports:[
    MatToolbar,
    MatIcon,
    MatToolbarModule,
    MatLabel,
    MatFormField,
    MatError,
    MatHint,
    MatDialogContent,
    MatDialogActions,CommonModule

  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  oldPassword = true;
  newPassword = true;
  confirmPassword = true;
  changePasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword:[null, [Validators.required]],
      newPassword:[null, [Validators.required]],
      confirmPassword:[null, [Validators.required]]
    })
  }

  validateSubmit() {
    if (this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value) {
      return true;
    }
    else {
      return false;
    }
  }

  handlePasswordChangeubmit() {
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }
    // pass values from form to backend
    this.userService.changePassword(data).subscribe((response:any)=> {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"");
    }, (error)=> {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
