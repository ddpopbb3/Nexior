<template>
  <div>
    <div class="flex justify-between">
      <div class="flex justify-start items-center">
        <span class="text-sm font-bold">{{ $t('midjourney.name.stylize') }}</span>
        <info-icon :content="$t('midjourney.description.stylize')" />
      </div>
      <div class="flex justify-end items-center">
        <el-input-number v-model="value" controls-position="right" />
      </div>
    </div>
    <div class="w-full">
      <el-slider v-model="value" :min="0" :max="100" :step="1" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElSlider, ElInputNumber } from 'element-plus';
import InfoIcon from '@/components/common/InfoIcon.vue';
import { MIDJOURNEY_DEFAULT_STYLIZE } from '@/constants';

export default defineComponent({
  name: 'StylizeSelector',
  components: {
    ElSlider,
    InfoIcon,
    ElInputNumber
  },
  computed: {
    value: {
      get() {
        return this.$store.state.midjourney.config.stylize;
      },
      set(val: number) {
        console.debug('set stylize', val);
        this.$store.commit('midjourney/setConfig', {
          ...this.$store.state.midjourney.config,
          stylize: val
        });
      }
    }
  },
  mounted() {
    if (!this.value) {
      this.value = MIDJOURNEY_DEFAULT_STYLIZE;
    }
  }
});
</script>
