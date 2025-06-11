import { Injectable } from '@angular/core';
import { HorarioTrabalhoResponse } from '../model/HorarioTrabalhoResponse';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class HorarioTrabalhoService {
  constructor(private readonly http: HttpClient) {}

  carregaPaginado(
    page: number,
    size: number
  ): Observable<HorarioTrabalhoResponse[]> {
    return this.http
      .get<{ content: HorarioTrabalhoResponse[] }>(
        `${API_CONFIG.baseUrl}/horarioTrabalhos?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: HorarioTrabalhoResponse[]; totalElements: number }> {
    return this.http.get<{
      content: HorarioTrabalhoResponse[];
      totalElements: number;
    }>(
      `${API_CONFIG.baseUrl}/horarioTrabalhos?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<HorarioTrabalhoResponse[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allHorarios: HorarioTrabalhoResponse[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap((horarioTrabalhos) => {
        allHorarios = allHorarios.concat(horarioTrabalhos);
        if (horarioTrabalhos.length < pageSize) {
          return of(allHorarios);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap((nextTipos) => {
              allHorarios = allHorarios.concat(nextTipos);
              return of(allHorarios);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<HorarioTrabalhoResponse> {
    return this.http.get<HorarioTrabalhoResponse>(
      `${API_CONFIG.baseUrl}/horarioTrabalhos/${id}`
    );
  }

  findByUsuarioId(
    usuarioId: number
  ): Observable<HorarioTrabalhoResponse[]> {
    return this.http.get<HorarioTrabalhoResponse[]>(
      `${API_CONFIG.baseUrl}/horarioTrabalhos/consultar/${usuarioId}`
    );
  }

  create(
    HorarioTrabalhoResponse: HorarioTrabalhoResponse
  ): Observable<HorarioTrabalhoResponse> {
    return this.http.post<HorarioTrabalhoResponse>(
      `${API_CONFIG.baseUrl}/horarioTrabalhos`,
      HorarioTrabalhoResponse
    );
  }

  update(
    HorarioTrabalhoResponse: HorarioTrabalhoResponse
  ): Observable<HorarioTrabalhoResponse> {
    return this.http.put<HorarioTrabalhoResponse>(
      `${API_CONFIG.baseUrl}/horarioTrabalhos/${HorarioTrabalhoResponse.id}`,
      HorarioTrabalhoResponse
    );
  }

  delete(id: any): Observable<HorarioTrabalhoResponse> {
    return this.http.delete<HorarioTrabalhoResponse>(
      `${API_CONFIG.baseUrl}/horarioTrabalhos/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    usuarioId?: number;
    diaSemana?: string;
    horaInicio?: string;
    horaFim?: string;
    ativo?: boolean;
  }): Observable<{
    content: HorarioTrabalhoResponse[];
    page: { totalElements: number };
  }> {
    let url = `${API_CONFIG.baseUrl}/horarioTrabalhos?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.usuarioId) {
      url += `&usuarioId=${encodeURIComponent(params.usuarioId)}`;
    }

    if (params.diaSemana) {
      url += `&diaSemana=${encodeURIComponent(params.diaSemana)}`;
    }

    if (params.horaInicio) {
      url += `&horaInicio=${encodeURIComponent(params.horaInicio)}`;
    }

    if (params.horaFim) {
      url += `&horaFim=${encodeURIComponent(params.horaFim)}`;
    }

    if (params.ativo !== undefined) {
      url += `&ativo=${params.ativo}`;
    }

    return this.http.get<{
      content: HorarioTrabalhoResponse[];
      page: { totalElements: number };
    }>(url);
  }
}
