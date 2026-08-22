import { Component, OnInit, forwardRef, ViewChild, ElementRef, Renderer2, Input, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { first, take, tap } from 'rxjs/operators';
//import { UploadFileService } from '@appkkkh/modules/files/file/services/upload-file.service';
//import { FileService } from '@appkkkh/modules/files/file/services/file.service';
import { NbBaseComponent } from '../../form.base';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { map } from 'lodash';

@Component({
    selector: 'nb-file',
    template: `
    <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
        [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
        <div class="fv-row">
            <div class="dropzone">
                <div class="dz-message needsclick">
                    <i class="ki-duotone ki-file-up fs-3x text-primary"><span class="path1"></span><span class="path2"></span></i>
                    <div class="ms-4">
                        <h3 class="fs-5 fw-bold text-gray-900 mb-1">Drop files here or click to upload.</h3>
                        <span class="fs-7 fw-semibold text-gray-500">Upload up to 10 files</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div class="dropzone dropzone-queue mb-2">
                <div class="dropzone-panel mb-lg-0 mb-2">
                    <a class="dropzone-select btn btn-sm btn-primary me-2">Chọn file</a>
                    <a class="dropzone-upload btn btn-sm btn-light-primary me-2">Upload All</a>
                    <a class="dropzone-remove-all btn btn-sm btn-light-primary">Remove All</a>
                </div>
                <div class="dropzone-items wm-200px">
                    <div class="dropzone-item" style="display:none">
                        <div class="dropzone-file">
                            <div class="dropzone-filename" title="some_image_file_name.jpg">
                                <span data-dz-name>some_image_file_name.jpg</span>
                                <strong>(<span data-dz-size>340kb</span>)</strong>
                            </div>
                            <div class="dropzone-error" data-dz-errormessage></div>
                        </div>
                        <div class="dropzone-progress">
                            <div class="progress">
                                <div
                                    class="progress-bar bg-primary"
                                    role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress>
                                </div>
                            </div>
                        </div>
                        <div class="dropzone-toolbar">
                            <span class="dropzone-start"><i class="bi bi-play-fill fs-3"></i></span>
                            <span class="dropzone-cancel" data-dz-remove style="display: none;"><i class="bi bi-x fs-3"></i></span>
                            <span class="dropzone-delete" data-dz-remove><i class="bi bi-x fs-1"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="w-100" *ngIf="!readonly">
                <div class="dropzone dropzone-default dz-clickable" *ngIf="uploadType === 'box'">
                    <div class="dz-message needsclick">
                        <i class="ki-duotone ki-file-up fs-3x text-primary">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </i>
                        <div class="ms-4">
                            <h3 class="fs-5 fw-bold text-gray-900 mb-1">Kéo hoặc click để chọn file.</h3>
                            <span class="fs-7 fw-semibold text-gray-400">{{placeholder}}</span>
                        </div>
                    </div>
                </div>
                <a class="dropzone-select btn btn-label-brand btn-bold btn-sm" *ngIf="uploadType === 'button'">Chọn file</a>
                <input class="file-input" #file type="file" (change)="onFileChange(file.files)" />
            </label>
            <div class="dropzone dropzone-queue">
                <div class="dropzone-items" *ngIf="listFiles.length !== 0">
                    <div class="dropzone-item" *ngFor="let item of listFiles; let i = index">
                        <div class="dropzone-file">
                            <div class="dropzone-filename" title="{{item.fileName}}">
                                <span data-dz-name>{{item.fileName}}</span> <strong>(<span data-dz-size>{{item.size |
                                        number:
                                        '1.0-0'}}mb</span>)</strong>
                            </div>
                            <div class="dropzone-error" data-dz-errormessage>{{item.message}}</div>
                        </div>
                        <div class="dropzone-progress" [class.d-none]="item.process === 100">
                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </div>
                        <div class="dropzone-toolbar">
                            <span class="dropzone-delete me-2" data-dz-remove (click)="downloadFile(i)"
                                title="{{item.path}}" *ngIf="item.path !== ''">
                                <em class="bi bi-cloud-download fs-2"></em>
                            </span>
                            <span class="dropzone-delete" data-dz-remove (click)="removeFile(i)" *ngIf="!readonly">
                                <em class="bi bi-x fs-2"></em>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nb-form-box>
    `,
    styles: [`.file-input { display: none; }`],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbFileComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbFileComponent)
        }
    ],
    standalone: false
})
export class NbFileComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() arrIds: number[];
    @Input() maxSize: number = 5;
    @Input() extension: string = '';
    @Input() maxFile: number = 1;
    @Input() isSaveFile: boolean = true;
    @Input() uploadType: 'button' | 'box' = 'button';
    @ViewChild('file', { static: false }) file: ElementRef;

    listFiles: any = [];

    constructor(
        //private uploadFile: UploadFileService,
        //private fileService: FileService,
        private renderer: Renderer2) {
        super();
    }

    get value() {
        return this._value;
    }

    set value(val) {

        if (this.formCtrl) {
            this.formCtrl.setValue(val);
        }

        this._value = val;
        this.propagateChange(this._value);
    }

    writeValue(obj: any): void {
        if (obj !== undefined) {
            this._value = obj;
        }
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        return undefined;
    }

    setDisabledState?(isDisabled: boolean): void {
        return undefined;
    }

    propagateChange = (_: any) => { return undefined; };

    onFileChange(files: any) {

        if (files.length <= 0) {
            this.file.nativeElement.value = null;
            return;
        }

        if (this.maxFile === 1) {
            this.listFiles.splice(0, this.listFiles.length);
        }

        for (let index = 0; index < files.length; index++) {

            const uploadData = new FormData();

            const _fileExtension = files[index].name.split('.')[files[index].name.split('.').length - 1];
            const _size = files[index].size / 1014 / 1024;
            let _message = '';

            if (this.extension !== '' && this.extension.split('|').indexOf(_fileExtension) === -1) {
                _message = 'File không được phép sử dụng';
            }

            if (this.maxSize > 0 && _size > this.maxSize) {
                _message = 'File quá dung lượng';
            }

            const _file = {
                id: 0,
                fileName: files[index].name,
                path: '',
                size: _size.toFixed(2),
                message: _message,
                process: 0
            }

            this.listFiles.push(_file);

            if (_message !== '')
                continue;

            uploadData.append('file' + index, files[index], files[index].name);

            // this.uploadFile.upload(uploadData).subscribe((res: any) => {

            //     _file.process = 100;

            //     if (res.statusCode === ResponseCode.ZERO) {
            //         res.data.forEach((element: any) => {
            //             _file.fileName = element.fileName;
            //             if (this.isSaveFile) {
            //                 this.saveFile(element.fileName, (rsf: any) => {
            //                     _file.id = rsf.data.id;
            //                     _file.path = rsf.data.path;
            //                     this.setValue();
            //                 });
            //             } else {
            //                 this.setValue();
            //             }
            //         });
            //     } else {
            //         _file.message = res.message;
            //         this.setValue();
            //     }

            // });

        }

        this.file.nativeElement.value = null;
    }

    saveFile(fileName: any, callback?: Function) {
        // this.fileService.quickAdd({
        //     name: fileName,
        //     fileName: fileName
        // }).subscribe((res: any) => {
        //     if (callback) {
        //         callback(res);
        //         // this.snackBar.open(res.message, 'Đóng', {
        //         //     duration: 5000,
        //         // });
        //     }
        // });
    }

    removeFile(index: any) {
        this.listFiles.splice(index, 1);
        this.setValue();
    }

    async getData(data: any) {

        if (data === undefined || data === null) {
            return;
        }

        let filter: any = {
            arrIds: []
        };

        if (Array.isArray(data))
            filter.arrIds.concat(data);

        if (!isNaN(data))
            filter.arrIds.push(data);

        filter.arrIds = filter.arrIds.filter((item: any) => map(this.listFiles, item => item.id).indexOf(item) < 0);

        if (typeof data === 'string')
            filter.name = data;

        if (filter.arrIds.length === 0 && filter.name === undefined)
            return;

        // this.fileService.getList(filter).subscribe((res: any) => {
        //     if (res.statusCode === ResponseCode.ZERO) {
        //         res.data.list.forEach((element: any) => {
        //             this.listFiles.push({
        //                 id: element.id,
        //                 fileName: element.name,
        //                 path: element.path,
        //                 size: (element.size / 1024 / 1024).toFixed(2),
        //                 message: '',
        //                 process: 100
        //             });
        //         });
        //     }
        // });
    }

    formControlDataChoose() {
        const subscr = this.formCtrl.valueChanges.pipe(
            first(),
            take(1),
            tap(val => {
                this.getData(val);
            })
        ).subscribe();

        this.subscriptions.push(subscr);
    }

    setValue() {
        const arrValue = this.listFiles.map((item: any) => item.id > 0 ? item.id : item.fileName);
        this.value = this.maxFile > 1 ? arrValue.length > 0 ? arrValue : null : (arrValue.length > 0 ? arrValue[0] : null);

        this.onChange.emit({
            value: this.value,
            listFiles: this.listFiles
        });
    }

    downloadFile(index: any) {
        window.open(this.listFiles[index].path);
    }

    ngOnInit() {

        super.ngOnInit();

        if (this.arrIds !== undefined && this.arrIds !== null && this.arrIds.length > 0)
            this.getData(this.arrIds);

        this.formControlDataChoose();

        if (this.maxFile > 1) {
            this.renderer.setAttribute(this.file.nativeElement, 'multiple', '');
        }
    }

}
