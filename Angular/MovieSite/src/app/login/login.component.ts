import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user:{userEmail:string,userPass:string}={
    userEmail:"",
    userPass:""
  };

  getEmail(mail:NgModel)
  {
    console.log(mail);
    
  }

  checkRegex(mail:string):Boolean
  {
    if(mail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
    {
      return true;
    }
    else
      return false;
  }

  getPass(pass:NgModel)
  {
    console.log(pass);
  }


  submit(form:NgForm)
  {
    console.log(form);
  //   if(form.valid)
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  }
}
