import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@appkkkh/modules/user/auth/services/auth.service';
import menus from './menus.json';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  items: any[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUserSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: any) => this.items = this.filterByRoles(menus, user?.roleCodes ?? []));
  }

  // bỏ menu có "roles" mà user không có role nào trong đó
  private filterByRoles = (items: any[], roleCodes: string[]): any[] => items
    .filter((item: any) => !item.roles?.length || item.roles.some((r: string) => roleCodes.includes(r)))
    .map((item: any) => item.subs ? { ...item, subs: this.filterByRoles(item.subs, roleCodes) } : item);

}
