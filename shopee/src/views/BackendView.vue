<template>
  <div class="wrap__inner">
    <!-- 分隔線 -->

    <div class="type__box flex">
      <div class="type__box-titleIcon">
        <font-awesome-icon :icon="['fas', 'circle-dot']" />
      </div>
      <span class="">規格</span>
      <div class="flex-1">
        <div class="type__table">
          <div class="type__table-header flex">
            <div class="type__table-title">顏色</div>
            <span class="type__table-subtitle">（自定義）</span>
            <button class="type__table-edit">
              <font-awesome-icon :icon="['fas', 'pencil']" class="pencil" />
            </button>
          </div>
          <div class="type__table-body grid grid-cols-2 gap-4">
            <div
              class="type__table-option flex"
              v-for="(color, index) in availableColors"
              :key="index"
            >
              <div class="type__table-pic">
                <img :src="productStore.specs.colorImages[color]" alt="顏色圖片" />
              </div>
              <div class="type__table-input">{{ color }}</div>
              <div class="type__table-amount">{{ getColorLength(color) }}/20</div>
              <div class="type__table-move">
                <font-awesome-icon :icon="['fas', 'up-down-left-right']" />
              </div>
              <div class="type__table-delete">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </div>
            </div>

            <div class="type__table-option flex">
              <div v-if="imageUrl" class="type__table-uploadpic" @click="triggerFileInput">
                <img :src="imageUrl" alt="上傳成功的圖片" />
              </div>
              <!-- 隱藏的文件選擇框 -->
              <input
                type="file"
                id="fileInput"
                @change="handleFileChange"
                ref="fileInput"
                style="display: none"
              />
              <input
                type="text"
                placeholder="請輸入"
                size="10"
                class="type__table-input"
                v-model="newColor"
                maxlength="20"
              />
              <div class="type__table-amount">{{ newColor.length }}/20</div>
              <button @click="addNewColor">新增顏色</button>
            </div>
          </div>
        </div>
        <div class="type__table">
          <div class="type__table-header flex">
            <div class="type__table-title">大小</div>
            <span class="type__table-subtitle">（自定義）</span>
            <button class="type__table-edit">
              <font-awesome-icon :icon="['fas', 'pencil']" class="pencil" />
            </button>
          </div>
          <div class="type__table-body grid grid-cols-2 gap-4">
            <div
              class="type__table-option flex"
              v-for="(size, index) in availableSizes"
              :key="index"
            >
              <div class="type__table-input">{{ size }}</div>
              <div class="type__table-amount">{{ getSizeLength(size) }}/20</div>
              <div class="type__table-move">
                <font-awesome-icon :icon="['fas', 'up-down-left-right']" />
              </div>
              <div class="type__table-delete">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </div>
            </div>
            <div class="type__table-option flex">
              <input
                type="text"
                placeholder="請輸入"
                size="10"
                class="type__table-input"
                v-model="newSize"
                maxlength="20"
              />
              <div class="type__table-amount">{{ newSize.length }}/20</div>
              <button @click="addNewSize">新增大小</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info__box">
      <table>
        <thead>
          <tr>
            <th>
              <font-awesome-icon :icon="['fas', 'circle-dot']" class="info__box-titleIcon" />
              顏色
            </th>
            <th class="">大小</th>
            <th class="">價格</th>
            <th class="">商品數量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(color, colorIndex) in productStore.specs.colors" :key="colorIndex">
            <!-- 顯示顏色 -->
            <td class="info__table-type">
              <div>{{ color }}</div>
              <div class="info__table-pic">
                <img :src="productStore.specs.colorImages[color]" alt="顏色圖片" />

                <!-- <img src="/cat.jpg" alt="" /> -->
              </div>
            </td>

            <!-- 顯示尺寸 -->
            <td class="info__table-size">
              <div>
                <div
                  class="info__table-sizeItem"
                  v-for="(size, sizeIndex) in productStore.specs.sizes"
                  :key="sizeIndex"
                >
                  {{ size }}
                </div>
              </div>
            </td>

            <!-- 商品價格輸入 -->
            <td class="info__table-price">
              <div
                v-for="(size, sizeIndex) in productStore.specs.sizes"
                :key="sizeIndex"
                class="info__table-inputGroup"
              >
                <div class="flex">
                  <div class="info__table-inputTitle">NT$</div>
                  <input
                    type="number"
                    v-model="priceValue[color][size]"
                    :min="1"
                    @input="updateProductPrice(color, size)"
                    class="info__table-inputValue"
                  />
                </div>
              </div>
            </td>

            <!-- 商品數量輸入 -->
            <td class="info__table-quantity">
              <div v-for="(size, sizeIndex) in productStore.specs.sizes" :key="sizeIndex">
                <input
                  type="number"
                  v-model="quantityValue[color][size]"
                  :min="1"
                  @input="updateProductQuantity(color, size)"
                  class="info__table-input"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { uploadImage } from '../api/index'

