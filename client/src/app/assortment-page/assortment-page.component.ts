import { Component, OnInit } from '@angular/core';

import { Category } from './../shared/interfaces';
import { CategoryService } from './../shared/services/categories.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assortment-page',
  templateUrl: './assortment-page.component.html',
  styleUrls: ['./assortment-page.component.scss']
})
export class AssortmentPageComponent implements OnInit {

  categories$?: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.fetch();
  }

}
