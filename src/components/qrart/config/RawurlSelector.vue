<template>
  <div class="field">
    <span class="text-sm font-bold block mb-2">{{ $t('qrart.name.rawurl') }}</span>
    <el-switch v-model="value" class="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElSwitch } from 'element-plus';
import { QRART_DEFAULT_RAWURL } from '@/constants';

export default defineComponent({
  name: 'RawurlSelector',
  components: {
    ElSwitch
  },
  computed: {
    value: {
      get() {
        return this.$store.state.qrart?.config?.rawurl;
      },
      set(val: boolean) {
        console.debug('set rawurl', val);
        this.$store.commit('qrart/setConfig', {
          ...this.$store.state.qrart?.config,
          rawurl: val
        });
      }
    }
  },
  mounted() {
    if (this.value === undefined) {
      this.value = QRART_DEFAULT_RAWURL;
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
