import fs, { readFileSync } from 'node:fs'
import path, { resolve } from 'node:path'
import { type Plugin, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execaSync } from 'execa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

const commit = execaSync('git', ['rev-parse', '--short=7', 'HEAD']).stdout

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const getVersion = (name: string) => {
  const [dep] = [pkg]
    .map(pkg => pkg.dependencies[name] || pkg.devDependencies[name])
    .filter(Boolean)

  return dep && (/^\d/.test(dep) ? dep : dep.slice(1))
}

export default defineConfig({
  define: {
    __COMMIT__: JSON.stringify(commit),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    __VUE_VERSION__: JSON.stringify(getVersion('vue')),
    __TS_VERSION__: JSON.stringify(getVersion('typescript')),
    __REPL_VERSION__: JSON.stringify(getVersion('@vue/repl'))
  },
  resolve: {
    alias: [
      {
        find: /\/#\//,
        replacement: pathResolve('types') + '/'
      },
      {
        find: '@',
        replacement: pathResolve('src') + '/'
      }
    ],
    dedupe: ['vue']
  },
  plugins: [
    vue({
      script: {
        fs: {
          fileExists: fs.existsSync,
          readFile: file => fs.readFileSync(file, 'utf-8'),
        },
      },
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    copyVuePlugin(),
  ],
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
})

function copyVuePlugin(): Plugin {
  return {
    name: 'copy-vue',
    generateBundle() {
      const copyFile = (file: string) => {
        const filePath = path.resolve(__dirname, file)
        const basename = path.basename(file)
        if (!fs.existsSync(filePath)) {
          throw new Error(
            `${basename} not built. ` +
              `Run "nr build vue -f esm-browser" first.`,
          )
        }
        this.emitFile({
          type: 'asset',
          fileName: basename,
          source: fs.readFileSync(filePath, 'utf-8'),
        })
      }

      copyFile(`node_modules/vue/dist/vue.esm-browser.js`)
      copyFile(`node_modules/vue/dist/vue.esm-browser.prod.js`)
      copyFile(`node_modules/vue/dist/vue.runtime.esm-browser.js`)
      copyFile(`node_modules/vue/dist/vue.runtime.esm-browser.prod.js`)
      copyFile(`node_modules/vue/server-renderer/index.js`)
    },
  }
}
