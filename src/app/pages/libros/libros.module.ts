import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibrosComponent } from './libros.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AgregarComponent } from './forms/agregar/agregar.component';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ImportMaterialModuleModule } from 'src/app/import-material-module/import-material-module.module';
import { ActualizarComponent } from './forms/actualizar/actualizar.component';
import { EliminarComponent } from './forms/eliminar/eliminar.component';

@NgModule({
  declarations: [
    LibrosComponent,
    AgregarComponent,
    ActualizarComponent,
    EliminarComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ImportMaterialModuleModule
  ],
  exports: [
    LibrosComponent
  ]
})
export class LibrosModule { }
