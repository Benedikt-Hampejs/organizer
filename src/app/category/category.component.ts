import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { CategoryService } from '../services/category-service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  formCategory: Category = {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.loadCategory();
  }

  saveCategory() {
    this.categoryService.saveCategory(this.formCategory).subscribe();
    console.log(this.formCategory.category, this.formCategory.color);
  }

  editCategory(c: Category) {
    this.formCategory = c;
  }

  

}
