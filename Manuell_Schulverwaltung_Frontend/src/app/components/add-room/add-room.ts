import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-room.html'
})
export class AddRoomComponent {

  room = {
    name: '',
    raumInQm: 0,
    plaetze: 0,
    hasCynap: false
  };

  constructor(private api: ApiService) {}

  addRoom() {
    this.api.addRoom(this.room).subscribe({
      next: () => alert('Raum hinzugefügt'),
      error: (err) => console.error(err)
    });
  }
}