<template>
  <div class="wrap__inner flex justify-center">
    <div class="pic">
      <img v-if="selectedColor" :src="getColorImage(selectedColor)" alt="顏色圖片" />
    </div>
    <div class="product">
      <div class="product__name">前端作業測試</div>
      <div class="product__price">${{ remainingPrice }}</div>
      <div class="product__info">
        <div class="product__type type-1 flex">
          <div class="type__name">顏色：</div>
          <div class="type__btns flex">
            <div
              class="type__btn type__btn-1"
              v-for="(color, colorIndex) in productStore.specs.colors"
              :key="colorIndex"
              :class="{ active: selectedColor === color }"
              @click="selectColor(color)"
            >
              {{ color }}
            </div>
          </div>
        </div>
        <div class="product__type type-2 flex">
          <div class="type__name">大小：</div>
          <div class="type__btns flex">
            <div
              class="type__btn type__btn-1"
              v-for="(size, sizeIndex) in productStore.specs.sizes"
              :key="sizeIndex"
              :class="{ active: selectedSize === size }"
              @click="selectSize(size)"
            >
              {{ size }}
            </div>
          </div>
        </div>
        <div class="product__amount flex">
          <div class="type__name">數量：</div>
          <div class="amount__btns flex">
            <div class="amount__btn amount__btn-1" @click="decreaseAmount">-</div>
            <div class="amount__btn amount__btn-2">{{ amount }}</div>
            <div class="amount__btn amount__btn-3" @click="increaseAmount">+</div>
            <div class="quantity">還剩下{{ remainingQuantity }}件</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'

export default defineComponent({
  // name: 'ProductAmount',
  setup() {
    const productStore = useProductStore()

    const selectedColor = ref<string | null>(null)
    const selectedSize = ref<string | null>(null)
    const amount = ref(0)
    const remainingQuantity = ref(0)
    const remainingPrice = ref(0)

    // 預設選取第一個顏色
    onMounted(() => {
      if (productStore.specs.colors.length > 0) {
        selectedColor.value = productStore.specs.colors[0]
      }
    })

    // 選擇顏色
    const selectColor = (color: string) => {
      selectedColor.value = color
      updateRemainingQuantity()
      updateRemainingPrice()
    }

    // 取得顏色對應的圖片
    const getColorImage = (color: string) => {
      // console.log(color)
      return productStore.specs.colorImages[color] || ''
    }

    // 選擇尺寸
    const selectSize = (size: string) => {
      // console.log('選擇的尺寸：', size)
      selectedSize.value = size
      updateRemainingQuantity()
      updateRemainingPrice()
    }

    // 更新剩餘數量
    const updateRemainingQuantity = () => {
      if (selectedColor.value && selectedSize.value) {
        remainingQuantity.value = productStore.getQuantity(selectedColor.value, selectedSize.value)
      }
    }

    // 更新價格
    const updateRemainingPrice = () => {
      if (selectedColor.value && selectedSize.value) {
        remainingPrice.value = productStore.getPrice(selectedColor.value, selectedSize.value)
      }
    }

    // 增加數量
    const increaseAmount = () => {
      if (amount.value < remainingQuantity.value) {
        amount.value++
      }
    }

    // 減少數量
    const decreaseAmount = () => {
      if (amount.value > 1) {
        amount.value--
      }
    }

    // 監視顏色和尺寸的變化
    watch([selectedColor, selectedSize], updateRemainingQuantity, updateRemainingPrice)

    return {
      productStore,
      selectColor,
      selectSize,
      selectedSize,
      selectedColor,
      amount,
      remainingQuantity,
      increaseAmount,
      decreaseAmount,
      updateRemainingQuantity,
      // 價格
      remainingPrice,
      updateRemainingPrice,

      getColorImage,
    }
  },
})
</script>

<style lang="scss">
.wrap__inner {
  // border: 1px solid red;
  padding: 15px;
}
.pic {
  width: 280px;
  height: 300px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.product {
  padding-left: 100px;

  &__name {
    font-size: 20px;
  }
  &__price {
    color: red;
    font-size: 18px;
    padding: 5px;
    background: #eee;
    margin-block: 20px 70px;
  }
  &__info {
    margin-top: 10px;
  }
  &__type,
  &__amount {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
}
.type {
  &__btn {
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #bbb;
    margin-right: 10px;

    &:hover {
      background: #ddd;
      cursor: pointer;
    }

    &.active {
      background-color: #ddd;
    }
  }
}

.amount {
  &__btns {
    width: 200px;
    height: 30px;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #bbb;

    &:first-child {
      flex: 1;
      border-right: 1px solid transparent;
      &:hover {
        background: #ddd;
        cursor: pointer;
      }
    }

    &:nth-child(2) {
      flex: 2;
      border-right: 1px solid transparent;
    }

    &:nth-child(3) {
      flex: 1;
      &:hover {
        background: #ddd;
        cursor: pointer;
      }
    }

    &:last-child {
      flex: 4;
      display: flex;
      align-items: end;
      margin-left: 5px;
    }

    &:active {
      background-color: #ddd;
    }
  }
}
.quantity {
  flex: 4;
  display: flex;
  align-items: center;
  margin-left: 15px;
  color: #666;
}
</style>
