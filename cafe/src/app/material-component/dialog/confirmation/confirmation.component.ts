import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContainer, MatDialogContent } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({

  selector: 'app-confirmation',
  standalone:true,
  imports: [MatIcon,
    MatToolbarModule,

    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  onEmitStatusChange = new EventEmitter();
  details:any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any) { }

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.confirmation) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }
}
