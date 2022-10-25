import { Component, OnInit , ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CrudAngular';

  displayedColumns: string[] = ['id','bookName', 'authorName', 'category', 'status', 'price' , 'date' , 'action' ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api : ApiService){
  }
  ngOnInit(): void {
    this.getAllBooks();
  

  }

  openDialog() {
    this.dialog.open(DialogComponent , {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val == "save"){
        this.getAllBooks();
      }
    });
  }

  getAllBooks(){
    this.api.getAllBooks().subscribe(
      {
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;  
          console.log(res)
        },
        error:()=>{console.log("Error while Fetching the Data")}
      }
    )
  }

  editBook(row : any){
    this.dialog.open(DialogComponent , {
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val == "update"){
        this.getAllBooks();
      }
    });

  }

  deleteBook(id : number){
    Swal.fire({
      title: 'هل أنت متأكد أنك تريد الحذف !',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم إحذف'
    }).then((result) => {
      if (result.isConfirmed) {

        this.api.deleteBook(id).subscribe({
          next:(res)=>{
            //alert("Delete Product Successfully");
            this.getAllBooks();
          },
          error:()=>{
            alert("حدث خطأ ما");
          }
        })

        Swal.fire(
          'تم الحذف',
          'تم حذف الكتاب بنجاح',
          'success'
        )
      }
    })

    




  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}



