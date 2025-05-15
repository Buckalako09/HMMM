import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './products.service';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'cart_items';
  private cartItemsSubject: BehaviorSubject<CartItem[]>;
  public cartItems$: Observable<CartItem[]>;

  constructor() {
    const storedItems = this.getCartItemsFromStorage();
    this.cartItemsSubject = new BehaviorSubject<CartItem[]>(storedItems);
    this.cartItems$ = this.cartItemsSubject.asObservable();
  }

  private getCartItemsFromStorage(): CartItem[] {
    const stored = sessionStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCartItemsToStorage(items: CartItem[]): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedItems);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }

    this.saveCartItemsToStorage(this.cartItemsSubject.value);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex].quantity = quantity;
      this.cartItemsSubject.next(updatedItems);
      this.saveCartItemsToStorage(updatedItems);
    }
  }

  removeFromCart(itemId: string): void {
    const filteredItems = this.getCartItems().filter(
      (item) => item.id !== itemId
    );
    this.cartItemsSubject.next(filteredItems);
    this.saveCartItemsToStorage(filteredItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    sessionStorage.removeItem(this.storageKey);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }
}
