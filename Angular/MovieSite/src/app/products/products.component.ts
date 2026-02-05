import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';
import {products,Iproducts}  from "../productsArr"



@Component({
  selector: 'app-products',
  imports: [RouterLink, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  cartPath:string= "/cart";

  products:Iproducts[]=products;


}