export default defineComponent({
  // name: 'QualityType',
  setup() {
    const productStore = useProductStore()

    // 取得顏色對應的圖片
    const getColorImage = (color: string) => {
      return productStore.specs.colorImages[color] || ''
    }

    const selectedFile = ref<File | null>(null)
    const imageUrl = ref<string>('/uploads/default.png')

    // 觸發文件選擇框
    const triggerFileInput = () => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      fileInput?.click()
    }

    // 處理圖片檔案變更
    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0]
        // console.log('✅ 已選取檔案：', selectedFile.value)

        // 使用 FileReader 即時預覽圖片
        const reader = new FileReader()
        reader.onload = (e) => {
          imageUrl.value = e.target?.result as string // Base64 預覽圖片
        }
        reader.readAsDataURL(selectedFile.value)
      }
    }

    // 上傳圖片並更新預覽 URL
    const upload = async () => {
      if (selectedFile.value) {
        try {
          const response = await uploadImage(selectedFile.value)
          console.log('📥 API 回傳結果：', response)
          // 檢查回傳的完整內容
          setTimeout(() => {
            imageUrl.value = `/uploads/${response.filename}?t=${Date.now()}`
            // console.log('✅ 圖片已成功上傳並顯示：', imageUrl.value)
          }, 500)
        } catch (error) {
          console.error('❌ 上傳失敗：', error)
        }
      } else {
        console.log('⚠️ 請先選擇圖片')
      }
    }

    // 商品數量
    const quantityValue = computed(() => {
      const values: Record<string, Record<string, number>> = {}
      productStore.specs.colors.forEach((color) => {
        values[color] = {}
        productStore.specs.sizes.forEach((size) => {
          values[color][size] = productStore.getProductQuantity(color, size)
        })
      })
      return values
    })

    // 更新數據到 Pinia
    const updateProductQuantity = (color: string, size: string) => {
      // }
      if (!quantityValue.value[color]) {
        quantityValue.value[color] = {} // 確保 `quantityValue[color]` 存在
      }
      productStore.setProductQuantity(color, size, quantityValue.value[color][size])
    }

    // 商品價格
    const priceValue = computed(() => {
      const values: Record<string, Record<string, number>> = {}
      productStore.specs.colors.forEach((color) => {
        values[color] = {}
        productStore.specs.sizes.forEach((size) => {
          values[color][size] = productStore.getProductPrice(color, size)
        })
      })
      return values
    })

    // 更新數據到 Pinia
    const updateProductPrice = (color: string, size: string) => {
      if (!priceValue.value[color]) {
        priceValue.value[color] = {} // 確保 `priceValue[color]` 存在
      }
      productStore.setProductPrice(color, size, priceValue.value[color][size])
    }

    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // ----------分隔線-----------
    // 定義新增規格的輸入框
    const newColor = ref('')
    const newSize = ref('')

    // 新增顏色
    const addNewColor = async () => {
      if (newColor.value.trim() && selectedFile.value) {
        try {
          const response = await uploadImage(selectedFile.value)
          // 上傳圖片並取得圖片路徑
          const imagePath = `/uploads/${response.filename}?t=${Date.now()}`

          // 將顏色與圖片路徑一起新增到 Pinia
          productStore.addColor(newColor.value.trim(), imagePath)

          // 等待 DOM 更新
          await nextTick()

          // 清空輸入框與已選圖片
          newColor.value = ''
          imageUrl.value = `/uploads/default.png`
          // selectedFile.value = null
        } catch (error) {
          console.error('❌ 上傳圖片失敗：', error)
        }
      } else {
        console.warn('⚠️ 請輸入顏色名稱並選擇圖片')
      }
    }

    // 方法：計算每個顏色的字數
    const getColorLength = (color: string) => {
      return color.length
    }
    const getSizeLength = (size: string) => {
      return size.length
    }

    // 新增大小
    const addNewSize = () => {
      if (newSize.value.trim()) {
        productStore.addSize(newSize.value.trim())
        newSize.value = '' // 清空輸入框
      }
    }

    return {
      availableColors: productStore.availableColors,
      availableSizes: productStore.availableSizes,
      newColor,
      getColorLength,
      newSize,
      getSizeLength,
      addNewColor,
      addNewSize,
      productStore,

      // 商品數量管理
      quantityValue,
      updateProductQuantity,

      // 商品價格管理
      priceValue,
      updateProductPrice,

      // 上傳圖片
      selectedFile,
      imageUrl,
      handleFileChange,
      upload,
      triggerFileInput,

      getColorImage,
    }
  },
})
</script>

