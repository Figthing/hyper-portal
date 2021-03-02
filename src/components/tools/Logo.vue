<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ website.title }}</h1>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  computed: {
    ...mapGetters(['website'])
  },
  components: {
    LogoSvg
  },
  props: {
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
