<!DOCTYPE HTML>
<html>
	<style type="text/css">
  	 
  	</style>
  	<head>
  		<script type="text/javascript" src="../js/ext/jquery-1.8.3.js"></script>
  		<script type="text/javascript" src="../js/ext/raphael-min.js"></script>
  		<script type="text/javascript" src="../js/ext/raphael.pan-zoom.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_generic.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_obj.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_matrix.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_cursor.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_jie_graph.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_jie_map.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_global_vars.js"></script>
  		<script type="text/javascript" src="../js/jm/jm_get_jies.js"></script>
  		<link rel="stylesheet" type="text/css" href="jm_main_style.css"/>
		<link rel="stylesheet" type="text/css" href="jm_jdbx_style.css"/>
  		<title>Jiemaps</title>
  		
  	</head>
  	<body oncontextmenu="return false;">
  		<div id="map_container">
  		</div>
  		
  		<div id="top">
  			<img id="logo" src="img/Logo.png">
			<input type="text" id="jie_query">
		   	<input type="button" id="search_btn" value="Search" onclick = "get_jie_from_keyw();" >
		</div>
		
		<div id="map_controls">
			<a id="down" href="javascript:;"></a>
   			<a id="up" href="javascript:;"></a>
		</div>
		
		<div id="new_jie_controls">
 			<a id="show_map_data" href="javascript:;"></a>
 			<a id="new_jie_btn" href="javascript:;"></a>
 			<a id="save_new_jies_btn" href="javascript:;"></a>
		</div>
		
		<div id="map_data">
 		</div>
		
		<div id="bottom">
			JieMaps
		</div>
	</body>
</html>