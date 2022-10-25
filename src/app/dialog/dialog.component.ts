import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  statusList = ["جديد" , "مستعمل"]
  bookForm !: FormGroup
  actionBtn : string = "حفظ";
  labelForm : string = "نموذج الإضافة";
  constructor(private formBuilder : FormBuilder ,
     private api : ApiService ,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<DialogComponent> ) { }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      bookName : ['' , Validators.required],
      authorName : ['' , Validators.required],
      category : ['' , Validators.required],
      status : ['' , Validators.required],
      price : ['' , Validators.required],
      date : ['' , Validators.required],
     
    });

    if(this.editData){
      this.actionBtn  = "تحديث";
      this.labelForm  = "نموذج التعديل";

      this.bookForm.controls['bookName'].setValue(this.editData.bookName)
      this.bookForm.controls['authorName'].setValue(this.editData.authorName)
      this.bookForm.controls['category'].setValue(this.editData.category)
      this.bookForm.controls['status'].setValue(this.editData.status)
      this.bookForm.controls['price'].setValue(this.editData.price)
      this.bookForm.controls['date'].setValue(this.editData.date)
    }
   
  }

  upsert(){
    if(this.bookForm.valid){
      if(!this.editData){
        //Mean Add New
        this.addBook();
      }else{
        //Mean Updated Existing one
        this.updateBook();
      }
    }

  }

  addBook(){
    if(this.bookForm.valid){
      this.api.postBook(this.bookForm.value).subscribe({
        next:(res)=>{
          //alert("Adding Product Successfully");
          Swal.fire(
            'تم إضافة الكتاب بنجاح',
            '',
            'success'
          )
          this.bookForm.reset();
          this.dialogRef.close('save');
          
        },
        error :()=>{
          alert("حدث خطأ ما");
        }
      });
    }
  }

  updateBook(){
    this.api.putBook(this.bookForm.value , this.editData.id)
    .subscribe({
      next:(res)=>{
        //alert("Product Updated Successfully");
        Swal.fire(
          'تم تحديث الكتاب بنجاح',
          '',
          'success'
        )
        this.bookForm.reset();
        this.dialogRef.close("update");
      },
      error:()=>{
        alert("حدث خطأ ما");
      }
    })
  }

}
