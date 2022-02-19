import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AuthService } from './../../services/auth.service';
import { MaterialService } from './../../clasees/material.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('floating') floatingRef?: ElementRef;

  links = [
    { url: '/overview', name: 'Overview' },
    { url: '/analytics', name: 'Analytics' },
    { url: '/history', name: 'History' },
    { url: '/order', name: 'Add order' },
    { url: '/assortment', name: 'Assortment' },
  ]

  constructor(private auth: AuthService,
    private router: Router) { }

  ngAfterViewInit(): void {
    if (this.floatingRef) {
      MaterialService.initializeFloatingButton(this.floatingRef);
    }
  }

  ngOnInit(): void {
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
