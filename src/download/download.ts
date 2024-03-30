import { saveAs } from 'file-saver'

import index from './template/index.html?raw'
import main from './template/main.js?raw'
import pkg from './template/package.json?raw'
import config from './template/vite.config.js?raw'
import readme from './template/README.md?raw'
import type { ReplStore } from '@vue/repl'
export async function downloadProject(store: ReplStore) {

  window.$dialog.info({
    title: '提示',
    content: '确定下载全部文件吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()

      // basic structure
      zip.file('index.html', index)
      zip.file('package.json', pkg)
      zip.file('vite.config.js', config)
      zip.file('README.md', readme)

      // project src
      const src = zip.folder('src')!
      src.file('main.js', main)

      const files = store.getFiles()
      for (const file in files) {
        if (file !== 'import-map.json' && file !== 'tsconfig.json') {
          src.file(file, files[file])
        } else {
          zip.file(file, files[file])
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'vue-project.zip')
      window.$message.success('下载成功')
    },
    onNegativeClick: () => {
      window.$message.error('已取消')
    }
  })
  
}
