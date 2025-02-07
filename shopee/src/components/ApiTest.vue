<!-- <template>
  <div>
    <h1>API 測試結果</h1>
    <button @click="getData">取得資料</button>
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { fetchData } from '../api/index'

const post = ref<{ title: string; body: string } | null>(null)

const getData = async () => {
  try {
    const data = await fetchData()
    post.value = data
  } catch (error) {
    console.error('取得資料失敗：', error)
  }
}
</script>

<style scoped>
button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}
</style> -->
