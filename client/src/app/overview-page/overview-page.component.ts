import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from './../shared/clasees/material.service';

import { AnalyticsService } from './../shared/services/analytics.service';
import { Observable } from 'rxjs';
import { OverviewPage } from './../shared/interfaces';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef!: ElementRef;
  tapTarget!: MaterialInstance;
  data$!: Observable<OverviewPage>;
  yesterday: Date = new Date();

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.data$ = this.analyticsService.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy!();
  }

  openInfo(): void {
    this.tapTarget.open!();
  }

}
