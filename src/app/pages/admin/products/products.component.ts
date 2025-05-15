import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { ProductsService, Product } from '../../../services/products.service';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, MatIconModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class AdminProductsComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products$ = this.productsService.getProducts();
  }

  goToCreateProduct() {
    this.router.navigate(['create'], {
      relativeTo: this.router.routerState.root.firstChild,
    });
  }

  onDeleteProduct(id: string) {
    if (confirm('Biztosan törölni szeretnéd a terméket?')) {
      this.productsService.deleteProduct(id);
    }
  }

  onEditProduct(product: Product) {
    this.router.navigate(['edit', product.id], {
      relativeTo: this.router.routerState.root.firstChild,
    });
  }
}
