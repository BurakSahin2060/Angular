import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-list.html'
})
export class RoomListComponent implements OnInit {

  rooms: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.api.getRooms().subscribe({
      next: (data: any) => this.rooms = data,
      error: (err) => console.error(err)
    });
  }
}