<style lang="scss">
.type {
  &__box {
    // border: 1px solid blue;
    margin: 0 auto;
    width: 83%;
    &-titleIcon {
      color: rgb(203, 71, 5);
      margin-right: 2px;
    }
  }
  &__table {
    padding: 10px;
    margin: 5px 10px;
    background: #f5f4f4;

    &:last-child {
      margin-top: 20px;
    }
    // flex: 1;

    &-subtitle {
      color: #aaa;
      font-size: 10px;
    }
    &-header {
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    &-option {
      margin-top: 10px;

      button {
        margin-left: 5px;
      }
    }
    &-pic,
    &-uploadpic {
      width: 20px;
      height: 20px;
      margin-top: 2px;
      background-size: cover;
      background-position: center;
      border: 1px dashed #aaa;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &-pic {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      // background-image: url(/cat.jpg);
    }
    &-uploadpic {
      // background-image: url(/cat.jpg);
    }
    &-input {
      margin-left: 5px;
      border: 1px solid #ddd;
      background-color: #fff;
      flex: 1;
      padding-left: 5px;
    }
    &-amount {
      border: 1px solid #ddd;
      border-left: none;
      background-color: #fff;
      padding-inline: 5px;
    }
    &-move {
      margin-left: 5px;
      color: #aaa;
    }
    &-delete {
      margin-left: 5px;
      color: #aaa;
    }
  }
}
.info {
  &__table {
    &-type {
      width: 80px;
      padding-top: 10px;
    }
    &-pic {
      width: 50px;
      height: 50px;
      margin: 5px auto;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &-input {
      margin: 10px;
      padding: 2px 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 80%;
    }
    &-inputTitle,
    &-inputValue {
      margin: 10px;
      padding: 2px 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    &-inputTitle {
      margin-right: 0;
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      width: 40px;
    }
    &-inputValue {
      margin-left: 0;
      border-top-left-radius: 0;
      width: 80px;
      border-bottom-left-radius: 0;
      flex: 1;
    }
    &-size {
      // width: 80px;
      height: 80px;

      div {
        display: flex;
        height: 100%;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        // padding: 10px;
        flex: 1;
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: 1px solid transparent;
        }
      }
    }
    &-price {
      .info__table-inputGroup {
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: 1px solid transparent;
        }
      }
    }
    &-quantity {
      div {
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: 1px solid transparent;
        }
      }
    }
  }
  &__box {
    overflow: hidden;
    margin-top: 50px;

    &-titleIcon {
      color: rgb(203, 71, 5);
      margin-right: 2px;
    }

    .input-group {
      margin: 10px;
      width: auto;
    }

    table {
      width: 80%;
      margin: 0 auto;
      // font-family: 'Oswald', sans-serif;
      border-collapse: separate;
      // width: 100%;
      border-spacing: 0;
      border: 1px solid #aaa;
    }

    th {
      background-color: #eee;
      // color: #ffffff;
      // width: 25vw;
      // height: 50px;
    }

    td {
      background-color: #fff;
      // width: 25vw;
      // height: 50px;
      text-align: center;
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
      border-bottom: 1px solid transparent;
    }

    // tr:nth-of-type(2) td {
    // border-left: none;
    // width: 200px;
    // }

    // tr td:first-child {
    // border-left: none;
    // }

    th {
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
      text-align: center;
      padding: 10px;
    }

    tr:nth-of-type(1) th {
      border-top: none;
    }

    tr:first-child th:first-child {
      border-top: none;
      border-left: none;
    }

    tr:last-of-type {
      border-bottom: 2px solid #6b675d;
    }
  }
}
.pencil {
  color: rgb(37, 103, 235);
}
</style>
