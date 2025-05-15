import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductsService, Product } from '../../services/products.service';
import { QueryService } from '../../services/query.service';
import { Observable } from 'rxjs';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProductCardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  lastVisible: DocumentSnapshot<DocumentData> | undefined;
  hasMoreProducts = true;
  sortField: 'price' | 'name' = 'price';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private productsService: ProductsService,
    private queryService: QueryService
  ) {}
  ngOnInit() {
    this.loadProducts();
  }
  async loadProducts() {
    if (!this.hasMoreProducts || this.isLoading) return;
    this.isLoading = true;

    try {
      const result = await this.queryService.searchProducts({
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        lastVisible: this.lastVisible,
      });

      if (result) {
        this.products = [...this.products, ...result.products];
        this.lastVisible = result.lastVisible;
        this.hasMoreProducts = result.products.length === 10;
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.isLoading = false;
    }
  }
  changeSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.products = [];
    this.lastVisible = undefined;
    this.hasMoreProducts = true;
    this.loadProducts();
  }

  changeSortField(field: 'price' | 'name') {
    this.sortField = field;
    this.products = [];
    this.lastVisible = undefined;
    this.hasMoreProducts = true;
    this.loadProducts();
  }

  loadMore() {
    if (this.hasMoreProducts) {
      this.loadProducts();
    }
  }
}
