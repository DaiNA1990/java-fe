import { Input, Output, EventEmitter, Directive, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { Subject, Subscription, catchError, finalize, firstValueFrom, of } from 'rxjs';

@Directive()
export abstract class NbBaseComponent implements OnInit, OnDestroy {

	@Input() formCtrl: AbstractControl = new FormControl();
	@Input() dataSource: any;
	@Input() name: string = '';
	@Input() label: string = '';
	@Input() placeholder: string = '';
	@Input() message: string = 'Vui lòng nhập thông tin';
	@Input() hint: string = '';
	@Input() tooltip: string = '';
	@Input() iconStart: string;
	@Input() iconEnd: string;
	@Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
	@Input() multiple: boolean = false;
	@Output() onChange: EventEmitter<any> = new EventEmitter<any>();

	_value: any;

	items: any = [];
	loadingSubject$ = new Subject<boolean>();

	subscriptions: Subscription[] = [];

	cdr = inject(ChangeDetectorRef);

	get hasValidator() {
		return this.formCtrl.hasValidator(Validators.required);
	}

	get value() {
		return this._value;
	}

	set value(val) {
		this._value = val;
		this.setValueControl(val);
		this.propagateChange(this._value);
	}

	setValueControl(val: any){
		this.formCtrl.setValue(val);
	}

	writeValue(obj: any): void {
		if (obj === undefined) return;

		this._value = obj;
		this.formCtrl.setValue(obj);
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		return undefined;
	}

	registerOnDisabledChange(fn: any): void {
		return undefined;
	}

	setDisabledState?(isDisabled: boolean): void {
		return undefined;
	}

	propagateChange = (_: any) => {
		return undefined;
	};

	async getData(keyword?: any, callback?: Function) {

		if (typeof this.dataSource !== 'function')
		{
			Object.assign(this.items, this.dataSource);
			return;
		}

		this.loadingSubject$.next(true);

		const res = await firstValueFrom<any>(this.dataSource(keyword || ''));

		if (res.statusCode !== ResponseCode.ZERO)
			return;

		this.items = res.data.list;

		if (callback !== undefined)
			callback();

		this.cdr.detectChanges();

		// const subscr = this.dataSource(keyword || '').pipe(
		// 	catchError(() => of([])),
		// 	finalize(() => this.loadingSubject$.next(false))
		// ).subscribe((res: any) => {
		// 	if (res.statusCode !== ResponseCode.ZERO)
		// 		return;

		// 	this.items = res.data.list;
		// 	if (callback !== undefined)
		// 		callback();
		// 	this.cdr.detectChanges();
		// });

		// this.subscriptions.push(subscr);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	ngOnInit(): void {
		this.getData();
		this.value = this.formCtrl.value;
	}

}
