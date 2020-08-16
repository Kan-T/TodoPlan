<template>
  <div class="auto-textarea-wrapper">
    <pre class="auto-textarea-block"><br/>{{tempValue}} </pre>
    <textarea ref="vTextarea" :autofocus="sAutofocus" @keyup="change" 
              spellcheck="false"  
              :placeholder="placeholder" 
              :class="['auto-textarea-input', 
                        border ? 'auto-textarea-border' : '',
                        warn ? 'warn-border' : '']"
              v-model="tempValue"  >
    </textarea>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'AutoTextarea',
    data () {
      return {
        tempValue: (() => {
          return this.value
        })(),
        sAutofocus: (() => {
          if (this.autofocus) {
            return 'autofocus'
          } else {
            return null
          }
        })()
      }
    },
    created () {
    },
    props: {
      warn: {
        type: Boolean,
        default: false
      },
      autofocus: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      border: {
        type: Boolean,
        default: false
      },
      resize: {
        type: Boolean,
        default: false
      },
      onchange: {
        type: Function,
        default: null
      }
    },
    methods: {
      change ($event) {
        if (this.onchange) {
          this.onchange(this.tempValue, $event)
        }
      }
    },
    watch: {
      value: function (val, oldVal) {
        this.tempValue = val
      },
      tempValue: function (val, oldVal) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss">
$font-size: 0.9em;
$line: 1.4em;

.auto-textarea-wrapper{
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: $font-size;
  line-height: $line;
  
  .auto-textarea-block{
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word !important;
    visibility: hidden !important;
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .auto-textarea-input{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0.6em;
    overflow-y: hidden;
    color: #2C3E50;
    resize: none;
    outline: 0;
    border: 0;
  }
  .auto-textarea-input.auto-textarea-border{          //overlay auto-textarea-input border
    border: 2px solid rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
  .auto-textarea-input.auto-textarea-border:focus{
    border: 2px solid rgb(0, 183, 255);    
  }
  .auto-textarea-input.warn-border{
    border: 2px solid red;    
  }
}

</style>
