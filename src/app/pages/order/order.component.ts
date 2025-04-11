import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  orderForm: FormGroup;

  cartItems = [
    { name: 'Piros Ruha', price: 12990, quantity: 1 },
    { name: 'Fehér Póló', price: 4990, quantity: 2 },
  ];

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      payment: ['card', Validators.required],
    });
  }

  get total(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = {
        ...this.orderForm.value,
        items: this.cartItems,
        total: this.total,
      };
      console.log('Rendelés leadva:', orderData);
      alert('Köszönjük a rendelést!');
    }
  }
}
