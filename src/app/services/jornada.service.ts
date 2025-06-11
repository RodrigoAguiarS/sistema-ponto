import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { JornadaResponse } from '../model/JornadaResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {

  constructor(private readonly http: HttpClient) {}

  buscarJornadaAtual(): Observable<JornadaResponse> {
    return this.http.get<JornadaResponse>(`${API_CONFIG.baseUrl}/jornada/atual`);
  }
}
