import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],  // to use loop
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})

export class AboutComponent {
  
  bio = 'Specializing in the intersection of Web Development and Machine Learning. Leveraging deep expertise in Data Science and backend architecture to deliver impactful solutions.';
  
  cvDownloadLink = 'src/assests/Mohamed Abdelhaq Resume.pdf'; // Put your CV in src/assets/cv/my-cv.pdf
  
  education = [
  {
    degree: 'Open Source Application Development',
    institution: 'Information Technology Institute (ITI)',
    year: 'Oct 2025 – Jul 2026',
    description: '9-Month intensive program focused on modern open source technologies and application development.'
  },
  {
    degree: 'Data Scientist Program',
    institution: 'Digital Egypt Pioneers Initiative (DEPI)',
    year: 'Oct 2024 - May 2025',
    description: 'Comprehensive data science program designed by IBM, covering machine learning, analytics, and data engineering.'
  },
  {
    degree: 'Introduction to Computer Science (CS50)',
    institution: 'Harvard University',
    year: 'Sep 2022 - Feb 2023',
    description: 'Harvard\'s renowned computer science course covering algorithms, data structures, web development, and programming fundamentals.'
  },
  {
    degree: 'Bachelor of Engineering in Mechatronics',
    institution: 'Egyptian Academy for Engineering',
    year: 'Oct 2020 – Jul 2025',
    description: 'Comprehensive engineering degree combining mechanical, electrical, and computer engineering principles.'
  }
];

  
}