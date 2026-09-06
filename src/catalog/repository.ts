import type { Store } from './schema';
import { CATALOG_VERSION } from './schema';
import { SEED_STORES } from './seed';

export interface CatalogRepository {
  listStores(): Store[];
  getStore(id: string): Store | undefined;
  catalogVersion(): string;
}

export class BundledCatalogRepository implements CatalogRepository {
  private readonly stores: Store[] = SEED_STORES;
  listStores(): Store[] {
    return this.stores;
  }
  getStore(id: string): Store | undefined {
    return this.stores.find((s) => s.id === id);
  }
  catalogVersion(): string {
    return CATALOG_VERSION;
  }
}
