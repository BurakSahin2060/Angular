import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
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

  constructor(private api: ApiService) {}

  addStudent() {
    this.api.addStudent(this.student).subscribe({
      next: () => alert('Schüler hinzugefügt'),
      error: (err) => console.error(err)
    });
  }
}