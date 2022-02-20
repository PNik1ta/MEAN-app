import { Category } from './../interfaces';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }

  create(name: string, image?: File): Observable<Category> {
    const fd = new FormData();

    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('name', name);

    return this.http.post<Category>('/api/category', fd);
  }


  update(id: string | undefined, name: string, image?: File): Observable<Category> {
    const fd = new FormData();

    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('name', name);

    return this.http.patch<Category>(`/api/category/${id}`, fd);
  }
}