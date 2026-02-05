import { formatCurrency } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  myRegisterForm:FormGroup=new FormGroup({  // key and value format
      name:new FormControl('',[Validators.required]),
    email: new FormControl("",[Validators.required,Validators.email]),
    username:new FormControl("", [Validators.required,Validators.pattern(/^\S+$/)]),
    password:new FormControl("", [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    confirmpass:new FormControl("", [Validators.required])
  });

  
  // name:FormControl = new FormControl('',
  //   [Validators.required]);
  
  // email:FormControl= new FormControl("",
  //   [Validators.required,Validators.email]
  // );

  // username:FormControl= new FormControl("",
  //   [Validators.required,Validators.pattern(/^\S+$/)]
  //   // req,nospace
  // )

  // password:FormControl= new FormControl("",
  //   [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]
  //   // req,minlen8,min1lower,min1upper,min1digit,min1specialchar
  // );

  // confirmpass:FormControl=new FormControl("",
  //   [Validators.required]
  //   // req,matchpass
  // );
checkSame():boolean
{
  if(this.myRegisterForm.get("confirmpass")?.value===this.myRegisterForm.get("password")?.value)
    return true;
  else
  return false;
}


}
