// Dom Utility Class

const tapVoice = window.document.getElementById('tapVoice')
class UtilDom {
  static playTap () {
    tapVoice.currentTime = 0
    tapVoice.play()
  }
  static setTapVolume (val) {
    tapVoice.volume = val
  }
}

export default UtilDom
