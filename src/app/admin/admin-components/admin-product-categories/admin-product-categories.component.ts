import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router }    from '@angular/router';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'app/services/global.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-product-categories',
  templateUrl: './admin-product-categories.component.html',
  styleUrls: ['./admin-product-categories.component.scss']
})
export class AdminProductCategoriesComponent implements OnInit {

  categories: Observable<any>;
  dialogRef: MatDialogRef<any>;
  selectedOption: any;
  currentAdmin: any;

  constructor(
    public db: AngularFireDatabase,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public globalService: GlobalService
  ) {
    this.categories = db.list('/categories').snapshotChanges();

    this.globalService.admin.subscribe((a) => {
      this.currentAdmin = a;
    });
  }

  deleteCategory(category: any) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      if (this.selectedOption === 'delete') {
        this.db.object('/categories/' + category.key).remove();

        let snackBarRef = this.snackBar.open('Category deleted', 'OK!', {
          duration: 3000
        });
      }
    });
  }

  ngOnInit() {
  }

}
