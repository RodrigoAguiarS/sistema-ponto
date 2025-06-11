import { Injectable } from '@angular/core';
import { RegistroPontoResponse } from '../model/RegistroPontoResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RegistroPontoService {
  constructor(private readonly http: HttpClient) {}

  buscarRegistrosDeHoje(): Observable<RegistroPontoResponse[]> {
    return this.http.get<RegistroPontoResponse[]>(
      `${API_CONFIG.baseUrl}/ponto/hoje`
    );
  }

  registrarPonto(payload: {
    observacao: string;
  }): Observable<RegistroPontoResponse> {
    return this.http.post<RegistroPontoResponse>(
      `${API_CONFIG.baseUrl}/ponto/registrar`,
      payload
    );
  }

  registrarPontoManual(payload: {
    idUsuario: number;
    tipo: string;
    observacao: string;
    dataHora: string;
  }): Observable<RegistroPontoResponse> {
    return this.http.post<RegistroPontoResponse>(
      `${API_CONFIG.baseUrl}/ponto/inserir-manual`,
      payload
    );
  }

  buscarRegistrosPorUsuario(params: {
    page: number;
    size: number;
    id?: string;
    idUsuario?: number;
    ativo?: boolean;
  }): Observable<{
    content: RegistroPontoResponse[];
    page: { totalElements: number };
  }> {
    let url = `${API_CONFIG.baseUrl}/ponto/usuario/?page=${params.page}&size=${params.size}`;
    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.idUsuario) {
      url += `&idUsuario=${encodeURIComponent(params.idUsuario)}`;
    }

    if (params.ativo !== undefined) {
      url += `&ativo=${params.ativo}`;
    }

    return this.http.get<{
      content: RegistroPontoResponse[];
      page: { totalElements: number };
    }>(url);
  }

  delete(idRegistro: number): Observable<RegistroPontoResponse> {
    return this.http.delete<RegistroPontoResponse>(
      `${API_CONFIG.baseUrl}/ponto/${idRegistro}`
    );
  }

  buscarRegistroPorId(idRegistroPonto: number): Observable<RegistroPontoResponse> {
    return this.http.get<RegistroPontoResponse>(
      `${API_CONFIG.baseUrl}/ponto/${idRegistroPonto}`
    );
  }
}
