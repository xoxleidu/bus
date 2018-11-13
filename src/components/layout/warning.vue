<template>
	<div class="line-list">
		<el-button type="primary" icon="arrow-left"  @click="close">返回</el-button>
		<div class="line-item" v-for="lineItem,lineItemIndex in currentLine.children">
			<h2>{{lineItem.data.LineName}} 线路 {{lineItemIndex+1}}</h2>
			<dl v-for="lineIndexs,index in lineItem.data.SiteList2" v-if="lineIndexs.length"> 
				<dt>{{index=="0"?"上行":"下行"}}</dt>
				<dd :class="'station-list ' + (index=='0'?'station-up':'station-down')">
					<div class="station" v-for="stationIndex in lineIndexs" 
					:class="(lineItem.stations[stationIndex].bus.length >=2?'shuangche-warning ':'') 
					+ (lineItem.stations[stationIndex].nextBus.length >=2?'shuangche-warning-next ':'')
					+ (lineItem.stations[stationIndex].bus.length?'has-bus ':'')
					">
						<h3 class="station-name">{{lineItem.stations[stationIndex].name}}</h3>
						<div class="bus-in" >
						      <span class="bus" v-for="bus in lineItem.stations[stationIndex].bus" :title="bus.CarCard"  :key="bus.CarCard" ></span>	
							
						</div>
						<div class="bus-out" >
							<span class="bus" :title="outBus.CarCard" v-for="outBus in lineItem.stations[stationIndex].nextBus">
								
							</span>    
						</div>
					</div>     
				</dd>
			</dl>

		</div>
	</div>

</template>

<script>
export default {
	props:['currentLine'],
	methods:{
		close:function(){
			this.$emit("close");
		}		
	}		
}
</script>

<style lang="less">
	dl,dt,dd{  padding:0;margin:0; list-style-type: none; position:relative; }
	dt{ font-weight:bold;}
	h2{ font-size:20px; font-weight:normal;padding-left:20px;}
	.station-list{clear:both; padding-top:130px;}
	.station-list:after{content:""; display: block; clear:both;}
	.line-item{ 
		dl{border-bottom:2px solid #ddd;}
		dt{ padding-left:20px; padding-top: 20px;}
		dd{display: flex;justify-content:space-around;}
		.station{flex:1;position: relative;height:200px;
			&:before{content:"";width:10px;height:10px; background: #007ad4; position: absolute; border-radius: 100%;left:50%;top:-20px;transform: translate(-50%,0); z-index:9;}
			&:after{content:"";width:100%;border-bottom:1px solid #007ad4; position: absolute;left:0;top:-15px;transform:translate(50%,0);}
			&.has-bus{
				&:before{background:#de8500;}
				.bus-in{
					.bus{background:#de8500;}
				}
			}
		}
		.station:nth-child(1){
			&:after{padding-left:80px;margin-left:-80px;}
		}
		.station-name{ font-weight:normal; font-size:14px;-webkit-writing-mode: vertical-lr; height:150px;    writing-mode: tb-rl;    writing-mode: vertical-lr;padding:0;margin:0;position:absolute;left:50%;transform: translate(-50%,0);}
		.bus-in{position:absolute; top:-30px;left:50%; transform: translate(-50%,-100%);}
		.bus-out{position:absolute; top:-30px;left:100%;transform: translate(-50%,-100%);}
		.bus{ font-size:12px; font-weight:normal; background:#007ad4; color:#FFF; border-radius: 3px; padding:1px 3px; display: block; white-space: nowrap;  border-radius: 3px; margin-bottom:5px;position:relative;
			&:after{content:"\f207"; display: inline-block;    font: normal normal normal 14px/1 FontAwesome;    font-size: inherit;    text-rendering: auto;    -webkit-font-smoothing: antialiased;    -moz-osx-font-smoothing: grayscale;}
		}
	}
	.station-down{padding:0 0 130px 0;
		.station{height:200px;
			.station-name{position:absolute;bottom:0; height:auto;}
			&:before{content:"";width:10px;height:10px; background: #007ad4; position: absolute; border-radius: 100%;bottom:-20px;top:auto;}
			&:after{content:"";width:100%;border-bottom:1px solid #007ad4; position: absolute;left:0;transform:translate(50%,0);bottom:-15px;top:auto;}
			.bus-in{ top:100%; transform: translate(-50%,35px);}
			.bus-out{top:100%;transform: translate(-50%,35px);}
			.bus{
				&:after{}
			}
		}
	}
	.line-list{
		.el-icon-close{position:absolute; font-size:30px; right:30px; top:0; cursor: pointer;}
	}



 .line-list{
    .line-item{width:100%;overflow-x:hidden;
      .shuangche-warning-next{
    &:before{z-index: 99;}
    &:after{border-color: red;}
    .bus{background: red !important;}
  }

  .shuangche-warning{
    .station-name{ color:red;}
    &:before{z-index: 99;}
    &:before{background: red !important;}
    .bus{background: red !important;}
  }
    }
  }
</style>


