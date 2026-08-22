import { Component, OnInit, forwardRef, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { first, take, tap } from 'rxjs/operators';
import { NbBaseComponent } from '../../form.base';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { environment } from '@srckkkh/environments/environment';
// import { FileService } from '@appkkkh/modules/files/file/services/file.service';
// import { UploadFileService } from '@appkkkh/modules/files/file/services/upload-file.service';

@Component({
    selector: 'nb-editor',
    template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <editor class="form-control p-0" [init]="editorOption"
        [class.form-control-solid]="!(formCtrl.touched && formCtrl.invalid)"
        [class.is-invalid]="formCtrl.touched && formCtrl.invalid"></editor>
  </nb-form-box>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbEditorComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbEditorComponent)
        }
    ],
    standalone: false
})
export class NbEditorComponent extends NbBaseComponent implements OnInit, OnDestroy {

  @Input() minHeight: number = 300;

  @ViewChild('editor', { static: false }) editorArea: ElementRef;

  editorOption: any;

  editor: any;

  constructor(
    //private uploadFileService: UploadFileService,
    //private fileService: FileService
    ) 
    {
    super();
  }

  get value() {
    return this._value || '';
  }

  set value(val) {
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

  getFormData() {
    this.formCtrl.valueChanges.pipe(
      first(),
      take(1),
      tap(val => {
        this.value = val;
        if (this.editor) this.editor.setContent(this.value);
      })
    ).subscribe();
  }

  initEditor() {
    this.editorOption = {
      base_url: environment.tinymceBaseUrl,
      suffix: '.min',
      height: 450,
      plugins: `preview importcss searchreplace autolink autosave 
      save directionality code visualblocks visualchars fullscreen image link media 
      template codesample table charmap pagebreak nonbreaking anchor 
      insertdatetime advlist lists wordcount help charmap quickbars emoticons code`,//fullpage(add need get content has html tag)
      //print paste hr imagetools textpattern noneditable 
      menubar: 'file edit view insert format tools table help',
      toolbar: `undo redo 
      | bold italic underline strikethrough 
      | fontselect fontsizeselect formatselect 
      | alignleft aligncenter alignright alignjustify 
      | outdent indent 
      | numlist bullist 
      | forecolor backcolor removeformat 
      | pagebreak 
      | charmap emoticons 
      | fullscreen  preview save print 
      | insertfile image media template link anchor codesample 
      | ltr rtl code`,
      toolbar_sticky: true,
      image_advtab: true,
      importcss_append: true,
      //images_upload_url: this.uploadFileService.uploadEditorUrl(),
      relative_urls: false,
      remove_script_host: false,
      file_picker_callback: (callback: any, value: any, meta: any) => {

        if (meta.filetype == 'image') {
          this.openChosenPicture((elm: any) => {
            callback(elm.original, { title: elm.name, text: elm.name });
          });
        }

        if (meta.filetype === 'file') {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');

          input.onchange = () => {
            var file = input.files![0] ?? null;
            this.uploadFile(file, (elm: any) => {
              callback(elm.path, { title: file.name, text: file.name });
            });
          };

          input.click();
        }
      },
      image_caption: true,
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      toolbar_drawer: 'sliding',
      contextmenu: "link image imagetools table",
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('init', (ed: any) => {
          ed.target.setContent(this.value);
        });
        editor.on('change', (ed: any) => {
          this.value = editor.getContent();
          this.formCtrl.setValue(this.value);
        });
      },
    };
  }

  uploadFile(file: any, callback?: any) {

    // const uploadData = new FormData();
    // uploadData.append('file', file, file.name);

    // const subscr = this.uploadFileService.upload(uploadData).subscribe((res: any) => {
    //   if (res.statusCode === ResponseCode.ZERO) {
    //     res.data.forEach((element: any) => {
    //       this.saveFile(element.fileName, (elm: any) => {
    //         if (callback)
    //           callback(elm);
    //       });
    //     });
    //   }
    // });

    // this.subscriptions.push(subscr);
  }

  saveFile(fileName: any, callback?: any) {

    // const subscr = this.fileService.quickAdd({
    //   name: fileName,
    //   fileName: fileName
    // }).subscribe((res: any) => {
    //   if (res.statusCode === ResponseCode.ZERO) {
    //     if (callback)
    //       callback(res.data);
    //   }
    // });

    // this.subscriptions.push(subscr);
  }

  openChosenPicture(callback?: any) {
    // const dialogRef = this.dialog.open(NbPictureSelectComponent, {
    //   width: "60%"
    // });

    // const subscr = dialogRef.afterClosed().subscribe((element: any) => {

    //   if (element === undefined || element === null)
    //     return;

    //   if (callback)
    //     callback(element);
    // });

    // this.subscriptions.push(subscr);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initEditor();
    this.getFormData();
  }

}
