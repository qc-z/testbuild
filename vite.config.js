import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import styleImport from 'vite-plugin-style-import'

const path = require('path')

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      directoryAsNamespace: false
    }),
    AutoImport({
      imports: ['vue']
    }),
    styleImport({
      libs: [
        {
          libraryName: 'element-plus',
          resolveStyle: (name) => {
            return `element-plus/theme-chalk/${name}.css`
          }
        }
      ]
    })
  ],
  server: {
    open: true
  },
  build: {
    // assetsDir: 'static/img/',
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1500,
    brotliSize: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/style/color.scss";'
      }
    }
  }
})
