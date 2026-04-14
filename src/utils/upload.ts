import Taro from '@tarojs/taro'
import { baseURL } from '@/services/request'
import { getToken } from '@/utils/auth'

export async function uploadFileByBizType(
  bizType: 'user_avatar' | 'chat_image' | 'chat_file',
  filePath: string
): Promise<FileAPI.FileVO> {
  const token = getToken()

  const res = await Taro.uploadFile({
    url: `${baseURL}/file/upload?bizType=${bizType}`,
    filePath,
    name: 'file',
    header: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const data = JSON.parse(res.data) as FileAPI.BaseResponseFileVO

  if (data.code !== 0 || !data.data) {
    throw new Error(data.message || '上传失败')
  }

  return data.data
}
