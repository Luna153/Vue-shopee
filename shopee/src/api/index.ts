export const uploadImage = async (file: File) => {
  if (!file) {
    throw new Error('未選擇圖片檔案')
  }
  // console.log('上傳的圖片檔案：', file) // 打印檔案內容

  const formData = new FormData()
  formData.append('image', file)

  // 檢查上傳的檔案
  // console.log('上傳的圖片檔案：', file)

  // 檢查 FormData 內容
  // for (const [key, value] of formData.entries()) {
  // console.log(`${key}:`, value)
  // }

  // console.log('FormData內容：', formData) // 檢查 FormData 是否正確

  try {
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      // console.log('圖片上傳失敗')
      throw new Error(`圖片上傳失敗，狀態碼: ${response.status}`)
    }

    const result = await response.json()
    // console.log('圖片上傳成功:', result)
    return result // 返回後端回應的結果
  } catch (error) {
    console.error('圖片上傳錯誤:', error)
    // throw new Error('圖片上傳失敗')
  }

  // return await response.json()
}
