import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    template: `<h1 class="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">{{module}}</h1>
  <ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
    <li class="breadcrumb-item text-muted">
      <a class="text-muted text-hover-primary" href="javascript:;"> {{group}} </a>
    </li>
    <li class="breadcrumb-item">
      <span class="bullet bg-gray-200 w-5px h-2px"></span>
    </li>
    <li class="breadcrumb-item text-gray-900">{{name}}</li>
  </ul>`,
    host: {
        class: 'page-title d-flex flex-column justify-content-center flex-wrap me-3 '
    },
    standalone: false
})
export class NbBreadcrumbComponent implements OnInit {

  @Input() module: String;
  @Input() group: String;
  @Input() name: String;

  constructor() { }

  ngOnInit(): void { }
}
