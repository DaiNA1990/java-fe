import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, TranslateDirective, TranslatePipe],
  exports: [TranslateDirective, TranslatePipe],
})
export class TranslationModule {}
