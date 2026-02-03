import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

interface ILink{
  name:string;
  path:string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  links:ILink[]=[
    {name:"Log in",path:"login"},
    {name:"Register",path:"register"},
    {name:"Products",path:"products"},
    {name:"Shopping Cart",path:"cart"}
  ]
}
