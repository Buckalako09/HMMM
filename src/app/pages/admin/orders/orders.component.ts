import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class AdminOrdersComponent {
  orders = [
    {
      id: 'RND-001',
      customer: 'Kiss Anna',
      date: '2025-04-07',
      total: 17980,
      status: 'Feldolgozás alatt',
      items: [
        { name: 'Piros Ruha', qty: 1, price: 12990 },
        { name: 'Fehér Póló', qty: 1, price: 4990 },
      ],
    },
    {
      id: 'RND-002',
      customer: 'Nagy Péter',
      date: '2025-04-06',
      total: 23990,
      status: 'Szállítva',
      items: [{ name: 'Fekete Kabát', qty: 1, price: 23990 }],
    },
    {
      id: 'RND-003',
      customer: 'Szabó Júlia',
      date: '2025-04-05',
      total: 9990,
      status: 'Teljesítve',
      items: [{ name: 'Fehér Póló', qty: 2, price: 4990 }],
    },
  ];
}
