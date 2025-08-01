<template>
  <div class="task">
    <div v-for="(audio, audioIndex) in audios" :key="audioIndex" class="audio" @click="onClick(audio)">
      <div v-loading="!audio?.audio_url" class="left">
        <el-image :src="audio?.image_url" class="cover" fit="cover" />
        <div
          v-if="
            audio?.audio_url &&
            $store.state?.suno?.audio?.id === audio.id &&
            $store.state?.suno?.audio?.state === 'playing'
          "
          class="overlay"
          @click="onPause(audio)"
        >
          <el-icon><video-pause /></el-icon>
        </div>
        <div
          v-if="
            audio?.audio_url &&
            ($store.state?.suno?.audio?.id !== audio.id ||
              ($store.state?.suno?.audio?.id === audio.id && $store.state?.suno?.audio?.state === 'paused'))
          "
          class="overlay"
          @click="onPlay(audio)"
        >
          <el-icon><video-play /></el-icon>
        </div>
        <div v-if="audio?.duration" class="duration">
          {{ useFormatDuring(audio?.duration) }}
        </div>
      </div>
      <div class="info">
        <h2 class="title">{{ audio?.title }}</h2>
        <p class="style">{{ audio?.style }}</p>
      </div>
      <div class="right">
        <el-button v-if="audio?.audio_url" size="small" round @click="onExtend($event, audio)">{{
          $t('suno.button.extend')
        }}</el-button>
        <el-tooltip effect="dark" :content="$t('suno.button.video')" placement="top">
          <font-awesome-icon
            v-if="audio?.video_url"
            icon="fa-solid fa-clapperboard"
            class="icon icon-preview"
            @click="onPreview($event, audio?.video_url)"
          />
        </el-tooltip>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-tooltip effect="dark" :content="$t('suno.button.download')" placement="top">
              <font-awesome-icon
                v-if="audio?.audio_url || audio?.video_url"
                icon="fa-solid fa-download"
                class="icon icon-download"
              />
            </el-tooltip>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="audio?.video_url" @click="onDownload($event, audio?.video_url)">
                {{ $t('suno.button.download_video') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="audio?.audio_url" @click="onDownload($event, audio?.audio_url)">
                {{ $t('suno.button.download_audio') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-tooltip effect="dark" :content="$t('suno.button.more')" placement="top">
              <font-awesome-icon
                v-if="audio?.audio_url || audio?.video_url"
                icon="fa-solid fa-ellipsis"
                class="icon icon-ellipsis"
              />
            </el-tooltip>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="audio.id" @click="onGetStems(audio.id)">
                {{ $t('suno.button.get_stems') }}
              </el-dropdown-item>
              <el-dropdown-item @click="onCover(audio)">
                {{ $t('suno.button.cover_music') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="audio?.id && audio?.action === 'extend'" @click="onConcatMusic(audio?.id)">
                {{ $t('suno.button.concat_music') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useFormatDuring } from '@/utils/number';
import { ISunoAudio, ISunoTask } from '@/models';
import {
  ElImage,
  ElIcon,
  ElTooltip,
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessage
} from 'element-plus';
import { VideoPlay, VideoPause } from '@element-plus/icons-vue';
import { ISunoAudioRequest, Status } from '@/models';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { saveAs } from 'file-saver';
import { sunoOperator } from '@/operators';

const CALLBACK_URL = 'https://webhook.acedata.cloud/suno';

export default defineComponent({
  name: 'TaskPreview',
  components: {
    ElImage,
    ElIcon,
    ElTooltip,
    ElButton,
    FontAwesomeIcon,
    VideoPlay,
    VideoPause,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem
  },
  props: {
    modelValue: {
      type: Object as () => ISunoTask,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    loading() {
      return this.$store.state.suno?.status?.getApplications === Status.Request;
    },
    credential() {
      return this.$store.state.suno.credential;
    },
    config() {
      return this.$store.state.suno.config;
    },
    task() {
      return this.$store.state.suno?.tasks;
    },
    audios(): ISunoAudio[] {
      let result: ISunoAudio[] = [];
      // @ts-ignore
      const action = this.modelValue?.request?.action;
      if (Array.isArray(this.modelValue?.response?.data)) {
        this.modelValue?.response?.data?.forEach((item: any) => {
          let audio = item as ISunoAudio;
          // Add the action field to the audio object
          if (action) {
            audio.action = action;
          }
          result.push(audio);
        });
      }
      return result;
    },
    application() {
      return this.$store.state.suno?.application;
    },
    active() {
      return this.$store.state.suno?.tasks?.active;
    }
  },
  methods: {
    useFormatDuring,
    onPlay(audio: ISunoAudio) {
      this.$store.dispatch('suno/setAudio', {
        ...this.$store.state.suno.audio,
        ...audio,
        state: 'playing'
      });
      console.log('on play');
    },
    onPause(audio: ISunoAudio) {
      this.$store.dispatch('suno/setAudio', {
        ...this.$store.state.suno.audio,
        ...audio,
        state: 'paused'
      });
      console.log('on pause');
    },
    onClick(audio: ISunoAudio) {
      if (this.$store.state?.suno?.audio?.id !== audio.id) {
        this.onPlay({
          ...audio,
          progress: 0
        });
      }
    },
    onExtend(event: MouseEvent, audio: ISunoAudio) {
      event.stopPropagation();
      console.log('on extend');
      // download url here
      console.debug('set config', audio);
      this.$store.commit('suno/setConfig', {
        ...this.$store.state.suno?.config,
        model: audio.model,
        custom: true,
        instrumental: false,
        style: audio.style,
        action: 'extend',
        audio: audio,
        audio_id: audio.id,
        continue_at: audio.duration
      });
    },
    onDownload(event: MouseEvent, audioUrl: string) {
      event.stopPropagation();
      console.log('on download', audioUrl);
      // 使用 URL 对象解析
      const parsedUrl = new URL(audioUrl);

      // 获取路径名
      const pathname = parsedUrl.pathname;
      // 提取文件名
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      console.log('on preview', filename);
      fetch(audioUrl)
        .then((response) => response.blob())
        .then((blob) => {
          saveAs(blob, filename);
        });
      // download url here
      // window.open(audioUrl, '_blank');
    },
    onPreview(event: MouseEvent, videoUrl: string) {
      event.stopPropagation();
      console.log('on preview', videoUrl);
      // preview url here
      window.open(videoUrl, '_blank');
    },
    async onGetStems(audioId: string) {
      await this.onGenerateAudioUrl('stems', audioId);
    },
    onCover(audio: ISunoAudio) {
      console.log('on cover');
      // download url here
      console.debug('set config', audio);
      this.$store.commit('suno/setConfig', {
        ...this.$store.state.suno?.config,
        model: audio.model,
        custom: true,
        instrumental: false,
        style: audio.style,
        action: 'cover',
        audio: audio,
        audio_id: audio.id
      });
    },
    async onConcatMusic(audioId: string) {
      await this.onGenerateAudioUrl('concat', audioId);
    },
    async onGenerateAudioUrl(action: string, audioId: string) {
      const request = {
        action,
        audio_id: audioId,
        callback_url: CALLBACK_URL
      } as ISunoAudioRequest;
      const token = this.credential?.token;
      if (!token) {
        console.error('no token specified');
        return;
      }
      ElMessage.info(this.$t('suno.message.startingTask'));
      sunoOperator
        .audio(request, {
          token
        })
        .then(() => {
          ElMessage.success(this.$t('suno.message.startTaskSuccess'));
        })
        .catch((error) => {
          ElMessage.error(error?.response?.data?.error?.message || this.$t('suno.message.startTaskFailed'));
        })
        .finally(async () => {
          await this.onGetTasks();
          await this.onScrollDown();
        });
    },
    async onScrollDown() {
      setTimeout(() => {
        // scroll to bottom for `.recent`
        const el = document.querySelector('.recent');
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, 1000);
    },
    async onGetTasks() {
      if (this.loading) {
        console.debug('loading');
        return;
      }
      await this.$store.dispatch('suno/getTasks', {
        limit: 30,
        offset: 0
      });
    }
  }
});
</script>

<style lang="scss">
.task {
  display: flex;
  flex-direction: column;
  .audio {
    display: flex;
    margin-bottom: 10px;
    border-radius: 10px;

    &:hover {
      background-color: var(--el-bg-color-page);
    }

    .left {
      position: relative;
      width: 60px;
      height: 60px;
      margin-right: 16px;
      flex-shrink: 0;

      &:hover .overlay {
        display: block;
      }

      .cover {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }

      .duration {
        position: absolute;
        right: 0px;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 2px 4px;
        color: white;
        border-radius: 2px;
        font-size: 10px;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;
        transition: opacity 0.3s;
        border-radius: 4px;
        text-align: center;
        line-height: 70px;
        cursor: pointer;
        .el-icon {
          font-size: 20px;
          color: white;
        }
      }
    }
    .info {
      flex: 1;
      .title {
        font-size: 14px;
        font-weight: bold;
        margin-top: 5px;
      }
      .style {
        font-size: 12px;
        margin-bottom: 0;
        color: var(--el-text-color-secondary);
      }
    }
    .right {
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 1px;
      .icon {
        display: block;
        z-index: 100;
        cursor: pointer;
        margin-right: 15px;
      }
      .el-button {
        margin-right: 15px; /* Add margin to the right of the button */
      }
    }
  }
}
</style>
