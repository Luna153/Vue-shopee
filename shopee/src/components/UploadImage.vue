<template>
  <div>
    <h1>圖片上傳測試</h1>
    <input type="file" id="fileInput" @change="handleFileChange" />
    <button id="uploadBtn" @click="upload" :disabled="!selectedFile">上傳圖片的按鈕！！</button>

    <div v-if="imageUrl" class="preview">
      <h2>預覽圖片：</h2>
      <img :src="imageUrl" alt="上傳成功的圖片" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { uploadImage } from '../api/index'

const upload = (event: Event) => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const file = fileInput.files?.[0]

  if (file) {
    console.log('檔案被選取：', file) // ✅ 第一次點擊就會出現
    uploadImage(file)
    // 設定預覽圖片的 URL
    imageUrl.value = `../uploads/${file.name}`
  } else {
    console.log('⚠️ 請先選擇圖片')
  } // console.log('click')
}

const selectedFile = ref<File | null>(null)
const imageUrl = ref<string | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    console.log('✅ 已選取檔案：', selectedFile.value)
  }
}
</script>

<style scoped>
.preview img {
  max-width: 300px;
  margin-top: 10px;
  border: 2px solid #ccc;
  padding: 5px;
  border-radius: 5px;
}
</style>
