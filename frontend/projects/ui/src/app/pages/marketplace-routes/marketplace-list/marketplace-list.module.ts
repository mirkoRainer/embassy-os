import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import {
  SharedPipesModule,
  EmverPipesModule,
  TextSpinnerComponentModule,
} from '@start9labs/shared'
import {
  FilterPackagesPipeModule,
  CategoriesModule,
  ItemModule,
  SearchModule,
  SkeletonModule,
} from '@start9labs/marketplace'
import { BadgeMenuComponentModule } from 'src/app/components/badge-menu-button/badge-menu.component.module'

import { MarketplaceStatusModule } from '../marketplace-status/marketplace-status.module'
import { MarketplaceListPage } from './marketplace-list.page'
import { MarketplaceListContentComponent } from './marketplace-list-content/marketplace-list-content.component'

const routes: Routes = [
  {
    path: '',
    component: MarketplaceListPage,
  },
]

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes),
    TextSpinnerComponentModule,
    SharedPipesModule,
    EmverPipesModule,
    FilterPackagesPipeModule,
    MarketplaceStatusModule,
    BadgeMenuComponentModule,
    ItemModule,
    CategoriesModule,
    SearchModule,
    SkeletonModule,
  ],
  declarations: [MarketplaceListPage, MarketplaceListContentComponent],
  exports: [MarketplaceListPage, MarketplaceListContentComponent],
})
export class MarketplaceListPageModule {}
