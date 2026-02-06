import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IMovie, ProductsService } from '../products.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  
  // Get route parameter (movie ID)
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  
  movieId: number = 0;
  selectedMovie?: IMovie;
  trailerKey?: string;
  
  ngOnInit(): void {
    //get movie ID from URL
    this.movieId = Number(this.activatedRoute.snapshot.params['id']);
    
    // fetch movie details
    this.productService.getMovieById(this.movieId)
      .subscribe(movie => {
        this.selectedMovie = {
          ...movie,
          // price: Math.floor(Math.random() * 20) + 10,
          // stock: Math.floor(Math.random() * 20)
          vote_average:Math.floor(movie.vote_average *10)/10,
          price: this.productService.generateConsistentPrice(movie.id),
          stock: this.productService.generateConsistentStock(movie.id),
        };
      });
    
    //fetch trailer
    this.productService.getMovieTrailer(this.movieId)
      .subscribe(data => {
        const trailer = data.results.find((t: any) => t.type === 'Trailer');
        if (trailer) {
          this.trailerKey = trailer.key;
        }
      });
  }
}