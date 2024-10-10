<script setup>
import { onMounted, onUnmounted } from 'vue'

const laps = { hour: 0, min: 0, sec: 0 }
function updateTime() {
  const hour = document.getElementById('hour')
  const min = document.getElementById('min')
  const sec = document.getElementById('sec')
  const ribbon = document.querySelector('.ribbon')
  const ribbonChild = document.querySelector('.ribbon > div')

  const date = new Date()
  const secNum = date.getSeconds()
  const minNum = date.getMinutes() + (secNum + 1) / 60
  const hourNum = date.getHours() + minNum / 60

  if (secNum == 0) {
    laps.sec++
  }
  if (minNum == 0) {
    laps.min++
  }
  if (hourNum == 0) {
    laps.hour++
  }

  ribbon.style.transform = `rotate(${(secNum + 1) * 6 + 360 * laps.sec}deg)`
  ribbonChild.style.transform = `rotate(-${(secNum + 1) * 6 + 360 * laps.sec}deg)`
  sec.style.transform = `rotate(${(secNum + 1) * 6 + 360 * laps.sec}deg)`
  min.style.transform = `rotate(${minNum * 6 + 360 * laps.min}deg)`
  hour.style.transform = `rotate(${hourNum * 30 + 360 * laps.hour}deg)`

  const timeNums = document.querySelectorAll('.time > span')
  timeNums[0].innerHTML = fillZero(date.getHours())
  timeNums[1].innerHTML = fillZero(date.getMinutes())
  timeNums[2].innerHTML = fillZero(secNum)
}

function fillZero(num) {
  return String(num).padStart(2, '0')
}

let interval
onMounted(() => (interval = setInterval(updateTime, 1000)))
onUnmounted(() => clearInterval(interval))
</script>
<template>
  <div class="h-100vh bg-#d87575 flex flex-col justify-center items-center overflow-hidden">
    <h2 class="text-white">简易CSS时钟</h2>
    <div class="clock">
      <div class="on-hours" id="zero"></div>
      <div class="on-hours" id="one"></div>
      <div class="on-hours" id="two"></div>
      <div class="on-hours" id="three"></div>
      <div class="on-hours" id="four"></div>
      <div class="on-hours" id="five"></div>
      <div class="point" id="hour"></div>
      <div class="point" id="min"></div>
      <div class="point" id="sec"></div>
      <div class="ribbon"><div></div></div>
      <div class="clock-center"></div>

      <div class="time"><span>00</span>:<span>00</span>:<span>00</span></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.clock {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 2px solid rgba(255, 255, 255, 0.5);
}
.ribbon {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  mask-image: conic-gradient(transparent 33%, rgba(0, 0, 0, 1));
  transition: all 1s linear;
}
.ribbon > div {
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: conic-gradient(
    #ffacac,
    #ffe5b4,
    #ffff76,
    #baffba,
    #b6b6ff,
    #6d438b,
    #ffadff,
    #ffacac
  );
  mask-image: radial-gradient(transparent 68%, rgba(0, 0, 0, 1) 68%);
  transition: all 1s linear;
}
.clock-center {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff9999;
}
.point {
  position: absolute;
  height: 270px;
  width: 5px;
  transition: all 1s linear;
  background: linear-gradient(#d6f1ff 50%, transparent 50%);
}
#hour {
  height: 200px;
}
#min {
  width: 4px;
}
#sec {
  width: 2px;
  background: linear-gradient(#ebf8ff 50%, transparent 50%);
}
.on-hours {
  position: absolute;
  height: 3px;
  width: 300px;
  background: linear-gradient(90deg, #ddd 10%, transparent 10%, transparent 90%, #ddd 90%);
}
#zero {
  height: 5;
  transform: rotate(90deg);
  background: linear-gradient(90deg, #fff 10%, transparent 10%, transparent 90%, #fff 90%);
}
#one {
  transform: rotate(60deg);
}
#two {
  transform: rotate(30deg);
}
#three {
  height: 5;
  transform: rotate(0deg);
  background: linear-gradient(90deg, #fff 10%, transparent 10%, transparent 90%, #fff 90%);
}
#four {
  transform: rotate(-30deg);
}
#five {
  transform: rotate(-60deg);
}
.time {
  position: absolute;
  font-size: x-large;
  color: #fff;
  margin-bottom: 134px;
}
.time > span {
  border-radius: 4px;
  border: 1px solid #fff;
  padding: 4px;
  margin: 2px;
}
</style>
