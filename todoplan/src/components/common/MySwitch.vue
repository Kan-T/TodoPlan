<template>
  <div class="switch style1">
    <input type="checkbox" 
            :checked="checked" 
            @change.stop="toogle">
    <label>
      <i></i>
    </label>
  </div>
</template>

<script>
export default {
  name: 'MySwitch',
  components: { },
  model: {                  // bind v-model to checked property
    prop: 'checked',
    event: 'change'
  },
  props: ['checked'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    toogle (event) {
      this.$emit('change', event.target.checked)
    }
  }
}
</script>

<style lang="scss">
$switch-y: 1em;
$switch-x: 2.5em;
$content-on: "开";
$content-off: "关";

$switch-border: $switch-y * 0.15;         //computed parameters
$switch-radius: $switch-y * 0.6;
$switch-shadow: $switch-y * 0.02;
$switch-font-size: $switch-y * 0.5;

.switch *:after,*:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.switch {
  margin: $switch-border;
  position: relative;
  z-index: 10;
}

.switch label {           //container of switch look
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
}

.switch input {           //input show on top, and occupy all the switch
  top: 0; 
  right: 0; 
  bottom: 0; 
  left: 0;
  opacity: 0;
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* STYLE 1 */

.switch.style1 {
  width: $switch-x;
  height: $switch-y;
}

.switch.style1 label {              //lable controls the outside of the switch
  display: block;
  width: 100%;
  height: 100%;
  background: #a5a39d;
  border-radius: $switch-radius;
  box-shadow:
      inset 0 $switch-shadow $switch-shadow $switch-shadow rgba(0,0,0,0.2),
      0 $switch-shadow 0 rgba(255,255,255,0.5);
}

.switch.style1 label:after {
  content: "";
  position: absolute;
  z-index: -1;
  top: -$switch-border; 
  right: -$switch-border; 
  bottom: -$switch-border; 
  left: -$switch-border; 
  border-radius: inherit;  
  background: #ababab;
  background: linear-gradient(#f2f2f2, #ababab);
  box-shadow: 
        0 0 $switch-shadow rgba(0,0,0,0.3),
        0 $switch-shadow $switch-shadow rgba(0,0,0,0.25);
}

.switch.style1 label i {                //switch button
  display: block;
  height: 100%;
  width: 50%;
  border-radius: inherit;
  position: absolute;
  z-index: 2;
  right: 50%;
  top: 0;
  background: #b2ac9e;
  background: linear-gradient(#f7f2f6, #b2ac9e);
  box-shadow:
      inset 0 $switch-shadow 0 white, 
      0 0 $switch-shadow rgba(0,0,0,0.3),
      0 $switch-shadow $switch-shadow rgba(0,0,0,0.2);
}

.switch.style1 label i:after {          //switch button center style
  content: "";
  position: absolute;
  left: 15%;
  top: 25%;
  width: 70%;
  height: 50%;
  background: #d2cbc3;
  background: linear-gradient(#cbc7bc, #d2cbc3);
  border-radius: inherit;
}

.switch.style1 label i:before {                   //default lable style
  content: $content-off;
  height: 100%;
  position: absolute;
  left: 107%;
  right: auto;
  display: flex;
  flex-direction:column;
  justify-content: center;
  text-transform: uppercase;
  color: #fff;
  font-size: $switch-font-size;
}

.switch.style1 input:checked ~ label {               //ON label background
  background: #9abb82;
}

.switch.style1 input:checked ~ label i {             //ON label position
  right: 0%;
}

.switch.style1 input:checked ~ label i:before {       //ON label
  content: $content-on;
  left: auto;
  right: 107%;
  color: #82a06a;
}

.switch.style1 input:checked ~ label {               //ON label background
  background: #007bff;
}

.switch.style1 input:checked ~ label i {             //ON label position
  right: 0%;
}

.switch.style1 input:checked ~ label i:before {       //ON label
  content: $content-on;
  left: auto;
  right: 107%;
  color: #fff;  
}

</style>
