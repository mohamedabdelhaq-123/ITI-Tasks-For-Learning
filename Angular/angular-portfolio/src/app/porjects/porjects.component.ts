import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './porjects.component.html',
  styleUrl: './porjects.component.css'
})
export class projectsComponent {
  
  projects = [
    {
      title: 'LadderLogic JS',
      description: 'Tactical game governing complex collision and card rules'
    },
    {
      title: 'LibraObject',
      description: 'Robust OOP architecture optimized for high-volume resource management'    },
    {
      title: 'ooking Forecast',
      description: 'Predictive forecasting booking cancellations with high accuracy.'
    }
  ];
  
}