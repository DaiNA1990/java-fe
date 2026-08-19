import { EventEmitter } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export class EventDataService {

  event: EventEmitter<any> = new EventEmitter<any>();

  emit(data: any): void {
    this.event.emit(data);
  }
}