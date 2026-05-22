import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-room.html',
  styleUrls: ['./add-room.css']
})
export class AddRoomComponent {

  room = {
    name: '',
    raumInQm: 0,
    plaetze: 0,
    hasCynap: false
  };

  constructor(private http: HttpClient) {}

addRoom() {
  this.http.post('http://localhost:5287/api/klassenraum/add', this.room)
    .subscribe({
      next: () => {
        console.log('OK');

        this.room = {
          name: '',
          raumInQm: 0,
          plaetze: 0,
          hasCynap: false
        };

        window.location.reload();
      },
      error: (err: any) => console.error(err)
    });
}
}
