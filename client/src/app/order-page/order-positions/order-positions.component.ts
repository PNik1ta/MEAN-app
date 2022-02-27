import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { MaterialService } from './../../shared/clasees/material.service';
import { OrderService } from './../order.service';
import { Position } from './../../shared/interfaces';
import { PositionService } from './../../shared/services/positions.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {

  positions$!: Observable<Position[]>;

  constructor(private route: ActivatedRoute,
    private positionService: PositionService,
    private order: OrderService) { }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionService.fetch(params['id'])
          }
        ),
        map(
          (positions: Position[]) => {
            return positions.map(position => {
              position.quantity = 1;
              return position;
            })
          }
        )
      );
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Added x${position.quantity}`);
    this.order.add(position);
  }

}
