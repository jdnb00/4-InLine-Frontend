import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type JugadaDto = {
  item1: number; // fila
  item2: number; // columna
  item3: boolean; // marcada
  item4: number; // jugador
};
interface PostNuevaJugadaResultDto {
  matrizJugadas: JugadaDto[];
  finalizado: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '4-In-Line-Front';
  UrlBase: string = 'https://localhost:7075/4InLine/api/'
  nombre: string = '';
  nombreEnviado: boolean = false;
  
  filas: number = 6;
  columnas: number = 7;
  tablero: string[][] = [];

  idJuego: string = '';
  finalizado: boolean = false;
  estilosTablero: string[][] = [];
  ganador: number | null = null;

  turnoJugador: number = 0; // 0 = Player 1, 1 = Player 2

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

    this.http.post<string[][]>(this.UrlBase + 'One/NuevoJuego/'+ this.columnas + "/" + this.filas, body)
      .subscribe({
      next: (respuesta) => {
        this.pintaTableroNuevo(respuesta);
      },
      error: (error) => {
        //this.pintaTableroNuevo(error);
        console.error('Error al crear el juego:', error);
        alert('No se pudo crear el tablero. Intenta de nuevo.');
      },
    });
  }  
  
  pintaTableroNuevo(respuesta : any){
    // const respuesta1 = {
    //   idJuego: '13456',
    //   columnasMax: this.columnas,
    //   filasMax: this.filas,
    //   finalizado: false,
    // };
    // respuesta = respuesta1;
    
    this.estilosTablero = Array.from({ length: respuesta.filasMax }, () =>
      Array(respuesta.columnasMax).fill('')
    );

    console.log('Tablero recibido del backend:', respuesta);
    this.idJuego = respuesta.idJuego;
    this.finalizado = respuesta.finalizado;

    // Crear tablero vacío con dimensiones del backend
    this.tablero = Array.from({ length: respuesta.filasMax }, () =>
      Array(respuesta.columnasMax).fill('')
    );

    // 🔄 Reiniciar turno al jugador 1
    this.turnoJugador = 0;
  }

  jugar(columna: number) {
    console.log(`Columna jugada: ${columna}`);

    if (this.finalizado) {
    alert('El juego ya finalizó.');
    return;
  }

  const body = {
    idJuego: this.idJuego,
    columnaSeleccionada: columna
  };

  this.http.post<PostNuevaJugadaResultDto>(this.UrlBase + 'One/NuevaJugada/'+ this.idJuego + '/' + this.turnoJugador + '/' + columna, body)
    .subscribe({
      next: (respuesta) => {
      this.procesarRespuestaJugada(respuesta);
      }, 
      error: (err) => {
      console.error('Error al hacer jugada:', err);
      //this.procesarRespuestaJugada(respuesta);
      }
    });
  }

  procesarRespuestaJugada(respuesta: PostNuevaJugadaResultDto) {
    // const respuesta1: PostNuevaJugadaResultDto = {
    //   matrizJugadas: [
    //     { item1: 5, item2: 0, item3: true, item4: 0 }, // serie ganadora
    //     { item1: 5, item2: 1, item3: true, item4: 0 },
    //     { item1: 5, item2: 2, item3: true, item4: 0 },
    //     { item1: 5, item2: 3, item3: true, item4: 0 },

    //     { item1: 5, item2: 4, item3: false, item4: 1 }, // serie perdedora
    //     { item1: 5, item2: 5, item3: false, item4: 1 },
    //     { item1: 5, item2: 6, item3: false, item4: 1 },
    //     { item1: 4, item2: 6, item3: false, item4: 1 },
    //   ],
    //   finalizado: true,
    // };
    // respuesta = respuesta1;

    // Actualiza el estado finalizado
    this.finalizado = respuesta.finalizado;

      // Reset tablero visual y estilos
    for (let i = 0; i < this.tablero.length; i++) {
      for (let j = 0; j < this.tablero[i].length; j++) {
        this.tablero[i][j] = '';
        this.estilosTablero[i][j] = '';
      }
    }

    // Aplicar jugadas
    respuesta.matrizJugadas.forEach(({ item1: fila, item2: columna, item3: esGanadora, item4: jugador }) => {
      this.tablero[fila][columna] = jugador === 0 ? 'X' : 'O';
      if (esGanadora) {
        this.estilosTablero[fila][columna] = 'ganadora';
      }
    });

    if (this.finalizado) {
      alert('¡Juego terminado!');
      this.pintarGanador(respuesta);
    }
    else{
      // Simulamos una jugada por ahora
      console.log(`Jugador ${this.turnoJugador + 1}`);
      // Cambiar turno si el juego no ha terminado
      this.turnoJugador = this.turnoJugador === 0 ? 1 : 0;
    }

  }
  
  pintarGanador(respuesta: PostNuevaJugadaResultDto) {
    const jugadaGanadora = respuesta.matrizJugadas.find(jugada => jugada.item3); // item3 = esGanadora
    if (jugadaGanadora) {
      this.ganador = jugadaGanadora.item4; // item4 = jugador
    }
  }
  enviar() {
    if (this.nombre.trim()) {
      this.nombreEnviado = true;
    }
  }

}
