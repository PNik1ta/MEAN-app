import { Category } from './../../shared/interfaces';
import { MaterialService } from './../../shared/clasees/material.service';
import { of } from 'rxjs';
import { CategoryService } from './../../shared/services/categories.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef?: ElementRef;
  form: FormGroup;
  image?: File;
  imagePreview?: string | ArrayBuffer | null;
  isNew: boolean = true;
  category?: Category;

  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;
              return this.categoryService.getById(params['id'])
            }

            return of(null);
          }
        )
      )
      .subscribe(
        category => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextIputs();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputRef?.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      // create
      obs$ = this.categoryService.create(this.form.value.name, this.image);
    } else {
      // update
      obs$ = this.categoryService.update(this.category?._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Changes saved');
        this.form.enable();
        this.router.navigate(['/assortment']);
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    )
  }

  deleteCategory(): void {
    const decision = window.confirm(`Are you sure, that you want to delete category ${this.category?.name}`);
    if (decision) {
      if (this.category?._id) {
        this.categoryService.delete(this.category._id)
          .subscribe(
            response => MaterialService.toast(response.message),
            error => MaterialService.toast(error.error.message),
            () => this.router.navigate(['/assortment'])
          );
      }

    }
  }

}
