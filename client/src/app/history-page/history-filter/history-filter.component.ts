import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MaterialDatePicker, MaterialService } from './../../shared/clasees/material.service';

import { Filter } from './../../shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>();

  @ViewChild('start') startRef!: ElementRef;
  @ViewChild('end') endRef!: ElementRef;
  start!: MaterialDatePicker;
  end!: MaterialDatePicker;

  order!: number;

  isValid: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.start.destroy!();
    this.end.destroy!();
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = false;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  submitFilter(): void {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }

}
