<template>
  <el-dropdown
    placement="bottom"
    size="small"
    @command="onChangeLocale">
    <el-button class="d2-mr btn-text can-hover" type="text">
      <fa-icon iconx="fas language" size="lg"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="language in $languages"
        :key="language.value"
        :command="language.value">
        <fa-icon :iconx="iconName(language.value)" class="d2-mr-5"/>
        {{ language.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import localeMixin from '@/locales/mixin.js'
export default {
  mixins: [
    localeMixin
  ],
  methods: {
    iconName (name) {
      return `far ${name === this.$i18n.locale ? 'dot-circle' : 'circle'}`
    }
  },
}
</script>
