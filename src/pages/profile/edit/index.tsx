import { useState, useEffect } from 'react'
import { Input, Text, View, Image } from '@tarojs/components'
import { Arrow } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { editUser, getLoginUser } from '@/api/user/userController'
import { setUserInfoAction } from '@/store/slices/userSlice'
import { setUserInfo } from '@/utils/auth'

import './index.scss'

export default function ProfileEditIndex() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state: RootState) => state.user)

  const [userName, setUserName] = useState(userInfo?.userName || '')
  const [userProfile, setUserProfile] = useState(userInfo?.userProfile || '')
  const [userPhone, setUserPhone] = useState(userInfo?.userPhone || '')
  const [userEmail, setUserEmail] = useState(userInfo?.userEmail || '')
  const [saving, setSaving] = useState(false)

  // Sync state if userInfo changes
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.userName || '')
      setUserProfile(userInfo.userProfile || '')
      setUserPhone(userInfo.userPhone || '')
      setUserEmail(userInfo.userEmail || '')
    }
  }, [userInfo])

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      Taro.showLoading({ title: '保存中...' })
      const res = await editUser({
        userName: userName.trim() || undefined,
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
    } finally {
      setSaving(false)
      Taro.hideLoading()
    }
  }

  return (
    <View className='mall-page'>
      <View className='mall-page__body'>
        {/* Avatar section */}
        <View className='edit-section'>
          <View className='edit-avatar-row'>
            <Text className='edit-label'>头像</Text>
            <View className='edit-avatar-row__right'>
              <Image
                src={userInfo?.userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
                className='edit-avatar-img'
              />
              <Arrow size='16px' style={{ color: '#C7C7CC' }} />
            </View>
          </View>
        </View>

        {/* Info fields */}
        <View className='edit-section'>
          <View className='edit-field'>
            <Text className='edit-label'>昵称</Text>
            <Input
              className='edit-input'
              value={userName}
              onInput={e => setUserName(e.detail.value)}
              placeholder='请输入昵称'
              placeholderStyle='color: #C7C7CC;'
              maxlength={20}
            />
          </View>
          <View className='edit-field'>
            <Text className='edit-label'>简介</Text>
            <Input
              className='edit-input'
              value={userProfile}
              onInput={e => setUserProfile(e.detail.value)}
              placeholder='介绍一下自己'
              placeholderStyle='color: #C7C7CC;'
              maxlength={100}
            />
          </View>
          <View className='edit-field'>
            <Text className='edit-label'>手机</Text>
            <Input
              className='edit-input'
              value={userPhone}
              onInput={e => setUserPhone(e.detail.value)}
              placeholder='请输入手机号'
              placeholderStyle='color: #C7C7CC;'
              type='number'
              maxlength={11}
            />
          </View>
          <View className='edit-field edit-field--last'>
            <Text className='edit-label'>邮箱</Text>
            <Input
              className='edit-input'
              value={userEmail}
              onInput={e => setUserEmail(e.detail.value)}
              placeholder='请输入邮箱'
              placeholderStyle='color: #C7C7CC;'
              maxlength={50}
            />
          </View>
        </View>

        {/* Save button */}
        <View className='edit-save-wrap'>
          <View
            className={`edit-save-btn ${saving ? 'edit-save-btn--disabled' : ''}`}
            hoverClass='edit-save-btn--pressed'
            onClick={handleSave}
          >
            <Text className='edit-save-btn__label'>{saving ? '保存中...' : '保存'}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
