import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns object from parent object
 */
@Pipe({
    name: 'removeUnicode',
    standalone: false
})
export class RemoveUnicodePipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(str: any): any {
		str = str.toLowerCase();
        str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a");
        str = str.replace(/đ/g, "d");
        str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e");
        str = str.replace(/í|ì|ỉ|ĩ|ị/g, "i");
        str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o");
        str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u");
        str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y");
        str = str.replace(/ /g, "_");
        return str;
	}
}
