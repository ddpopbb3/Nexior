<template>
  <div class="field">
    <h2 class="title">{{ $t('midjourney.name.advanced') }}</h2>
    <el-switch v-model="value" class="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElSwitch } from 'element-plus';

const DEFAULT_ADVANCED = false;

export default defineComponent({
  name: 'AdvancedSelector',
  components: {
    ElSwitch
  },
  computed: {
    value: {
      get() {
        return this.$store.state.midjourney.config.advanced;
      },
      set(val: boolean) {
        console.debug('set advanced', val);
        this.$store.commit('midjourney/setConfig', {
          ...this.$store.state.midjourney.config,
          advanced: val
        });
      }
    }
  },
  mounted() {
    if (this.value === undefined) {
      this.value = DEFAULT_ADVANCED;
    }
  }
});
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: row;
  align-items: center;

  .title {
    font-size: 14px;
    margin: 0;
    width: 30%;
  }
  .value {
    flex: 1;
  }
  .info {
    width: 20px;
  }
}
</style>
