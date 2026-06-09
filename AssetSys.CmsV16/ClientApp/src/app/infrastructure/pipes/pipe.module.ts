// Anglar
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetObjectPipe } from './get-object.pipe';
import { FormatTextPipe } from './format-text.pipe';
import { RemoveUnicodePipe } from './remove-unicode.pipe';

@NgModule({
	imports: [CommonModule],
	declarations: [
		GetObjectPipe,
		FormatTextPipe,
		RemoveUnicodePipe
	],
	exports: [
		GetObjectPipe,
		FormatTextPipe,
		RemoveUnicodePipe
	],
	providers: []
})
export class AppPipeModule {}
