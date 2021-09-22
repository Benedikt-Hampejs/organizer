import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/internal/operators";
import { Category } from "src/app/models/Category";
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiURL + 'categories/';
@Injectable()
export class CategoryService {
  categoryChanged$ = new Subject<Category>();

  constructor(private http: HttpClient) { }

  getCategory(id: number | string): Observable<Category> {
    return this.http.get<Category>(BASE_URL + id);
  }

  loadCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(BASE_URL);
  }

  saveCategory(category: Category) {
    const method = category.id ? 'PUT' : 'POST';
    const id = category.id ? category.id : ''
    return this.http.request(method, BASE_URL + id, {
      body: category
    }).pipe(tap(savedCategory => {
      this.categoryChanged$.next(savedCategory);
    }));
  }
}
