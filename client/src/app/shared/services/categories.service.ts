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
}
