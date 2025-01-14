import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CommonModule,
    MatToolbarModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  password = true;
  confirmPassword = true;
  signupForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    // fields within the form
    this.signupForm = this.formBuilder.group({
      name:[null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null, [Validators.required, Validators.pattern(GlobalConstants.emailegex)]],
      contactNumber:[null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null, [Validators.required]],
      confirmPassword:[null, [Validators.required]]
    })
  }

  // ensures that the password and confirmPassword matches
  validateSubmit() {
    if (this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value) {
      return true;
    }
    else {
      return false;
    }
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    // sends data from the form to the backend
    this.userService.signup(data).subscribe((response:any)=> {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"");
      this.router.navigate(['/']);
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
