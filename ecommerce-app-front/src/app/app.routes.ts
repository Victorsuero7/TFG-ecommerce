import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { ListProductsComponent } from './pages/list-products/list-products.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';

import { GoodsEntryComponent } from './pages/goods-entry/goods-entry.component';
import { GoodsExitComponent } from './pages/goods-exit/goods-exit.component';

import { InventoryListComponent } from './pages/inventory-list/inventory-list.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';

import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { CreateInventarioComponent } from './pages/create-inventario/create-inventario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard 
  { path: 'dashboard', component: DashboardComponent },

  // Goods routes
  { path: 'goods/entry', component: GoodsEntryComponent },
  { path: 'goods/exit', component: GoodsExitComponent },

  // Inventory routes
  { path: 'inventory/list', component: InventoryListComponent },
  { path: 'inventory/new', component: CreateInventarioComponent },

// products
  { path: 'products/list', component: ListProductsComponent },
  { path: 'products/new', component: CreateProductComponent },
  { path: 'products/edit/:id', component: EditProductComponent },

  // categories
  { path: 'categories/list', component: ListCategoriesComponent },
  { path: 'categories/new', component: CreateCategoryComponent },
  { path: 'categories/edit/:id', component: EditCategoryComponent},

  //users 
  {path: 'users/list', component: ListUsersComponent},
  

  { path: '**', redirectTo: 'dashboard' }
];
