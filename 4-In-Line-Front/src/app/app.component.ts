import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '4-In-Line-Front';
  nombre: string = '';
  nombreEnviado: boolean = false;

  enviar() {
    if (this.nombre.trim()) {
      this.nombreEnviado = true;
    }
  }
}
