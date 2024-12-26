import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    MatToolbarModule,
   CommonModule,
   MatFormFieldModule,
   MatDialogModule,
    FormsModule,
    MatInputModule,

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // Changed from styleUrl to styleUrls, which is the correct syntax
})

export class LoginComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup; // FormGroup initialization
  responseMessage: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(GlobalConstants.emailegex)]],
      password: ['', [Validators.required]]
    });
  }

  handleSubmit(): void {
    this.ngxService.start(); // Start loading spinner

    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password
    };

    // Send login data to backend
    this.userService.login(data).subscribe(
      (response: any) => {
        this.ngxService.stop(); // Stop loading spinner
        this.dialogRef.close(); // Close the dialog
        localStorage.setItem('token', response.token); // Save token to local storage
        this.router.navigate(['/cafe/dashboard']); // Navigate to the dashboard
      },
      (error) => {
        this.ngxService.stop(); // Stop loading spinner
        this.responseMessage = error.error?.message || GlobalConstants.genericError; // Handle error message
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error); // Show error message
      }
    );
  }
}
