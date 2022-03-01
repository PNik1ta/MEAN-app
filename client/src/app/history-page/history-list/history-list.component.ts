import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from './../../shared/clasees/material.service';

import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order[] = [];

  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;

  selectedOrder!: Order;

  ngOnDestroy(): void {
    this.modal.destroy!();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity! * item.cost
    }, 0);
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
    this.modal.open!();
  }

  closeModal(): void {
    this.modal.close!();
  }
}
