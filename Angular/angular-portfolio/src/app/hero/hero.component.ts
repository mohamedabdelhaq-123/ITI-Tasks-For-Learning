import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  
  name = 'Mohamed Abdelhaq';
  title = 'Software Engineer';
  profileImage = 'https://via.placeholder.com/300';
}