<template>
  <div class="hello">
    <div class="hello1">
      <img src="../../assets/logo.png"/>
    </div>
    <div class="hello2">
      <h1>{{ msg }}</h1>
      <el-button  type="primary" @click.native.prevent="test">
        Sign in
      </el-button>
    </div>
  </div>

</template>

<script>
  import {GPS} from '@/utils/guijibug'

  export default {
    name: 'HelloWorld',
    data () {

      return {
        msg: 'Welcome to Your busCenter App'
      }
    },
    methods: {

      test(){
        //116.696693	39.548732
        //116.698787	39.54751




        var xx = 116.698787;
        var yy = 39.54751;
        //alert(1)lat: 39.52245719771927, lon: 116.65314540084421

        console.log(GPS.gcj_encrypt(yy,xx));
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
