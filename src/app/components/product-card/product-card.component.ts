import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../pipes/price.pipe';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, PricePipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() mode: 'view' | 'admin' = 'view';
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<any>();

  constructor(private cartService: CartService) {}

  onDelete() {
    if (this.product?.id) {
      this.delete.emit(this.product.id);
    }
  }

  onEdit() {
    this.edit.emit(this.product);
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}
