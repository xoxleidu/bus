<template>
  <div class="hello">
    <div class="hello1">
      <img src="../../assets/logo.png"/>
    </div>
    <div class="hello2">
      <h1>{{ msg }}</h1>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'Welcome to Your busCenter App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .hello {
    width: 600px;
    height: 100%;
    margin: auto;
    padding-top: 100px;
  }
  .hello1 {
    width: 200px;
    height: 100%;
    margin: auto;
  }
  .hello2 {
    text-align: center;
  }
</style>
