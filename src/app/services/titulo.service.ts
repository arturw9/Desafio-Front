import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';

export interface Parcela {
  numeroParcela: number;
  dataVencimento: string;
  valorParcela: number;
}

export interface Titulo {
  numeroTitulo: string;
  nomeDevedor: string;
  cpfDevedor: string;
  percentualJuros: number;
  percentualMulta: number;
  parcelas: Parcela[];
}

@Injectable({
  providedIn: 'root'
})
export class TituloService {
  private apiUrl = `${env.apiUrl}/Titulo/Listar`;

  constructor(private http: HttpClient) { }

  listarTitulos(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(this.apiUrl);
  }
}
