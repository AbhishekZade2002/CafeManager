import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatToolbar,
    MatFormFieldModule,
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null, [Validators.required, Validators.pattern(GlobalConstants.emailegex)]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }
    // send values from form to backend
    this.userService.forgotPassword(data).subscribe((response:any)=> {
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
