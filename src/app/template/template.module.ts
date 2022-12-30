import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './template.component';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { LibrosModule } from '../pages/libros/libros.module';
import { FooterComponent } from './footer/footer.component';
import { AutoresModule } from '../pages/autores/autores.module';


@NgModule({
  declarations: [
    TemplateComponent,
    HeaderComponent,
    SideBarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatSelectModule,
    LibrosModule,
    AutoresModule
  ]
})
export class TemplateModule { }
