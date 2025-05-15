import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  getDocs,
  getDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './products.service';
import { Order, OrderStatus } from './order.service';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private firestore = inject(Firestore);
  private ITEMS_PER_PAGE = 10;

  async getFilteredProducts(params: {
    minPrice?: number;
    maxPrice?: number;
    sortOrder?: 'asc' | 'desc';
    lastVisible?: DocumentSnapshot<DocumentData>;
  }): Promise<{
    products: Product[];
    lastVisible: DocumentSnapshot<DocumentData>;
  }> {
    const productsRef = collection(this.firestore, 'products');
    let q = query(productsRef);

    if (params.minPrice !== undefined) {
      q = query(q, where('price', '>=', params.minPrice));
    }

    if (params.maxPrice !== undefined) {
      q = query(q, where('price', '<=', params.maxPrice));
    }

    q = query(
      q,
      orderBy('price', params.sortOrder || 'asc'),
      limit(this.ITEMS_PER_PAGE)
    );

    if (params.lastVisible) {
      q = query(q, startAfter(params.lastVisible));
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as Product)
    );

    return {
      products,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  }

  async getOrdersByStatusAndDate(params: {
    status: OrderStatus;
    startDate: Date;
    endDate: Date;
    limit?: number;
  }): Promise<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(
      ordersRef,
      where('status', '==', params.status),
      where('createdAt', '>=', params.startDate),
      where('createdAt', '<=', params.endDate),
      orderBy('createdAt', 'desc'),
      limit(params.limit || 20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Order));
  }

  async calculateRevenueByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
  }> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(
      ordersRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      where('status', 'in', ['delivered', 'shipped'])
    );

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => doc.data() as Order);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );
    const orderCount = orders.length;

    return {
      totalRevenue,
      orderCount,
      avgOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
    };
  }
  async searchProducts(params: {
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    sortField?: 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
    lastVisible?: DocumentSnapshot<DocumentData>;
  }): Promise<{
    products: Product[];
    lastVisible: DocumentSnapshot<DocumentData>;
  }> {
    const productsRef = collection(this.firestore, 'products');
    let q = query(productsRef);

    const sortField = params.sortField || 'price';
    const sortOrder = params.sortOrder || 'asc';

    if (params.searchTerm && sortField !== 'name') {
      q = query(q, orderBy('name'));
    }

    if (params.searchTerm) {
      q = query(
        q,
        where('name', '>=', params.searchTerm),
        where('name', '<=', params.searchTerm + '\uf8ff')
      );
    }

    if (
      (params.minPrice !== undefined || params.maxPrice !== undefined) &&
      sortField !== 'price'
    ) {
      q = query(q, orderBy('price'));
    }

    if (params.minPrice !== undefined) {
      q = query(q, where('price', '>=', params.minPrice));
    }

    if (params.maxPrice !== undefined) {
      q = query(q, where('price', '<=', params.maxPrice));
    }

    q = query(q, orderBy(sortField, sortOrder), limit(this.ITEMS_PER_PAGE));

    if (params.lastVisible) {
      q = query(q, startAfter(params.lastVisible));
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as Product)
    );

    return {
      products,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  }
}
