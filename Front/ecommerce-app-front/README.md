# EcommerceAppFront

Componentes que a desarrollar:
Componentes:
Auth (se verá si hay que crear register, forgot password y login o se hace con Google todo)
dashboard (para ver estadisitcas, no obligatorio)
productos-list
producto-form
producto-detail
categorias-list
carro
carro-item
pedido-list
pedido-detail

Servicios:
Auth.service
productos.service.ts
categorias.service.ts
usuarios.service.ts
pedidos.service.ts
carro.service.ts
pagos.service.ts

Componentes reutilizables:
header, footer y menú
spinnger y modales y otros

Rutas principales:
{ path: '', component: HomeComponent },
//usuario
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegistroComponent },
{ path: 'checkout', component: CheckoutComponent },

//producto
{ path: 'categoria', component: CategoriaListComponent },
{ path: 'categoria:id', component: ProductDetailComponent }
{ path: 'producto', component: ProductListComponent },
{ path: 'producto:id', component: ProductDetailComponent }

//compra
{ path: 'carro', component: CarroComponent },

//como admin
{ path: 'dashboard', component: DashboardComponent },
{ path: 'productos', component: ProductosListComponent },
{ path: 'productos/nuevo', component: ProductoFormComponent },
{ path: 'pedidos', component: PedidosAdminComponent }

//404
{ path: '\*\*', component: NotFoundComponent }
