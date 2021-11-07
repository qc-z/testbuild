module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    Message: true,
    env: true,
    // vue
    // defineProps: true,
    // defineEmits: true,
    // defineExpose: true,
    // withDefaults: true,
    // onMounted: true,
    // onUnmounted: true,
    // watch: true,
    // computed: true,
    // ref: true,
    // reactive: true,
    // nextTick: true,
    // readonly: true,
    // onActivated: true,
    // toRefs: true,
    // useAttrs: true,
    // useSlots: true,
    // provide: true,
    // inject: true,
    // vueRouter
    useRoute: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'prettier',
    '@vue/prettier',
    'vue-global-api'
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        mocha: true
      }
    }
  ]
}
