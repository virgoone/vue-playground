import { createApp } from 'vue'
import App from './App.vue'
import { setupNaiveDiscreteApi, setupDirectives } from './plugins'
// @ts-expect-error Custom window property
window.VUE_DEVTOOLS_CONFIG = {
  defaultSelectedAppId: 'repl',
}

const app =createApp(App)
// 挂载 naive-ui 脱离上下文的 Api
setupNaiveDiscreteApi()
// 注册全局自定义组件
//setupCustomComponents();

// 注册全局自定义指令，如：v-permission权限指令
setupDirectives(app)

 app.mount('#app')
