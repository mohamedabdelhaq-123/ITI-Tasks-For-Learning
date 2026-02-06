import { Component } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { NgClass } from '@angular/common';
import {products}  from "../productsArr"
import { IMovie } from '../products.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products',
  imports: [RouterLink, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  cartPath:string= "/cart";

  // products:IMovie[]=products;

   movies: any[] = [];  // Store movies here

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {  // method that runs once when component loads
    this.productService.getProducts()
      .subscribe(data => { // Observables are lazy - they don't do anything until you subscribe
        // console.log(data);  // See what API returns

        this.movies = data.results  // Store in component
        .map( (movie:any) => ({   // return new arr after calculating price and stock size randomly
          ...movie,    // spread content comming from api
          // price: Math.floor(Math.random()*20)+10,   // 10 -30
          // stock: Math.floor(Math.random()*20)        // 0-20
          vote_average:Math.floor(movie.vote_average *10)/10,
          price: this.productService.generateConsistentPrice(movie.id),
          stock: this.productService.generateConsistentStock(movie.id),

      }))
      });
  }



}

