<template>
  <div>
    <vue-plyr :options="options" class="video">
      <video controls crossorigin="" playsinline :data-poster="modelValue?.image_url">
        <source size="1080" :src="modelValue?.video_url" type="video/mp4" />
      </video>
    </vue-plyr>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// @ts-ignore
import VuePlyr from '@skjnldsv/vue-plyr';
// @ts-ignore
import { IPikaVideo } from '@/models';
import '@skjnldsv/vue-plyr/dist/vue-plyr.css';
export default defineComponent({
  name: 'VideoPlayer',
  components: { VuePlyr },
  props: {
    modelValue: {
      type: Object as () => IPikaVideo | undefined,
      required: true
    }
  },
  data() {
    return {
      options: { quality: { default: '1080p' } }
    };
  }
});
</script>

<style lang="scss" scoped>
.video {
  max-width: 100%;
  height: 450px;
}
</style>
