import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '4-In-Line-Front';
  nombre: string = '';
  nombreEnviado: boolean = false;
  
  filas: number = 6;
  columnas: number = 7;
  tablero: string[][] = [];

  idJuego: string = '';
  finalizado: boolean = false;


  constructor(private http: HttpClient) {}

  crearTablero() {
    if (this.filas < 4 || this.columnas < 4) {
      alert('Las dimensiones mínimas son 4x4.');
      return;
    }
    
    const body = {
      filas: this.filas,
      columnas: this.columnas,
    };

    const respuesta1 = {
      idJuego: '13456',
      columnasMax: this.columnas,
      filasMax: this.filas,
      finalizado: false,
    };

    this.http.post<string[][]>('http://tu-api.com/api/juego', body)
      .subscribe({
      next: (respuesta) => {
        
        console.log('Tablero recibido del backend:', respuesta);
        this.idJuego = respuesta1.idJuego;
        this.finalizado = respuesta1.finalizado;

        // Crear tablero vacío con dimensiones del backend
        this.tablero = Array.from({ length: respuesta1.filasMax }, () =>
          Array(respuesta1.columnasMax).fill('')
        );
      },
      error: (error) => {

        this.idJuego = respuesta1.idJuego;
        this.finalizado = respuesta1.finalizado;

        // Crear tablero vacío con dimensiones del backend
        this.tablero = Array.from({ length: respuesta1.filasMax }, () =>
          Array(respuesta1.columnasMax).fill('')
        );

        // console.error('Error al crear el juego:', error);
        // alert('No se pudo crear el tablero. Intenta de nuevo.');
      },
    });
  }  
  
  jugar(col: number) {
    console.log(`Columna jugada: ${col}`);
  }

  enviar() {
    if (this.nombre.trim()) {
      this.nombreEnviado = true;
    }
  }

}
