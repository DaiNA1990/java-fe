import { Component, OnInit } from '@angular/core';
import menus from './menus.json';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.scss'],
    standalone: false
})
export class SidebarMenuComponent implements OnInit {

  items: any[] = menus;

  constructor() { }

  ngOnInit(): void {
  }

}
