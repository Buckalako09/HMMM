import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Query,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private firestore = inject(Firestore);
  private readonly ITEMS_PER_PAGE = 10;

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<
      Product[]
    >;
  }

  getPaginatedProducts(
    lastVisible?: QueryDocumentSnapshot<DocumentData>
  ): Observable<{
    products: Product[];
    lastVisible: QueryDocumentSnapshot<DocumentData>;
  }> {
    const productsRef = collection(this.firestore, 'products');
    let q = query(
      productsRef,
      orderBy('price', 'desc'),
      limit(this.ITEMS_PER_PAGE)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    return from(this.getQueryResults(q));
  }

  getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(
      productsRef,
      where('price', '>=', minPrice),
      where('price', '<=', maxPrice),
      orderBy('price', sortOrder)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  searchProductsByName(
    searchTerm: string,
    limitCount: number = 5
  ): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(
      productsRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(limitCount)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  private async getQueryResults(q: Query<DocumentData>): Promise<{
    products: Product[];
    lastVisible: QueryDocumentSnapshot<DocumentData>;
  }> {
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({
      ...(doc.data() as Product),
      id: doc.id,
    }));

    return {
      products,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  }

  deleteProduct(id: string): Promise<void> {
    const productRef = doc(this.firestore, `products/${id}`);
    return deleteDoc(productRef);
  }

  getProductById(id: string): Promise<Product> {
    const docRef = doc(this.firestore, `products/${id}`);
    return getDoc(docRef).then((snap) => snap.data() as Product);
  }

  updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(this.firestore, `products/${id}`);
    return updateDoc(docRef, data);
  }

  addProduct(product: Omit<Product, 'id'>): Promise<void> {
    const productsRef = collection(this.firestore, 'products');
    return addDoc(productsRef, product).then(() => {});
  }
}
