import { type MessageApiInjection, type  DialogApiInjection } from 'naive-ui';
import { type LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import { type NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';
/// <reference types="vite/client" />
declare global {
  interface Window {
    __webpack_public_path__: string
    __APP_LOADED__: boolean
    wxjs_is_wkwebview: any
    __TAURI_IPC__: any
    __rpcId: string
    rpc: RPCClient
    env: string
    wea_: Wea
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    $notification: NotificationApiInjection
    $loading: LoadingBarApiInjection
    focusActiveTerm: (uid?: string) => void
  }
}