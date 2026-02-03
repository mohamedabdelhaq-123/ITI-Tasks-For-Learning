import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const routes: Routes = [

    {path:"",redirectTo:"products",title:"Products",pathMatch:"full"},   // if path is empty or type empty  req: redirect to products page

    {path:"login",component:LoginComponent,title:"Log in"},
    {path:"register",component:RegisterComponent,title:"Register"},
    {path:"products",component:ProductsComponent,title:"Products"},
    {path:"cart",component:CartComponent,title:"Shopping Cart"},
    {path:"product/:id",component:ProductDetailComponent,title:"Product"}, // TODO: put product name

    {path:"**",component:NotFoundComponent,title:"Error 404"} // must be at end 

];
