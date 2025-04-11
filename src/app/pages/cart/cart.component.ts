import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartItems = [
    {
      name: 'Piros Ruha',
      price: 12990,
      quantity: 1,
      image: 'https://ruhafalva.hu/img/101/ifg867/500x500/ifg867.webp',
    },
    {
      name: 'Fehér Póló',
      price: 4990,
      quantity: 2,
      image:
        'https://chefs.hu/img/61620/ad-12900_altpic_1/feher-polo-malfini.webp',
    },
  ];

  get total(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}
