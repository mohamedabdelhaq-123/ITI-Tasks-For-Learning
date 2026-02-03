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
 // little prince, Dream of the Red Chamber
// And Then There Were None, The 7 Habits of Highly Effective People
// Don’t Sweat the Small Stuff…, The Power of Positive Thinking
// The Secret, The Celestine Prophecy , The Power of Habit
// The Catcher in the Rye,Pride and Prejudice, The Girl with the Dragon Tattoo, The Road

