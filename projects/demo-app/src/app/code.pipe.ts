import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'code',
  standalone: true
})
export class CodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

