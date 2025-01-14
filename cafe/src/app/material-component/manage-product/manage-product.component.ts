import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service'; 
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-manage-product',
  standalone:true,
  imports:[
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule
  
  ],
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource:any;
  responseMessage:any;

  constructor(private productService:ProductService,
    private router:Router,
    private snackbarService:SnackbarService,
    public dialog:MatDialog,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    // retrieve products from db in the backend
    this.productService.getProducts().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: "Add"
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })

    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: "Edit",
      data:values
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
      this.tableData();
    })
  }

  handleDeleteAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name,
      confirmation: true
    };
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any) {
    // delete by calling request to the backend
    this.productService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData(); // reload table data after deletion
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  // updates the status of the product
  onChange(status:any, id:any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id:id
    }
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success")
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);

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
