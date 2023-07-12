<template>
    <h3 class="selectorTitle">都道府県</h3>
    <div class="wrapBox">
        <div class="prefcheckbox" v-for="(item, index) in prefList" :key="index">
            <input type="checkbox" :id="'ckbox'+index" v-model="item.checked" @change="onSubmit(index,item.prefCode)">
            <label :for="'ckbox'+index">{{ item.prefName }}</label>
        </div>
    </div>
</template>
<script setup lang="ts">
interface PrefectureData {
    prefName: string,
    prefCode: number,
    checked: boolean
}
defineProps({
    prefList: {
        type: Array<PrefectureData>,
        required: true,
    }
})
defineEmits<{
  (e: 'prefChanged', index: number, code: number): void
}>()
</script>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: "prefSelector",
    methods: {
        onSubmit(index: number, code: number) {
            this.$emit("prefChanged", index, code);
        }
    }
})
</script>

<style>
.prefcheckbox{
    display: inline-block;
    margin: 2px 5px;
}
.selectorTitle{
    color:white;
    background: #42d392;
    padding: 5px;
}
</style>