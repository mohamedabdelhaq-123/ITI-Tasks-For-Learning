import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {products,Iproducts}  from "../productsArr"


@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent {
  activatedRoute:number = inject(ActivatedRoute).snapshot.params['id'];

    product:Iproducts=products[this.activatedRoute-1];
    

}

