
<template>
    <div >
      Counter: {{ counter }}
    </div>
</template>


<script lang="ts">
export default {
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}

</script>

