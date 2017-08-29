<template>
<div>
  <p>{{ message }}</p>
  <p>click count: {{ getCount }}</p>
  <button @click="increase">increase</button>
  <button @click="reset">reset</button>
</div>
</template>

<script>
// vuex 提供了独立的构建工具函数 Vuex.mapGetters, Vuex.mapActions
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      message: 'Hello Vue.js!'
    }
  },
  computed: mapGetters({
    getCount: 'getCount'
  }),
  methods: mapActions([
    'increase',
    'reset'
  ])
}
</script>
