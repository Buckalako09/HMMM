import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products = [
    {
      name: 'Piros Ruha',
      description: 'Elegáns női ruha alkalmakra.',
      price: 12990,
      image:
        'https://ruhafalva.hu/img/101/ifg867/500x500/ifg867.webp?time=1684251606',
    },
    {
      name: 'Fekete Kabát',
      description: 'Téli férfi kabát, melegen tart.',
      price: 23990,
      image: 'https://cdn.dresspack.hu/content/2023/09/ez396509a6351febc.jpg',
    },
    {
      name: 'Fehér Póló',
      description: 'Egyszerű és kényelmes nyári póló.',
      price: 4990,
      image:
        'https://chefs.hu/img/61620/ad-12900_altpic_1/feher-polo-malfini.webp?time=1708667944',
    },
  ];
}
