import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category-service/category.service';
import { Alert, ALERTS } from "../../models/Alert";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  alerts: Alert[] = [];

  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  formCategory: Category = {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.loadCategory();
  }

  saveCategory() {
    this.categoryService.saveCategory(this.formCategory).subscribe();
    this.alerts.push(ALERTS.filter(s => s.type == "success")[0]);
    //setTimeout(()=>this.alerts.pop(),3000);
  }

  editCategory(c: Category) {
    this.formCategory = c;
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
