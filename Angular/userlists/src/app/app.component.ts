import { Component } from '@angular/core';

interface IuserList{
  profilePic:string;
  userName:string;
  email:string;
  phoneNumber:string;
  birthdate:string;
  role:string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'userlists';

  userList:IuserList[]=[
  {
    profilePic: 'https://i.pravatar.cc/150?img=11',
    userName: 'ahmed_hassan',
    email: 'ahmed.hassan@gmail.com',
    phoneNumber: '01001234567',
    birthdate: '1990-05-15',
    role: 'admin'
  },
  {
    profilePic: 'https://i.pravatar.cc/150?img=5',
    userName: 'fatma_mohamed',
    email: 'fatma.mohamed@gmail.com',
    phoneNumber: '01014567890',
    birthdate: '1985-08-22',
    role: 'user'
  },
  {
    profilePic: 'https://i.pravatar.cc/150?img=12',
    userName: 'omar_ibrahim',
    email: 'omar.ibrahim@gmail.com',
    phoneNumber: '01067890123',
    birthdate: '1992-12-03',
    role: 'moderator'
  },
  {
    profilePic: 'https://i.pravatar.cc/150?img=9',
    userName: 'mariam_ali',
    email: 'mariam.ali@gmail.com',
    phoneNumber: '01123456789',
    birthdate: '1988-03-30',
    role: 'user'
  },
  {
    profilePic: 'https://i.pravatar.cc/150?img=13',
    userName: 'youssef_salah',
    email: 'youssef.salah@gmail.com',
    phoneNumber: '01156789012',
    birthdate: '1993-07-18',
    role: 'user'
  },
  {
    profilePic: 'https://i.pravatar.cc/150?img=8',
    userName: 'nour_ahmed',
    email: 'nour.ahmed@gmail.com',
    phoneNumber: '01278901234',
    birthdate: '1995-11-25',
    role: 'moderator'
  }
];

  
}