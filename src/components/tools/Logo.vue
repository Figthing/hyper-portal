<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ product('PRODUCT_NAME') }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  computed: {
    product() {
      return (key) => this.getConfigKey(key)
    }
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
