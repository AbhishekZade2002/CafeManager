import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category',
  standalone:true,
  imports:[
    MatIcon,
    MatToolbar,
    MatToolbarRow,
    MatLabel,
    MatError,
    MatFormField,
    MatDialogContent,
    MatDialogActions,CommonModule
    
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter(); // when user clicks add button
  onEditCategory = new EventEmitter(); // when user clicks edit button
  categoryForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<CategoryComponent>,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name:[null, [Validators.required]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }
    // pass value from form to backend
    this.categoryService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error)=> {
      this.dialogRef.close();
      console.error(error);

      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit() {
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    // pass value from form to backend
    this.categoryService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error)=> {
      this.dialogRef.close();
      console.error(error);
      
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
