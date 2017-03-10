import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as checkedArray from 'app/util/checkedArray'

if (environment.production) {
  enableProdMode();
  checkedArray.enableProdMode()
}

platformBrowserDynamic().bootstrapModule(AppModule);
