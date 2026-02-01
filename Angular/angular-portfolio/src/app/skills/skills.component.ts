import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  
  skills = [
    { name: 'HTML', level: 60 },
    { name: 'CSS', level: 50 },
    { name: 'JavaScript', level: 70 },
    { name: 'Bootstrap', level: 65 },
    { name: 'Angular', level: 5 }
  ];
  
}