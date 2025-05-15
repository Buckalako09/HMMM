import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true,
})
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number') return '';

    return `${value.toLocaleString('hu-HU')} Ft`;
  }
}
