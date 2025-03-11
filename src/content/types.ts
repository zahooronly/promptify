/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get<T = any>(
        keys: string | string[] | null | undefined
      ): Promise<{ [key: string]: T }>;
      set(items: { [key: string]: any }): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }
    const sync: StorageArea;
    const local: StorageArea;
    const managed: StorageArea;
  }
}
