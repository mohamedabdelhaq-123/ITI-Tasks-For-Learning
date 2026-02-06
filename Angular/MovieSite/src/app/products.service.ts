export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  
  // Generated fields for e-commerce
  price?: number;
  stock?: number;
  trailerKey?: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // bring angular http tool for api requests
import { Observable } from 'rxjs';  // ← Add this import

@Injectable({
    providedIn: "root"
})

export class ProductsService{  // decorate class as service by using injectable

  private apiKey = '0dd6eec314ddfaddc040049ec115000e';  // Your API key
  private apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}`;


    constructor(private myHttp: HttpClient) { }  // make the http avaliable to use to fetch data from api

      getProducts(): Observable<any> {  // observable like promise and method to get data
    return this.myHttp.get(this.apiUrl);  //  make a GET request and Returns an Observable with the data
      }

        getMovieTrailer(movieId: number): Observable<any> {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${this.apiKey}`;
  return this.myHttp.get(url);
}

getMovieById(id: number): Observable<any> {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`;
  return this.myHttp.get(url);
}

generateConsistentPrice(movieId: number): number {
  const seed = movieId % 20;
  return seed + 10;  // Price: 10-29
}

generateConsistentStock(movieId: number): number {
  const seed = (movieId * 7) % 100;
  return seed + 1;  // Stock: 1-100
}

 }
