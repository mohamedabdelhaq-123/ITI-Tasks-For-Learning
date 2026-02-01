import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  
  name = 'John Doe';
  currentYear = new Date().getFullYear();
  
  contactMessage = 'Feel free to reach out for collaborations or just a friendly chat!';
  email = 'mohamed.abdelhaq99@gmail.com';
  
  socialMedia = {
    github: 'https://github.com/mohamedabdelhaq-123',
    linkedin: 'https://www.linkedin.com/in/mohamed-abdelhaq/',
  };
  
}