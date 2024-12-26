import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-view-bill-products',
  standalone:true,
  imports: [
   MatIcon,MatToolbarModule,MatDialogModule

  ],
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {
  displayedColumns : string[] = ['name', 'category', 'price', 'quantity', 'total'];
  dataSource:any;
  data:any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  public dialogRef:MatDialogRef<ViewBillProductsComponent>) { }

  ngOnInit() {
    this.data = this.dialogData.data;
    this.dataSource = JSON.parse(this.dialogData.data.productDetail);
    console.log(this.dialogData.data);
    console.log(this.dataSource);
  }
}
