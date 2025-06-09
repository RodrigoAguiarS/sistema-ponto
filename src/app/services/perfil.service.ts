import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PerfilResponse } from '../model/PerfilResponse';
import { API_CONFIG } from '../config/api.config';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<PerfilResponse[]> {
    return this.http
      .get<{ content: PerfilResponse[] }>(
        `${API_CONFIG.baseUrl}/perfis?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: PerfilResponse[]; totalElements: number }> {
    return this.http.get<{ content: PerfilResponse[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/perfis?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<PerfilResponse[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allPerfis: PerfilResponse[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap((perfis) => {
        allPerfis = allPerfis.concat(perfis);
        if (perfis.length < pageSize) {
          return of(allPerfis);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap((nextTipos) => {
              allPerfis = allPerfis.concat(nextTipos);
              return of(allPerfis);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<PerfilResponse> {
    return this.http.get<PerfilResponse>(
      `${API_CONFIG.baseUrl}/perfis/${id}`
    );
  }

  create(PerfilResponse: PerfilResponse): Observable<PerfilResponse> {
    return this.http.post<PerfilResponse>(
      `${API_CONFIG.baseUrl}/perfis`,
      PerfilResponse
    );
  }

  update(PerfilResponse: PerfilResponse): Observable<PerfilResponse> {
    return this.http.put<PerfilResponse>(
      `${API_CONFIG.baseUrl}/perfis/${PerfilResponse.id}`,
      PerfilResponse
    );
  }

  delete(id: any): Observable<PerfilResponse> {
    return this.http.delete<PerfilResponse>(
      `${API_CONFIG.baseUrl}/perfis/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    descricao?: string;
  }): Observable<{ content: PerfilResponse[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/perfis?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    return this.http.get<{
      content: PerfilResponse[];
      page: { totalElements: number };
    }>(url);
  }
}
