import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable ,throwError} from "rxjs";
import { tap ,catchError} from 'rxjs/operators';

@Injectable()
export class FileService extends BaseService {

  constructor() {
    super();
    this.setModule('UploadFile');
  }

  uploadTemp(data: any): Observable<any> {
    return this.post('UploadTemp', data);
  }

  DonwloadTemp(data: any): Observable<any> {
    return this.downloadFile('DonwloadTemp', data, { responseType: 'blob', observe: 'response' });
  }

  upload(data: any): Observable<any> {
    return this.post('Upload', data);
  }

  download(data: any): Observable<any> {
    // return this.get('Donwload', data);
    //return this.downloadFile('DownloadFile', data, { responseType: 'blob', observe: 'response' });
    const viewableExts = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp'];
    return this.downloadFile('DownloadFile', data, { responseType: 'blob', observe: 'response' as 'response' }).pipe(
      tap((resp: any) => {
        try {
          // resp có thể là Blob hoặc HttpResponse<Blob>
          let blob: Blob;
          let headers: any = null;
          let status: number | undefined;
          if (resp instanceof Blob) {
            blob = resp;
          } else {
            // HttpResponse
            blob = resp.body instanceof Blob ? resp.body : new Blob([resp.body]);
            headers = resp.headers;
            status = resp.status;
          }
          const contentType = headers?.get ? headers.get('content-type') : blob.type;
          const cd = headers?.get ? headers.get('content-disposition') : null;
          // lấy filename từ content-disposition hoặc từ data.filename
          let filename: string | undefined;
          if (cd) {
            const m = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/.exec(cd);
            if (m && m[1]) {
              try { filename = decodeURIComponent(m[1]); } catch { filename = m[1]; }
            }
          }
          if (!filename && data && typeof data === 'object' && data.filename) filename = data.filename;

          const ext = filename ? ('.' + (filename.split('.').pop() || '').toLowerCase()) : '';
          const isViewableByType = contentType ? (contentType.toLowerCase() === 'application/pdf' || contentType.toLowerCase().startsWith('image/')) : false;
          const isViewableByExt = viewableExts.includes(ext);
          const shouldOpenInNewTab = isViewableByType || isViewableByExt;
          if (shouldOpenInNewTab) {
            // nếu blob.type rỗng nhưng server cho contentType, tái tạo blob với type
            let displayBlob = blob;
            if ((!blob.type || blob.type === '') && contentType) {
              displayBlob = new Blob([blob], { type: contentType });
            }
            const blobUrl = window.URL.createObjectURL(displayBlob);
            // cố gắng mở tab mới và hiển thị; với PDF dùng embed để tăng khả năng render
            const w = window.open('', '_blank');
            if (w) {
              try {
                if (contentType && contentType.toLowerCase() === 'application/pdf') {
                  w.document.write(`<html><head><title>${filename || ''}</title></head><body style="margin:0"><embed src="${blobUrl}" type="${contentType}" width="100%" height="100%"></embed></body></html>`);
                } else {
                  // với ảnh/video/audio, set direct URL thường đủ
                  w.location.href = blobUrl;
                }
              } catch (err) {
                const a = document.createElement('a');
                a.href = blobUrl;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                a.remove();
              }
            } else {
              // popup bị chặn -> fallback: anchor mở tab mới (không dùng download attribute)
              const a = document.createElement('a');
              a.href = blobUrl;
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
              a.remove();
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
           }
          //else {
          //   // giữ nguyên: tải file về
          //   const url = URL.createObjectURL(blob);
          //   const a = document.createElement('a');
          //   a.href = url;
          //   a.download = filename || 'file';
          //   document.body.appendChild(a);
          //   a.click();
          //   a.remove();
          //   setTimeout(() => URL.revokeObjectURL(url), 1000);
          // }
        } catch (ex) {
          console.error('Error handling download response', ex, { resp, data });
        }
      }),
      catchError(err => {
        console.error('FileService.download error', { err, data });
        return throwError(() => err);
      })
    );
  }

  uploadTemplate(data: any): Observable<any> {
    return this.post('UploadTemplate', data);
  }

  downloadTemplate(data: any): Observable<any> {
    return this.get('DonwloadTemplate', data);
  }

}
