/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace chrome {
  namespace runtime {
    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    interface Tab {
      id?: number;
      url?: string;
    }

    function onInstalled(): void;
    const onMessage: {
      addListener(
        callback: (message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void
      ): void;
    };
  }

  namespace storage {
    interface StorageArea {
      get<T = any>(
        keys?: string | string[] | { [key: string]: any } | null
      ): Promise<{ [key: string]: T }>;
      set(items: { [key: string]: any }): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }
    const sync: StorageArea;
    const local: StorageArea;
    const managed: StorageArea;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
    }
  }
}