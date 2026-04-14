import { useState, useEffect, useCallback, useRef } from 'react'
import { Input, ScrollView, Text, View } from '@tarojs/components'
import { Comment } from '@taroify/icons'
import Taro from '@tarojs/taro'
import { doAiChat, listModels } from '@/api/ai/aiChatController'
import { listMyAiChatRecordVoByPage } from '@/api/ai/aiChatRecordController'
import { Skeleton, Picker, Popup, Avatar, Button } from '@taroify/core'

import './index.scss'

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<AiAPI.AiChatRecordVO[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [scrollIntoView, setScrollIntoView] = useState('')
  const [sending, setSending] = useState(false)
  const [models, setModels] = useState<AiAPI.AiModelVO[]>([])
  const [currentModel, setCurrentModel] = useState('dashscope')
  const [showPicker, setShowPicker] = useState(false)

  const sessionId = useRef(`ai-session-${Date.now()}`)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listMyAiChatRecordVoByPage({
        current: 1,
        pageSize: 50,
        sortField: 'createTime',
        sortOrder: 'ascend'
      })
      if (res.code === 0 && res.data?.records) {
        setMessages(res.data.records)
      }
    } catch (err) {
      console.error('Fetch AI history failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchModels = useCallback(async () => {
    try {
      const res = await listModels()
      if (res.code === 0 && res.data) {
        const nextModels = res.data.filter((item) => !!item.name)
        setModels(nextModels)
        if (!currentModel && nextModels[0]?.name) {
          setCurrentModel(nextModels[0].name)
        }
      }
    } catch (e) {
      console.error('Fetch models failed:', e)
    }
  }, [currentModel])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: 'AI 助理' })
    fetchHistory()
    fetchModels()
  }, [fetchHistory, fetchModels])

  useEffect(() => {
    if (messages.length > 0) {
      const lastId = messages[messages.length - 1].id
      setTimeout(() => setScrollIntoView(`msg-${lastId}`), 200)
    }
  }, [messages])

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || sending) return

    const userMsg: AiAPI.AiChatRecordVO = {
      id: Date.now(),
      message: text,
      userId: -1,
      createTime: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setSending(true)

    try {
      const res = await doAiChat({
        message: text,
        modelType: currentModel,
        sessionId: sessionId.current
      })

      if (res.code === 0 && res.data?.content) {
        const aiMsg: AiAPI.AiChatRecordVO = {
          id: Date.now() + 1,
          response: res.data.content,
          modelType: currentModel,
          createTime: new Date().toISOString()
        }
        setMessages(prev => [...prev, aiMsg])
      }
    } catch (err) {
      Taro.showToast({ title: 'AI 响应失败', icon: 'none' })
    } finally {
      setSending(false)
    }
  }

  return (
    <View className='mall-page'>
      <View className='ai-header'>
        <View className='model-chip' onClick={() => setShowPicker(true)}>
          <Comment size='14px' />
          <Text className='model-chip__text'>{currentModel}</Text>
        </View>
      </View>

      <ScrollView scrollY enhanced scrollWithAnimation className='mall-page__body' scrollIntoView={scrollIntoView}>
        <View className='ai-chat-content'>
          <View className='ai-welcome'>
            <Avatar src='https://api.dicebear.com/7.x/bottts/svg?seed=ai' style={{ width: '128rpx', height: '128rpx', marginBottom: '24rpx' }} />
            <View style={{ fontSize: '36rpx', fontWeight: 'bold' }}>我是 MallChat AI</View>
            <View style={{ fontSize: '28rpx', color: '#999', marginTop: '8rpx' }}>有什么我可以帮你的吗？</View>
          </View>

          {loading && messages.length === 0 ? (
            <View>
              {[1, 2].map((item) => (
                <View key={item} style={{ marginBottom: '32rpx' }}>
                  <Skeleton avatar title row={2} loading />
                </View>
              ))}
            </View>
          ) : messages.map((msg) => (
            <View key={msg.id} id={`msg-${msg.id}`} style={{ marginBottom: '32rpx' }}>
              {msg.message && (
                <View className='ai-bubble-row user'>
                  <View className='ai-bubble user'>{msg.message}</View>
                </View>
              )}
              {msg.response && (
                <View className='ai-bubble-row bot'>
                  <Avatar src='https://api.dicebear.com/7.x/bottts/svg?seed=ai' style={{ width: '64rpx', height: '64rpx', marginRight: '16rpx' }} />
                  <View className='ai-bubble bot'>{msg.response}</View>
                </View>
              )}
            </View>
          ))}
          {sending && (
            <View className='ai-bubble-row bot'>
              <Avatar src='https://api.dicebear.com/7.x/bottts/svg?seed=ai' style={{ width: '64rpx', height: '64rpx', marginRight: '16rpx' }} />
              <View className='ai-bubble bot loading'>正在思考...</View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className='ai-composer'>
        <View className='ai-composer__inner'>
          <Input
            className='ai-composer__input'
            value={inputValue}
            onInput={e => setInputValue(e.detail.value)}
            onConfirm={handleSend}
            placeholder='问问 AI...'
            disabled={sending}
          />
          <View onClick={handleSend} style={{ marginLeft: '16rpx' }}>
            <Button color='primary' size='small' shape='round' disabled={!inputValue.trim() || sending}>发送</Button>
          </View>
        </View>
      </View>

      <Popup open={showPicker} placement='bottom' onClose={() => setShowPicker(false)}>
        <Picker
          onCancel={() => setShowPicker(false)}
          onConfirm={(values) => {
            setCurrentModel(Array.isArray(values) ? values[0] : values)
            setShowPicker(false)
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择 AI 模型</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {models.map(m => (
              <Picker.Option key={m.name} value={m.name}>
                {m.name}
              </Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </Popup>
    </View>
  )
}
