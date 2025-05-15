import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  updateDoc,
  Query,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from './cart.service';

export interface OrderAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  address: OrderAddress;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private firestore = inject(Firestore);
  private readonly ORDERS_PER_PAGE = 10;

  submitOrder(order: Omit<Order, 'id'>): Promise<string> {
    const ordersRef = collection(this.firestore, 'orders');
    return addDoc(ordersRef, {
      ...order,
      createdAt: new Date(),
    }).then((docRef) => docRef.id);
  }

  getPaginatedOrders(params: {
    status?: OrderStatus;
    lastVisible?: QueryDocumentSnapshot<DocumentData>;
  }): Observable<{
    orders: Order[];
    lastVisible: QueryDocumentSnapshot<DocumentData>;
  }> {
    const ordersRef = collection(this.firestore, 'orders');
    let q = query(
      ordersRef,
      orderBy('createdAt', 'desc'),
      limit(this.ORDERS_PER_PAGE)
    );

    if (params.status) {
      q = query(q, where('status', '==', params.status));
    }

    if (params.lastVisible) {
      q = query(q, startAfter(params.lastVisible));
    }

    return from(this.getQueryResults(q));
  }

  getOrdersByDateRange(params: {
    startDate: Date;
    endDate: Date;
    status?: OrderStatus;
  }): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    let q = query(
      ordersRef,
      where('createdAt', '>=', params.startDate),
      where('createdAt', '<=', params.endDate),
      orderBy('createdAt', 'desc')
    );

    if (params.status) {
      q = query(q, where('status', '==', params.status));
    }

    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getUserOrdersFiltered(params: {
    userId: string;
    status?: OrderStatus;
    startDate?: Date;
    limit?: number;
    lastVisible?: QueryDocumentSnapshot<DocumentData>;
  }): Observable<{
    orders: Order[];
    lastVisible: QueryDocumentSnapshot<DocumentData>;
  }> {
    const ordersRef = collection(this.firestore, 'orders');
    let q = query(
      ordersRef,
      where('userId', '==', params.userId),
      orderBy('createdAt', 'desc')
    );

    if (params.status) {
      q = query(q, where('status', '==', params.status));
    }

    if (params.startDate) {
      q = query(q, where('createdAt', '>=', params.startDate));
    }

    q = query(q, limit(params.limit || this.ORDERS_PER_PAGE));

    if (params.lastVisible) {
      q = query(q, startAfter(params.lastVisible));
    }

    return from(this.getQueryResults(q));
  }

  getOrderById(id: string): Promise<Order | null> {
    const orderRef = doc(this.firestore, `orders/${id}`);
    return getDoc(orderRef).then((snap) => {
      if (!snap.exists()) return null;
      const data = snap.data() as Omit<Order, 'id'>;
      return { ...data, id: snap.id } as Order;
    });
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const userOrdersQuery = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(userOrdersQuery, { idField: 'id' }) as Observable<
      Order[]
    >;
  }

  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
    return collectionData(ordersQuery, { idField: 'id' }) as Observable<
      Order[]
    >;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orderRef = doc(this.firestore, `orders/${orderId}`);
    return updateDoc(orderRef, { status });
  }

  private async getQueryResults(q: Query<DocumentData>): Promise<{
    orders: Order[];
    lastVisible: QueryDocumentSnapshot<DocumentData>;
  }> {
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => ({
      ...(doc.data() as Order),
      id: doc.id,
    }));

    return {
      orders,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  }
}
