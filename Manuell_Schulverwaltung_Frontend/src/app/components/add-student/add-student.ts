import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-student.html',
  styleUrls: ['./add-student.css']
})
export class AddStudentComponent {

  student = {
    name: '',
    geburtstag: '',
    geschlecht: '',
    klasse: ''
  };

  constructor(private http: HttpClient) {}

addStudent() {
  this.http.post('http://localhost:5287/api/schueler/add', this.student)
    .subscribe({
      next: () => {
        console.log('OK');

        this.student = {
          name: '',
          geburtstag: '',
          geschlecht: '',
          klasse: ''
        };

        window.location.reload();
      },
      error: (err: any) => console.error(err)
    });
}
}
