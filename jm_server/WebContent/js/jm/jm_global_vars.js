/**
 * 
 */
$(document).ready(function()  {
	
	WJ_GLOBAL_jie_map = new Wj_Jie_Map('map_container','map_data');

	$("#show_map_data").click(function () {
    	$("#map_data").toggle('show');
    });
	
	$("#map_controls #up").click(function (e) {
		var jie_map = WJ_GLOBAL_jie_map;
		jie_map.panZoom.zoomIn(1);
	    e.preventDefault();
	});
	
	$("#map_controls #down").click(function (e) {
		var jie_map = WJ_GLOBAL_jie_map;
		jie_map.panZoom.zoomOut(1);
	    e.preventDefault();
	});
	
	$("#new_jie_btn").click(function () {
		var jie_map = WJ_GLOBAL_jie_map;
    	var jie_id = jie_map.get_new_jie_id();
    	var node_id = jie_map.get_new_node_id();
    	
    	var new_jie = new JieObj(jie_id,null,null,null,node_id);
    	
    	var new_jie_ix = jie_map.add_jie(new_jie,0,1);
    	
    	jie_map.new_jies_ixs.push(new_jie_ix);
    	
    	jie_map.layout_force();
    	jie_map.draw();
    	
    	$("#save_new_jies_btn").toggle('true');
    });
	
	$("#save_new_jies_btn").click(function (e) {
		var jie_map = WJ_GLOBAL_jie_map;
		var new_jies = new Array ();
		var new_jies_ixs = jie_map.new_jies_ixs;
		
		for(ix in new_jies_ixs) {
			new_jies.push(jie_map.jie_list[new_jies_ixs[ix]]);
		}
		
		new_jies_str = JSON.stringify(js_to_json(new_jies));
		send_jie_data_to_server(new_jies_str);
		
	});
    	
	// get_jie_data_from_server('abaft'); 
	
});