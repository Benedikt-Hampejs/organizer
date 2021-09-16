import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/internal/operators";
import { Category } from "src/app/models/Category";

const BASE_URL = 'http://localhost:3000/api/categories/';
@Injectable()
export class CategoryService {
  categoryChanged$ = new Subject<Category>();

  constructor(private http: HttpClient) { }

  getCategory(id: number | string): Observable<Event> {
    return this.http.get<Event>(BASE_URL + id);
  }

  loadCategory(): Observable<Event[]> {
    return this.http.get<Event[]>(BASE_URL);
  }

  saveCategory(category: Category) {
    const method = category.id ? 'PUT' : 'POST';
    const id = category.id ? category.id : ''
    return this.http.request(method, BASE_URL + id, {
      body: category
    }).pipe(tap(savedEvent => {
      this.categoryChanged$.next(savedEvent);
    }));
  }
}
