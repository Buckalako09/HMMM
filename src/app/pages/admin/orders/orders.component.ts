import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OrderService,
  Order,
  OrderStatus,
} from '../../../services/order.service';
import { Observable } from 'rxjs';
import { PricePipe } from '../../../pipes/price.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    PricePipe,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  orders$!: Observable<Order[]>;
  expandedOrderId: string | null = null;
  availableStatuses: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Függőben' },
    { value: 'processing', label: 'Feldolgozás alatt' },
    { value: 'shipped', label: 'Szállítás alatt' },
    { value: 'delivered', label: 'Kézbesítve' },
    { value: 'cancelled', label: 'Törölve' },
  ];
  isUpdatingStatus = false;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.getAllOrders();
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Függőben',
      processing: 'Feldolgozás alatt',
      shipped: 'Szállítás alatt',
      delivered: 'Kézbesítve',
      cancelled: 'Törölve',
    };
    return statusMap[status] || status;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    if (!orderId || !newStatus) return;

    this.isUpdatingStatus = true;
    this.orderService
      .updateOrderStatus(orderId, newStatus)
      .then(() => {
        this.snackBar.open('Rendelés állapota frissítve!', 'Bezár', {
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
        this.snackBar.open(
          'Hiba történt a rendelés állapotának frissítésekor!',
          'Bezár',
          {
            duration: 3000,
          }
        );
      })
      .finally(() => {
        this.isUpdatingStatus = false;
      });
  }
}
