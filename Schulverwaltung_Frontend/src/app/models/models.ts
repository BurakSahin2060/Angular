export interface Student {
  id: number;
  name: string;
  klasse: string;
  geschlecht: string;
  geburtstag: string;
  alter: number;
}

export interface Classroom {
  id: number;
  name: string;
  raumInQm: number;
  plaetze: number;
  hasCynap: boolean;
}