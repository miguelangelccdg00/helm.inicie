import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.css',
})
export class TestComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.makeRequest();
  }

  makeRequest(): void {
    this.http.get('http://localhost:3009/menu/items').subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
      },
      error: (err) => {
        console.error('Error en la solicitud:', err);
      }
    });
  }
}
