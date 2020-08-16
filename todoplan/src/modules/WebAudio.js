// Web audio

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = new AudioContext()                                     // 创建音频上下文
const oscillator = audioCtx.createOscillator()                          // 创建音调控制对象
const gainNode = audioCtx.createGain()                                  // 创建音量控制对象

export default class WebAudio {
  constructor (type = 'sine', frequency = 196.00, volume = 1) {
    this.type = type
    this.frequency = frequency
    this.volume = volume
  }

  setVolume (val) {
    this.volume = val
  }

  init () {
    oscillator.type = this.type                                         // 音调类型指定为正弦波
    oscillator.frequency.value = this.frequency                         // 设置音调频率
    oscillator.connect(gainNode)                                        // 音调音量关联
    gainNode.connect(audioCtx.destination)                              // 音量和设备关联
  }

  play () {
    this.init()
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)               // 先把当前音量设为0
    gainNode.gain.linearRampToValueAtTime(this.volume, audioCtx.currentTime + 0.01)         // 0.01秒时间内音量从刚刚的0变成1，线性变化
    oscillator.start(audioCtx.currentTime)                                                  // 声音走起
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)           // 1秒时间内音量从刚刚的1变成0.001，指数变化
    oscillator.stop(audioCtx.currentTime + 0.32)                                            // 1秒后停止声音
    oscillator.disconnect(0)
    gainNode.disconnect(0)
  }
}
