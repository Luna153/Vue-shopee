// src/stores/productStore.ts
import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    images: {},
    // 商品規格
    specs: {
      colors: ['紅色', '綠色', '藍色'],
      sizes: ['S', 'M'],
      // 顏色對應的圖片
      colorImages: {
        紅色: '../uploads/cat.jpg',
        綠色: '../uploads/cat.jpg',
        藍色: '../uploads/cat.jpg',
      } as Record<string, string>,
    },

    // 商品數量,使用 `顏色-尺寸` 作為 Key
    productQuantities: {} as Record<string, number>,
    productPrice: {} as Record<string, number>,
  }),

  // Getter（可以用於組件中計算或派生資料）
  getters: {
    availableColors: (state) => state.specs.colors,
    availableSizes: (state) => state.specs.sizes,
    getQuantity: (state) => (color: string, size: string) => {
      return state.productQuantities[`${color}-${size}`] || 0
    },
    getPrice: (state) => (color: string, size: string) => {
      return state.productPrice[`${color}-${size}`] || 0
    },
  },

  // Action（用於修改資料或業務邏輯）
  actions: {
    // 取得前台顏色對應的圖片
    // getColorImage(color: string) {
    //   return this.specs.colorImages[color] || ''
    // },
    // 設定商品數量，確保不同顏色尺寸獨立存儲
    setProductQuantity(color: string, size: string, quantity: number) {
      if (quantity < 0) quantity = 0
      this.productQuantities[`${color}-${size}`] = quantity
    },

    // 取得商品數量
    getProductQuantity(color: string, size: string) {
      return this.productQuantities[`${color}-${size}`] || 0
    },

    // 設定商品價格，確保不同顏色尺寸獨立存儲
    setProductPrice(color: string, size: string, price: number) {
      if (price < 0) price = 0
      this.productPrice[`${color}-${size}`] = price
    },

    // 取得商品價格
    getProductPrice(color: string, size: string) {
      return this.productPrice[`${color}-${size}`] || 0
    },

    // 新增顏色規格
    addColor(color: string, imagePath: string) {
      if (!this.specs.colors.includes(color)) {
        this.specs.colors.push(color)
        this.specs.colorImages[color] = imagePath
      }
    },

    // 新增尺寸規格
    addSize(size: string) {
      if (!this.specs.sizes.includes(size)) {
        this.specs.sizes.push(size)
      }
    },
  },
})
