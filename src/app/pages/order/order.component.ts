import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import {
  OrderService,
  Order,
  OrderAddress,
} from '../../services/order.service';
import { SessionService } from '../../services/session.service';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PricePipe],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: CartItem[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['Magyarország', Validators.required],
      phone: ['', Validators.required],
      payment: ['card', Validators.required],
    });
  }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }

    const user = this.sessionService.getUserSession();
    if (user) {
      this.orderForm.patchValue({
        name: user.name,
        email: user.email,
      });
    }
  }

  get total(): number {
    return this.cartService.getTotalPrice();
  }

  async onSubmit() {
    if (this.orderForm.valid && this.cartItems.length > 0) {
      this.isSubmitting = true;

      try {
        const formValue = this.orderForm.value;

        const user = this.sessionService.getUserSession();
        const userId = user ? user.uid : 'guest';

        const address: OrderAddress = {
          name: formValue.name,
          street: formValue.street,
          city: formValue.city,
          postalCode: formValue.postalCode,
          country: formValue.country,
          phone: formValue.phone,
          email: formValue.email,
        };

        const order: Omit<Order, 'id'> = {
          userId: userId,
          items: this.cartItems,
          totalPrice: this.total,
          address: address,
          status: 'pending',
          createdAt: new Date(),
        };

        const orderId = await this.orderService.submitOrder(order);

        this.cartService.clearCart();

        alert('Köszönjük a rendelést! A rendelés azonosítója: ' + orderId);
        this.router.navigate(['/']);
      } catch (error: any) {
        console.error('Error submitting order:', error);
        alert('Hiba történt a rendelés feldolgozása során: ' + error.message);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
