import { View, Text } from '@tarojs/components'
import { Button } from "@taroify/core"
import './index.css'

export default function Index() {
  return (
    <View className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <View className="text-3xl font-extrabold text-blue-600 mb-8 tracking-tight">
        MallChat
      </View>
      
      <View className="w-full max-w-sm space-y-4">
        <Button color="primary" block shape="round" className="shadow-lg">
          Taroify 核心按钮
        </Button>
        
        <Button color="info" variant="outlined" block shape="round">
          Tailwind 边距测试
        </Button>
        
        <View className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
          <Text className="text-gray-500 text-center block text-sm">
            集成成功！支持 Tailwind 4 原子类
          </Text>
        </View>
      </View>
    </View>
  )
}

