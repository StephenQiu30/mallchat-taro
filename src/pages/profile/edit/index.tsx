import { useState, useEffect } from 'react'
import { Input, Text, View, Image, ScrollView } from '@tarojs/components'
import { Arrow } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { editUser, getLoginUser } from '@/api/user/userController'
import { setUserInfoAction } from '@/store/slices/userSlice'
import { setUserInfo, getToken } from '@/utils/auth'
import { baseURL } from '@/services/request'

import './index.scss'

export default function ProfileEditPage() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state: RootState) => state.user)

  const [userName, setUserName] = useState(userInfo?.userName || '')
  const [userAvatar, setUserAvatar] = useState(userInfo?.userAvatar || '')
  const [userProfile, setUserProfile] = useState(userInfo?.userProfile || '')
  const [userPhone, setUserPhone] = useState(userInfo?.userPhone || '')
  const [userEmail, setUserEmail] = useState(userInfo?.userEmail || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Sync state if userInfo changes
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.userName || '')
      setUserAvatar(userInfo.userAvatar || '')
      setUserProfile(userInfo.userProfile || '')
      setUserPhone(userInfo.userPhone || '')
      setUserEmail(userInfo.userEmail || '')
    }
  }, [userInfo])

  const handleSave = async () => {
    if (saving || uploading) return
    setSaving(true)
    try {
      Taro.showLoading({ title: '保存中...' })
      const res = await editUser({
        userName: userName.trim() || undefined,
        userAvatar: userAvatar || undefined,
        userProfile: userProfile.trim() || undefined,
        userPhone: userPhone.trim() || undefined,
        userEmail: userEmail.trim() || undefined,
      })
      if (res.code === 0) {
        // Refresh user info from server
        const userRes = await getLoginUser()
        if (userRes.code === 0 && userRes.data) {
          dispatch(setUserInfoAction(userRes.data))
          setUserInfo(userRes.data)
        }
        Taro.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 800)
      }
    } catch (err) {
      console.error('Edit user failed:', err)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setSaving(false)
      Taro.hideLoading()
    }
  }

  const handleChooseAvatar = async () => {
    if (uploading) return
    
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      const tempFilePath = res.tempFilePaths[0]
      if (!tempFilePath) return

      setUploading(true)
      Taro.showLoading({ title: '上传中...' })

      const token = getToken()
      
      Taro.uploadFile({
        url: `${baseURL}/file/upload?bizType=user_avatar`,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        success: (uploadRes) => {
          try {
            const data = JSON.parse(uploadRes.data) as FileAPI.BaseResponseFileVO
            if (data.code === 0 && data.data?.url) {
              setUserAvatar(data.data.url)
              Taro.showToast({ title: '上传成功', icon: 'success' })
            } else {
              Taro.showToast({ title: data.message || '上传失败', icon: 'none' })
            }
          } catch (e) {
            Taro.showToast({ title: '解析返回数据失败', icon: 'none' })
          }
        },
        fail: (err) => {
          console.error('Upload failed:', err)
          Taro.showToast({ title: '网络请求失败', icon: 'none' })
        },
        complete: () => {
          setUploading(false)
          Taro.hideLoading()
        }
      })
    } catch (err) {
      console.error('Choose image failed:', err)
    }
  }

  return (
    <View className='mall-page'>
      <ScrollView scrollY className='mall-page__body edit-scroll'>
        {/* Basic Section */}
        <View className='ios-card-group'>
          <View className='ios-card-item' hoverClass='ios-card-item--pressed' onClick={handleChooseAvatar}>
            <View className='ios-card-item__content last'>
              <Text className='edit-label'>头像</Text>
              <View style={{ display: 'flex', alignItems: 'center', padding: '12rpx 0' }}>
                <Image
                  src={userAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=guest'}
                  className='edit-avatar-img'
                  mode='aspectFill'
                />
                <Arrow size='14px' style={{ color: '#999999', marginLeft: '12rpx' }} />
              </View>
            </View>
          </View>
        </View>

        {/* Info Fields Section */}
        <View className='ios-card-group'>
          <View className='ios-card-item'>
            <View className='ios-card-item__content'>
              <Text className='edit-label'>昵称</Text>
              <Input
                className='edit-input'
                value={userName}
                onInput={e => setUserName(e.detail.value)}
                placeholder='请输入昵称'
                placeholderStyle='color: #999999;'
                maxlength={20}
              />
            </View>
          </View>
          <View className='ios-card-item'>
            <View className='ios-card-item__content last'>
              <Text className='edit-label'>简介</Text>
              <Input
                className='edit-input'
                value={userProfile}
                onInput={e => setUserProfile(e.detail.value)}
                placeholder='介绍一下自己'
                placeholderStyle='color: #999999;'
                maxlength={100}
              />
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View className='ios-card-group'>
          <View className='ios-card-item'>
            <View className='ios-card-item__content'>
              <Text className='edit-label'>手机</Text>
              <Input
                className='edit-input'
                value={userPhone}
                onInput={e => setUserPhone(e.detail.value)}
                placeholder='请输入手机号'
                placeholderStyle='color: #999999;'
                type='number'
                maxlength={11}
              />
            </View>
          </View>
          <View className='ios-card-item'>
            <View className='ios-card-item__content last'>
              <Text className='edit-label'>邮箱</Text>
              <Input
                className='edit-input'
                value={userEmail}
                onInput={e => setUserEmail(e.detail.value)}
                placeholder='请输入邮箱'
                placeholderStyle='color: #999999;'
                maxlength={50}
              />
            </View>
          </View>
        </View>

        {/* Padding for fixed button */}
        <View style={{ height: '240rpx' }} />
      </ScrollView>

      {/* Fixed Save button */}
      <View className='edit-footer'>
        <View
          className={`edit-save-btn ${(saving || uploading) ? 'edit-save-btn--disabled' : ''}`}
          hoverClass='edit-save-btn--pressed'
          onClick={handleSave}
        >
          <Text className='edit-save-btn__label'>{saving ? '保存中...' : '提交修改'}</Text>
        </View>
      </View>
    </View>
  )
}
