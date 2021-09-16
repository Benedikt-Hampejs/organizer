import { Component, OnInit } from '@angular/core';
import { Category } from '../models/Category';
import { CategoryService } from '../services/category-service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  formCategory: Category = {}

  ngOnInit(): void {
  }

  saveCategory() {
    this.categoryService.saveCategory(this.formCategory).subscribe();
    console.log(this.formCategory.category, this.formCategory.color);
  }

}
