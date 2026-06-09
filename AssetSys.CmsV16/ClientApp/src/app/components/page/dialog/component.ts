import { Component, ContentChild, inject, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NbDialogBaseComponent } from './dialog.base';

@Component({
  selector: 'nb-page-dialog',
  templateUrl: './component.html',
})
export class NbPageDialogComponent implements OnInit, OnDestroy {

  @Input() service: any;
  @Input() width: number = 70;
  @Input() title: string = '';

  @ContentChild('edit') editTemplate: TemplateRef<any>;

  private parents: any = inject(NbDialogBaseComponent, { optional: true });

  visibleSubject: BehaviorSubject<boolean>;
  visibleSubject$: Observable<boolean>;

  showFormSubject: BehaviorSubject<boolean>;
  showFormSubject$: Observable<boolean>;

  submitSubject: BehaviorSubject<boolean>;
  submitSubject$: Observable<boolean>;

  private unsubscribe: Subscription[] = [];

  get isEdit() {
		return this.parents[0].isEdit;
	}

  constructor() {
    this.visibleSubject = new BehaviorSubject<boolean>(false);
    this.visibleSubject$ = this.visibleSubject.asObservable();

    this.showFormSubject = new BehaviorSubject<boolean>(false);
    this.showFormSubject$ = this.showFormSubject.asObservable();

    this.submitSubject = new BehaviorSubject<boolean>(false);
    this.submitSubject$ = this.submitSubject.asObservable();
  }

  show() {
    this.visibleSubject.next(true);
  }

  close() {
    this.showFormSubject.next(false);
    this.visibleSubject.next(false);
  }

  showForm() {
    this.showFormSubject.next(true);
  }

  async submit() {
    this.submitSubject.next(true);
    await this.parents[0].submit();
    this.submitSubject.next(false);
  }

  visibleChange(e: any) {
    this.visibleSubject.next(e);
    if (!e)
      this.showFormSubject.next(e);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit() {
  }

}