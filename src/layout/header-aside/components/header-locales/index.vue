<template>
  <el-dropdown
    placement="bottom"
    size="small"
    @command="onChangeLocale">
    <el-button class="d2-mr btn-text can-hover" type="text">
      <fa-icon :iconx="'fas language'"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="language in $languages"
        :key="language.value"
        :command="language.value">
        <fa-icon :iconx="$i18n.locale === language.value ? 'far dot-circle' : 'far circle'"/>
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
    ]
  }
</script>
