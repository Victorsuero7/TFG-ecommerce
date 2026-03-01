import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { ListProductsComponent } from './pages/list-products/list-products.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';

import { GoodsEntryComponent } from './pages/goods-entry/goods-entry.component';
import { GoodsExitComponent } from './pages/goods-exit/goods-exit.component';

import { InventoryListComponent } from './pages/inventory-list/inventory-list.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';

import { CreateInventarioComponent } from './pages/create-inventario/create-inventario.component';

import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';  
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard 
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Inventory routes
  { path: 'inventory/list', component: InventoryListComponent, canActivate: [AuthGuard] },
  { path: 'inventory/new', component: CreateInventarioComponent, canActivate: [AuthGuard] },

  // products
  { path: 'products/list', component: ListProductsComponent, canActivate: [AuthGuard] },
  { path: 'products/new', component: CreateProductComponent, canActivate: [AuthGuard] },
  { path: 'products/edit/:id', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: 'products/detail/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },

  // categories
  { path: 'categories/list', component: ListCategoriesComponent, canActivate: [AuthGuard] },
  { path: 'categories/new', component: CreateCategoryComponent, canActivate: [AuthGuard] },
  { path: 'categories/edit/:id', component: EditCategoryComponent, canActivate: [AuthGuard] },
  { path: 'categories/detail/:id', component: CategoryDetailComponent, canActivate: [AuthGuard] },

  //users 
  { path: 'users/list', component: ListUsersComponent, canActivate: [AuthGuard] },
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'user/detail/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'user/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'dashboard' }
];
