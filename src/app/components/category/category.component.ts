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
  successAlert = ALERTS.filter(s => s.type == "success")[0];


  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  formCategory: Category = {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.loadCategory();
  }

  saveCategory() {
    this.categoryService.saveCategory(this.formCategory).subscribe();
    const alert: Alert = new Alert(this.successAlert);
    this.alerts.push(alert);
    setTimeout(()=>this.close(alert), 3000);
  }

  editCategory(c: Category) {
    this.formCategory = c;
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
