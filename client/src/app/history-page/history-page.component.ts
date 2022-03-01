import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from './../shared/clasees/material.service';

import { Filter } from './../shared/interfaces';
import { Order } from '../shared/interfaces';
import { OrdersService } from './../shared/services/orders.service';
import { Subscription } from 'rxjs';

const STEP = 2;
@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  oSub!: Subscription;
  isFilterVisible: boolean = false;
  orders: Order[] = [];
  filter: Filter = {};

  loading: boolean = false;
  reloading: boolean = false;
  noMoreOrders: boolean = false;

  offset: number = 0;
  limit: number = STEP;

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  private fetch(): void {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore(): void {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  ngOnDestroy(): void {
    this.tooltip.destroy!();
    this.oSub!.unsubscribe();
  }

  applyFilter(filter: Filter): void {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

}
