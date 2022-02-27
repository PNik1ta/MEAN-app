import { Component, OnInit } from '@angular/core';

import { Category } from './../../shared/interfaces';
import { CategoryService } from './../../shared/services/categories.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss']
})
export class OrderCategoriesComponent implements OnInit {

  categories$!: Observable<Category[]>;

  constructor(private categoriesService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch();
  }

}
