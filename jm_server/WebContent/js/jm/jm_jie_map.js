/**
 * 
 */
function Wj_Jie_Map(canvas_name,jie_data_box) {
	// size and zoom
	this.canvas_name = canvas_name;
	this.jd_base_div_ref = '#'+jie_data_box;
	this.baricenter = [0,0];
	
	this.zomm_step_init = 5;
	this.zomm_step_size = 0.1;
	this.init_scale = 1 - this.zomm_step_size*this.zomm_step_init;// sizes below are set for zoom 5
	
	// node style
	this.node_radius = 10*this.init_scale; // the radius of the central circle of a node
	this.node_line_thk = 0*this.init_scale; // the thickness of the border of the node
	this.node_color = '#9EA0AE'; // the color of the node central cricle
	this.node_line_color = '#81BCC0'; // the color of the node border

	// vertices style
	this.vert_thk = 16*this.init_scale; // the thickness of the vertices among nodes
	this.vert_color_count = 0; // a counter to plot the vertices of each new
	this.vert_color_list = [ '#003366', '#006699', '#0066CC', '#0099FF','#3366FF','#3333CC','#0000CC','#99CCFF','#9966FF','#333399' ];

	// urls style
	this.url_ang0 = wj_deg2rad(-15); // the inital rotation of the branches
	this.url_radius = 6*this.init_scale; // url radius
	this.url_dist = 12*this.init_scale; // url distance to node center
	this.url_color = '#66CCFF'; // the standard color of a the bubble
	this.url_hover_color = '#6699FF'; // the standard color of a the bubble
	this.url_line_color = '#6A9BCC'; // the standard color of a border of the
	this.url_link_thk = 6; // the distance from the center of the node to the
	this.url_link_color = '#9EA0AE'; // the color of the branch that connects the

	// titles style
	this.title_color_list = [ '#6E6E6E', '#424242', '#585858', '#2E2E2E' ]; // the
	this.title_font_famility = "Helvetica";
	this.title_font_size = 12;
	this.title_opacity = 1;

	// Jie Map components
	this.jie_list = null; // store a complete jie list with all the jies currently in the map
	this.new_jies_ixs = new Array(); // store a list of the ixs of the jies in the jie_list that are new
	this.jie_graph = new Wj_Jie_Graph(this.init_scale); // store the jie_graph object used to layout the jies in the map
	this.panZoom = null; // this object allows for panZoom features
	
	// variables to help interacting with different objects
	this.jie_ix_sel = 0;
	this.node_ix_sel = 0;
	this.url_ix_sel = 0;
	this.n_new_jies = 0;
	this.n_new_nodes = 0;
	this.n_new_urls = 0;
	
	// jie creation
	this.temp_node = null;
	this.my_jie_list = null;
	
	this.init();
};


//===================================
//Jie Map Initialization Methods
//===================================

Wj_Jie_Map.prototype.init = function () {
	this.jie_list = null;
	this.new_jies_ixs = new Array();
	this.jie_graph = new Wj_Jie_Graph(this.init_scale);
	this.panZoom = null;
	
	this.jd_empty();
	
	this.init_paper();
};

Wj_Jie_Map.prototype.init_paper = function () {

    var xSize = $("#"+this.canvas_name).width();
    var ySize = $("#"+this.canvas_name).height();
    
    this.paper = new Raphael(this.canvas_name, xSize, ySize);
    
    var zomm_init_pos_x = xSize/2*this.init_scale;
    var zomm_init_pos_y = ySize/2*this.init_scale;
    
    this.panZoom = this.paper.panzoom({ initialZoom: this.zomm_step_init, 
    							   initialPosition: { x:zomm_init_pos_x, y:zomm_init_pos_y} , 
    							   minZoom: 0, 
    							   zoomStep: this.zomm_step_size});
    
    this.panZoom.enable();
};

Wj_Jie_Map.prototype.allow_drop = function (ev) {
    ev.preventDefault();
}

Wj_Jie_Map.prototype.drop = function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text/plain");
    
    $("#map_info").text(data);
}

Wj_Jie_Map.prototype.clean_paper = function() {
	this.paper.clear();
}

//===================================
//Jie Map Jie graph interfaces
//===================================
Wj_Jie_Map.prototype.place_init = function(jie_list) {
	
	this.jie_graph.place_init();
};

Wj_Jie_Map.prototype.layout_force = function(jie_list) {
	
	this.jie_graph.layout_force();
};

Wj_Jie_Map.prototype.froze = function() {
	
	this.jie_graph.froze();
};

//===================================
//Jie Map Element Addition
//===================================
Wj_Jie_Map.prototype.set_jies = function(jie_list) {
	
	for(var jie_ix in jie_list) {
		this.add_jie(jie_list[jie_ix]);
	}
};

Wj_Jie_Map.prototype.add_jie = function(jie,jd_pos,jd_expand) {
	
	var jie_ix = 0;
	
	if(this.jie_list) {
		// update the jie list
		this.jie_list.push(jie);
		// jie ix is the length as it was added at the end
		jie_ix = this.jie_list.length - 1;
		
		// update the jie graph graph
		this.jie_graph.add_nodes_and_links_from_jie(jie);
				
		// update the jie data
		this.jd_append_jie(jie_ix,jd_pos,jd_expand);
		
	} else {
		// if empty, create empty array and add the jie
		this.jie_list = new Array();
		jie_ix = this.add_jie(jie);
	}
	
	return jie_ix;
};

Wj_Jie_Map.prototype.add_node = function(node,jie_ix) {
	
	var link_to = new Array();
	var node_ix = '';
	
	// if jie list 
	if(this.jie_list) {
		// if jie at index exist
		if(this.jie_list[jie_ix]) {
			// if nodes array exist
			if(this.jie_list[jie_ix].nodes) {
				// link to the current last node on this jie
				last_node_ix = this.jie_list[jie_ix].nodes.length - 1;
				link_to.push(this.jie_list[jie_ix].nodes[last_node_ix]);
			}							
			
			this.jie_list[jie_ix].nodes.push(node);
			// node ix is the length as it was added at the end
			node_ix = this.jie_list[jie_ix].nodes.length-1;
			
			// add the node to the jie_graph
			this.jie_graph.add_node(node,link_to);
			
			// add node to jie data box
			this.jd_append_node(jie_ix,node_ix) ;
			
		} else {
			// index in jie list does not exist, do nothing
		}
	} else {
		// if jie list does not exist, do nothing
	}
	
	return node_ix;
};

Wj_Jie_Map.prototype.add_url = function(url,jie_ix,node_ix) {
	
	var url_ix = 0;
	
	if(this.jie_list) {
		if(this.jie_list[jie_ix]) {
			// if jie list and jie at index exist
			if(this.jie_list[jie_ix].nodes) {
				this.jie_list[jie_ix].nodes[node_ix].urls.push(url);
				url_ix = this.jie_list[jie_ix].nodes[node_ix].urls.length-1;
				// add url to jie data box
				this.jd_append_url(jie_ix,node_ix,url_ix);
			}							
		}
	}
	
	return url_ix;
};

Wj_Jie_Map.prototype.get_new_jie_id = function() {

	var jie_id = 'J' + this.n_new_jies;
	this.n_new_jies = this.n_new_jies + 1;
	
	return jie_id;
};

Wj_Jie_Map.prototype.get_new_node_id = function() {
	var node_id = 'N' + this.n_new_nodes;
	this.n_new_nodes = this.n_new_nodes + 1;
	
	return node_id;
};

Wj_Jie_Map.prototype.get_new_url_id = function() {
	var url_id = 'U' + this.n_new_urls;
	this.n_new_urls = this.n_new_urls + 1;
	
	return url_id;
};

//===================================
//Jie Map Drawing
//===================================

Wj_Jie_Map.prototype.draw = function(debug_f) {
	
	var debug_f = debug_f || 0;
	
	this.clean_paper();
	this.draw_nodes(debug_f);
	this.draw_jie_links();
};

Wj_Jie_Map.prototype.mapcoord_to_paper = function(pos_map) {

	var pos_paper = new Array(2);
	
	pos_paper[0] = this.paper.width/2 + (pos_map[0] - this.baricenter[0]);
	pos_paper[1] = this.paper.height/2 - (pos_map[1] - this.baricenter[1]);;
	
	return pos_paper;
};

Wj_Jie_Map.prototype.paper_to_mapcoord = function(pos_paper) {

	var pos_map = new Array(2);
	
	pos_map[0] =  pos_paper[0] - this.paper.width/2  + this.baricenter[0];
	pos_map[1] = -pos_paper[1] + this.paper.height/2 + this.baricenter[1];;
	
	return pos_map;
};

Wj_Jie_Map.prototype.draw_nodes = function(debug_f) {
	
	this.update_baricenter();
	
	for(var ix_node in this.jie_graph.nodes) {
		var this_node = this.jie_graph.nodes[ix_node];
		
		this.draw_node(this_node,debug_f);
	}
};

Wj_Jie_Map.prototype.update_baricenter = function() {
	
	this.baricenter = [0,0];

	var n_nodes = this.jie_graph.get_n_nodes();
	
	for(var ix_node in this.jie_graph.nodes) {
		var this_node = this.jie_graph.nodes[ix_node];
		
		this.baricenter[0] += this_node.graph.pos[0]/n_nodes;
		this.baricenter[1] += this_node.graph.pos[1]/n_nodes;
	}
	
};

Wj_Jie_Map.prototype.draw_node = function(this_node,debug_f) {
	
	debug_f = debug_f || 0;
	
	var node_center_map_pos = this.mapcoord_to_paper(this_node.graph.pos);
	
	var raph_center = this.draw_raph_node(node_center_map_pos);
	
	if(debug_f == 1) {
		this.paper.text(node_center_map_pos[0], node_center_map_pos[1], this.jie_graph.nodes.indexOf(this_node));
	} else {
		n_urls = this_node.urls.length;
		var rel_url_pos = new Array(n_urls); // position relative to node center
		
		if(n_urls == 1){
			rel_url_pos[0] = [0,0];
			var raph_url_links = new Array(0);
		} else {
			var raph_url_links = new Array(n_urls); // array of raphael objects of links
			var cursor = new Cursor();
			
			//var random_rot = wj_random(0,2 * Math.PI);
			var random_rot = 0;
			
			for(var ix_url = 0; ix_url < n_urls; ix_url++){
				
				var this_dir = ix_url * (2 * Math.PI / n_urls);
				
				cursor.pos = [0,0];
				cursor.move(this.url_dist,this_dir + this.url_ang0 + random_rot);
				var this_url_rel_pos = cursor.pos;
				
				var link_end = new Array(2);
				link_end[0] = node_center_map_pos[0] + this_url_rel_pos[0];
				link_end[1] = node_center_map_pos[1] + this_url_rel_pos[1];
				
				raph_url_links[ix_url] = this.draw_line(node_center_map_pos,link_end,this.url_link_color,this.url_link_thk,0);
				rel_url_pos[ix_url] = this_url_rel_pos;
			}
		}
	
		raph_urls = new Array(n_urls); // array of raphael objects of urls
		
		for(var ix_url = 0; ix_url < n_urls; ix_url++){
			var url_pos = new Array(2);
			url_pos[0] = node_center_map_pos[0] + rel_url_pos[ix_url][0];
			url_pos[1] = node_center_map_pos[1] + rel_url_pos[ix_url][1];
			
			raph_urls[ix_url] = this.draw_raph_url(url_pos,this_node.urls[ix_url]);
		}
		
		
		this_node.raph.center = raph_center;
		this_node.raph.links = raph_url_links;
		this_node.raph.urls = raph_urls;
		
		this.node_toFront(this_node);
	}
};

Wj_Jie_Map.prototype.node_toFront = function(node) {
	urls = node.raph.urls;
	links = node.raph.links;
	center = node.raph.center;

	// the node links on top of it
	for(var ix_links = 0; ix_links < links.length; ix_links++){
		links[ix_links].toFront();
	}
		
	// the node center
	center.toFront();
	
	// the urls
	for(var ix_url = 0; ix_url < urls.length; ix_url++){
		urls[ix_url].toFront();
	}

};

Wj_Jie_Map.prototype.draw_raph_node = function (pos) {
	
	var raph_node = this.paper.circle(pos[0], pos[1], this.node_radius);

    raph_node.attr('fill', this.node_color);
    raph_node.attr('stroke', this.node_line_color);
    raph_node.attr('stroke-width', this.node_line_thk);

    return raph_node;
};

Wj_Jie_Map.prototype.draw_raph_url = function (pos,url_obj) {
    
	var raph_url = this.paper.circle(pos[0], pos[1], this.url_radius);

	raph_url.attr('fill', this.url_color);
	raph_url.attr('stroke', this.url_line_color);
	raph_url.attr('stroke-width', this.url_line_thk);

	raph_url.attr('cursor', 'pointer');

    $(raph_url.node).click(function () {
        window.open(url_obj.url);
    });
    
    $(raph_url.node).hover(function () {
    	$(this).attr('fill',WJ_GLOBAL_jie_map.url_hover_color);
    	$('#map_info').text(url_obj.url);
    	
    }, function () {
		$(this).attr('fill',WJ_GLOBAL_jie_map.url_color);
		$('#map_info').text('');
	});
    
    return raph_url;
};

Wj_Jie_Map.prototype.draw_jie_links = function() {
	
	for(var ix_jie in this.jie_list) {
		var this_jie = this.jie_list[ix_jie];
		for(var ix_node = 0; ix_node < this_jie.nodes.length - 1; ix_node++) {
			var this_node = this_jie.nodes[ix_node];
			var next_node = this_jie.nodes[ix_node+1];
			var ix_color = ix_jie % this.vert_color_list.length;
			this.draw_line(this.mapcoord_to_paper(this_node.graph.pos),this.mapcoord_to_paper(next_node.graph.pos),this.vert_color_list[ix_color],this.vert_thk,1);
		}
	}
};

Wj_Jie_Map.prototype.draw_line = function (pos_init,pos_end,color,thk,send_to_back_f) {
    
	var path = ["M", pos_init[0], pos_init[1], "L", pos_end[0], pos_end[1]];
    
	var raph_path = this.paper.path(path);
	raph_path.attr("stroke", color);
	raph_path.attr("stroke-width", thk);
    
	if(send_to_back_f == 1) {
		raph_path.toBack();
	}
	
    return raph_path;
};

//===================================
// Jie Data Box
//===================================

Wj_Jie_Map.prototype.jd_empty = function() {
	
	$(this.jd_base_div_ref).empty();
};

Wj_Jie_Map.prototype.jd_get_divref_from_boxix = function(boxix) {
	
	var childs = $(this.jd_base_div_ref).children();
	
	return ("#"+$(childs[boxix]).attr('id'));
}

Wj_Jie_Map.prototype.jd_append_jie = function(jie_ix,pos,expanded) {

	// adds a jie div with all its nodes and urls sub divs to the jie data base div

	expanded = expanded || 0;
	
	var jie = this.jie_list[jie_ix];
	
	var this_el_id = jie_ix;
	
    var el_to_append = $("<div class = jie_data_box id = jie_data_box" + this_el_id + " data_jie_ix = " + jie_ix + "/>");
    if (typeof pos !== 'undefined') {
		$(this.jd_get_divref_from_boxix(pos)).before(el_to_append);
	} else {
		$(this.jd_base_div_ref).append(el_to_append);
	}
	
	// append, into the jie div, the div for the header and that of the content
	$('#jie_data_box'+this_el_id).append($("<div class = jdbx_jie_head id=jdbx_jie_head" + this_el_id + ">"))
	$('#jie_data_box'+this_el_id).append($("<div class = jdbx_jie_content id=jdbx_jie_content" + this_el_id + ">"))
	
	// append, into the header div, the div for the control button, 
	$('#jdbx_jie_head'+this_el_id).append($("<div class = jdbx_jie_head_ctr id=jdbx_jie_head_ctr" + this_el_id + ">"))
	// append, into the header div, the div for the header text (title). Add custom attributo to control its edition 
	$('#jdbx_jie_head'+this_el_id).append($("<div class = jdbx_jie_head_content id=jdbx_jie_head_content" + this_el_id + " data_edit_f=0>"))
	// append, into the header div, and the div for the edit button
	$('#jdbx_jie_head'+this_el_id).append($("<div class = jdbx_jie_head_edit id=jdbx_jie_head_edit" + this_el_id + ">"))
	
	// append, into the div for the header title, a paragraph with the jie title
	$('#jdbx_jie_head_content'+this_el_id).append($("<p class = jdbx_jie_head_content_p " +
			"id = jdbx_jie_head_content_p" + this_el_id + ">" + jie.title + "</p>"));
	
	// assign the action of replacing the paragraph in the jie header content with a text area to edit it
	// and change the edit button into a check button
	$("#jdbx_jie_head_edit"+this_el_id).click(function () {
		
		var edit_f = $('#jdbx_jie_head_content'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jdbx_jie_head_content_p'+this_el_id).replaceWith("<textarea class = jdbx_jie_head_content_e " +
					"id = jdbx_jie_head_content_e" + this_el_id + ">" + $("#jdbx_jie_head_content_p" + this_el_id).text() + "</textarea>");
			$('#jdbx_jie_head_edit'+this_el_id).css('background','green');
			$('#jdbx_jie_head_content'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#jie_data_box" + this_el_id).attr('data_jie_ix')
			var new_title = $("#jdbx_jie_head_content_e" + this_el_id).val();
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].title = new_title;
			
			// update paragraph with the jie title
            $('#jdbx_jie_head_content_e'+this_el_id).replaceWith("<p class = jdbx_jie_head_content_p " +
                    "id = jdbx_jie_head_content_p" + this_el_id + ">" + new_title + "</p>");
            $('#jdbx_jie_head_edit'+this_el_id).css('background','gray');
            $('#jdbx_jie_head_content'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	// append, into the div for jie content, a div with a description of the jie (still TBD what a "description" is)
	$('#jdbx_jie_content'+this_el_id).append($("<div class = jdbx_jie_desc id=jdbx_jie_desc" + this_el_id + " data_edit_f=0>"))
	$('#jdbx_jie_content'+this_el_id).append($("<div class = jdbx_jie_desc_edit id=jdbx_jie_desc_edit" + this_el_id + ">"))

	// add a paragraph with a description of the jie to the description div
	$('#jdbx_jie_desc'+this_el_id).append($("<p class = jdbx_jie_desc_p " +
			"id = jdbx_jie_desc_p" + this_el_id + ">" + jie.desc + "</p>"));

	// assign the action of replacing the paragraph in the jie description content with a text area to edit it
	// and change the edit button into a check button
	$("#jdbx_jie_desc_edit"+this_el_id).click(function () {

		var edit_f = $('#jdbx_jie_desc'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jdbx_jie_desc_p'+this_el_id).replaceWith("<textarea class = jdbx_jie_desc_e " +
					"id = jdbx_jie_desc_e" + this_el_id + ">" + $("#jdbx_jie_desc_p" + this_el_id).text() + "</textarea>");
			$('#jdbx_jie_desc_edit'+this_el_id).css('background','green');
			$('#jdbx_jie_desc'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#jie_data_box" + this_el_id).attr('data_jie_ix')
			var new_desc = $("#jdbx_jie_desc_e" + this_el_id).val() ;
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].desc = new_desc;
			
			// update paragraph with the node desc
            $('#jdbx_jie_desc_e'+this_el_id).replaceWith("<p class = jdbx_jie_desc_p " +
					"id = jdbx_jie_desc_p" + this_el_id + ">" + new_desc + "</p>");
            $('#jdbx_jie_desc_edit'+this_el_id).css('background','gray');
            $('#jdbx_jie_desc'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	// assign the action of showing/hiding jie contents
	$("#jdbx_jie_head_ctr"+this_el_id).click(function () {
		$('#jdbx_jie_content'+this_el_id).slideToggle('show');
	});
	
	if(expanded == 1) {
		$('#jdbx_jie_content'+this_el_id).slideToggle('show');
	}
	
	// append the div in which the node_data_box will be added
	$('#jdbx_jie_content'+this_el_id).append($("<div class = jdbx_jie_nodes id=jdbx_jie_nodes" + this_el_id + ">"))
	
	
	// append all nodes
	this.jd_append_nodes(jie_ix,expanded);
	
	// append the "new node" division
	$('#jdbx_jie_content'+this_el_id).append($("<div class = jdbx_new_node_box id=jdbx_new_node_box" + this_el_id + 
			" data_jie_ix=" + jie_ix + ">"));
	
	$('#jdbx_new_node_box'+this_el_id).append($("<p class = jdbx_new_node_box_text_content_p " +
			"id = jdbx_new_node_box_text_content_p" + this_el_id + ">add new node</p>"));
	
	// assign the action of adding a node when clicking on the new node button
	$('#jdbx_new_node_box'+this_el_id).click(function () {
		
		var data_jie_ix = $(this).attr('data_jie_ix');
				
		var node_id = WJ_GLOBAL_jie_map.get_new_node_id();
		
		var new_node = new NodeObj(node_id);
		
		// add node to the jie map
		var node_ix = WJ_GLOBAL_jie_map.add_node(new_node,data_jie_ix);
		
		WJ_GLOBAL_jie_map.layout_force();
		WJ_GLOBAL_jie_map.draw();
		
	});
	
};

Wj_Jie_Map.prototype.jd_append_nodes = function(jie_ix,expanded) {
	
	var jie = this.jie_list[jie_ix];
	
	for (var node_ix in jie.nodes) {
		// append each node
		this.jd_append_node(jie_ix,node_ix,expanded);
	}
}

Wj_Jie_Map.prototype.jd_append_node = function(jie_ix,node_ix,expanded) {
	
	expanded = expanded || 0;
	
	// adds a node div with all its urls sub divs to the jie div of the jie_ix specified
	
	var jie = this.jie_list[jie_ix];
	var node = jie.nodes[node_ix];
		
	var this_el_id = jie_ix + "_" + node_ix;

	// nodes container id is standard, see jd_append_jie
	jdbx_jie_nodes_ref = "#jdbx_jie_nodes"+jie_ix;
	
	// append the div in which this node data will be added. Store the jie index and the node index as attributes
	var el_to_append =  $("<div class = jdbx_node_data_box id=jdbx_node_data_box" + this_el_id + 
			" data_jie_ix = " + jie_ix + " data_node_ix = " + node_ix + "/>");
	
	$(jdbx_jie_nodes_ref).append(el_to_append);
	
	// append, into the node div, the div for the header and that of the content
	$('#jdbx_node_data_box'+this_el_id).append($("<div class = jdbx_node_head id=jdbx_node_head" + this_el_id + ">"));
	$('#jdbx_node_data_box'+this_el_id).append($("<div class = jdbx_node_content id=jdbx_node_content" + this_el_id + ">"));
	
	// append, into the header div, the div for the control button,
	$('#jdbx_node_head'+this_el_id).append($("<div class = jdbx_node_head_ctr id=jdbx_node_head_ctr" + this_el_id + ">"))
	// append, into the header div, the div for the header text (title). Add custom attribute to control its edition 
	$('#jdbx_node_head'+this_el_id).append($("<div class = jdbx_node_head_content id=jdbx_node_head_content" + this_el_id + " data_edit_f=0>"))
	// append, into the header div, and the div for the edit button
	$('#jdbx_node_head'+this_el_id).append($("<div class = jdbx_node_head_edit id=jdbx_node_head_edit" + this_el_id + ">"))
	
	// append, into the div for the header title, a paragraph with the node title
	$('#jdbx_node_head_content'+this_el_id).append($("<p class = jdbx_node_head_content_p " +
			"id=jdbx_node_head_content_p" + this_el_id + ">" + node.title + "</p>"));
			
	// assign the action of replacing the paragraph in the node header content with a text area to edit it
	// and change the edit button into a check button
	$("#jdbx_node_head_edit"+this_el_id).click(function () {
		
		var edit_f = $('#jdbx_node_head_content'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jdbx_node_head_content_p'+this_el_id).replaceWith("<textarea class = jdbx_node_head_content_e " +
					"id = jdbx_node_head_content_e" + this_el_id + ">" + $("#jdbx_node_head_content_p" + this_el_id).text() + "</textarea>");
			$('#jdbx_node_head_edit'+this_el_id).css('background','green');
			$('#jdbx_node_head_content'+this_el_id).attr('data_edit_f','1');
		} else {
			var this_jie_ix = $("#jdbx_node_data_box" + this_el_id).attr('data_jie_ix');
			var this_node_ix = $("#jdbx_node_data_box" + this_el_id).attr('data_node_ix');
			var new_title = $("#jdbx_node_head_content_e" + this_el_id).val();
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].nodes[this_node_ix].title = new_title;
			
			// update paragraph with the jie title
            $('#jdbx_node_head_content_e'+this_el_id).replaceWith("<p class = jdbx_node_head_content_p " +
                    "id = jdbx_node_head_content_p" + this_el_id + ">" + new_title + "</p>");
            $('#jdbx_node_head_edit'+this_el_id).css('background','gray');
            $('#jdbx_node_head_content'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	// append, into the div for node content, a div with a description of the node (still TBD what a "description" is)
	$('#jdbx_node_content'+this_el_id).append($("<div class = jdbx_node_desc id=jdbx_node_desc" + this_el_id  + " data_edit_f=0>"))
	$('#jdbx_node_content'+this_el_id).append($("<div class = jdbx_node_desc_edit id=jdbx_node_desc_edit" + this_el_id + ">"))
	
	// add a paragraph with a description of the node to the description div
	$('#jdbx_node_desc'+this_el_id).append($("<p class = jdbx_node_desc_p " +
			"id=jdbx_node_desc_p" + this_el_id + ">" + node.desc + "</p>"));

	
	// assign the action of replacing the paragraph in the node description content with a text area to edit it
	// and change the edit button into a check button
	$("#jdbx_node_desc_edit"+this_el_id).click(function () {

		var edit_f = $('#jdbx_node_desc'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jdbx_node_desc_p'+this_el_id).replaceWith("<textarea class = jdbx_node_desc_e " +
					"id = jdbx_node_desc_e" + this_el_id + ">" + $("#jdbx_node_desc_p" + this_el_id).text() + "</textarea>");
			$('#jdbx_node_desc_edit'+this_el_id).css('background','green');
			$('#jdbx_node_desc'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#jdbx_node_data_box" + this_el_id).attr('data_jie_ix');
			var this_node_ix = $("#jdbx_node_data_box" + this_el_id).attr('data_node_ix');
			var new_desc = $("#jdbx_node_desc_e" + this_el_id).val() ;
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].nodes[this_node_ix].desc = new_desc;
			
			// update paragraph with the node desc
            $('#jdbx_node_desc_e'+this_el_id).replaceWith("<p class = jdbx_node_desc_p " +
					"id = jdbx_node_desc_p" + this_el_id + ">" + new_desc + "</p>");
            $('#jdbx_node_desc_edit'+this_el_id).css('background','gray');
            $('#jdbx_node_desc'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	// assign the action of toggling node content div to the control button in the header
	$("#jdbx_node_head_ctr"+this_el_id).click(function () {
			$('#jdbx_node_content'+this_el_id).slideToggle('show');
	});
	
	if(expanded == 1) {
		$('#jdbx_node_content'+this_el_id).slideToggle('show');
	}
	
	// append the div in which the url_data_box will be added
	$('#jdbx_node_content'+this_el_id).append($("<div class = jdbx_node_urls id=jdbx_node_urls" + this_el_id + ">"))
	
	// append all urls
	this.jd_append_urls(jie_ix,node_ix,expanded);
	
	// append the "new url" division
	$('#jdbx_node_content'+this_el_id).append($("<div class = jdbx_new_url_box id=jdbx_new_url_box" + this_el_id + 
			" data_jie_ix=" + jie_ix + " data_node_ix=" + node_ix + ">"));
	
	$('#jdbx_new_url_box'+this_el_id).append($("<p class = jdbx_new_url_box_text_content_p " +
			"id = jdbx_new_url_box_text_content_p" + this_el_id + ">add new url</p>"));
	
	// assign the action of adding a node when clicking on the new node button
	$('#jdbx_new_url_box'+this_el_id).click(function () {
		
		var data_jie_ix = $(this).attr('data_jie_ix');
		var data_node_ix = $(this).attr('data_node_ix');
				
		var url_id = WJ_GLOBAL_jie_map.get_new_url_id();
		
		var new_url = new UrlObj(url_id);
		
		// add node to the jie map
		var url_ix = WJ_GLOBAL_jie_map.add_url(new_url,data_jie_ix,data_node_ix);

		WJ_GLOBAL_jie_map.layout_force();
		WJ_GLOBAL_jie_map.draw();
		
	});
	

};

Wj_Jie_Map.prototype.jd_append_urls = function(jie_ix,node_ix,expanded) {
	
	var jie = this.jie_list[jie_ix];
	var node = jie.nodes[node_ix];
	
	for (var url_ix in node.urls) {
		// append each url
		this.jd_append_url(jie_ix,node_ix,url_ix,expanded);
	}
}

Wj_Jie_Map.prototype.jd_append_url = function(jie_ix,node_ix,url_ix,expanded) {
	
	expanded = expanded || 0;
	
	var jie = this.jie_list[jie_ix];
	var node = jie.nodes[node_ix];
	var url = node.urls[url_ix];

	var this_el_id = jie_ix + "_" + node_ix + "_" + url_ix;
	
	// nodes container id is standard, see jd_append_jie
	jdbx_node_urls_ref = "#jdbx_node_urls"+jie_ix+"_"+node_ix;

	var el_to_append = $("<div class = jdbx_url_data_box id=jdbx_url_data_box" + this_el_id + 
			" data_jie_ix = " + jie_ix + " data_node_ix = " + node_ix + " data_url_ix = " + url_ix + "/>");
	
	$(jdbx_node_urls_ref).append(el_to_append);

	// append, into the url div, the div for the header and that of the content
	$('#jdbx_url_data_box'+this_el_id).append($("<div class = jdbx_url_head id=jdbx_url_head" + this_el_id + ">"));
	$('#jdbx_url_data_box'+this_el_id).append($("<div class = jdbx_url_content id=jdbx_url_content" + this_el_id + ">"));
	
	// append, into the header div, the div for the control button,
	$('#jdbx_url_head'+this_el_id).append($("<div class = jdbx_url_head_ctr id=jdbx_url_head_ctr" + this_el_id + ">"))
	// append, into the header div, the div for the header text (title). Add custom attribute to control its edition 
	$('#jdbx_url_head'+this_el_id).append($("<div class = jdbx_url_head_content id=jdbx_url_head_content" + this_el_id + " data_edit_f=0>"))
	// append, into the header div, and the div for the edit button
	$('#jdbx_url_head'+this_el_id).append($("<div class = jdbx_url_head_edit id=jdbx_url_head_edit" + this_el_id + ">"))
	
	
	// append, into the div for the header title, a paragraph with the url title
	$('#jdbx_url_head_content'+this_el_id).append($("<a href = " + url.url + " target='_blank' " + 
			" class = jdbx_url_head_content_href " + "id=jdbx_url_head_content_href" + this_el_id + ">" + url.title + "</a>"));
	
			
	// assign the action of replacing the paragraph in the url header content with a text area to edit it
	// and change the edit button into a check button
	$("#jdbx_url_head_edit"+this_el_id).click(function () {
		
		var edit_f = $('#jdbx_url_head_content'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jdbx_url_head_content_href'+this_el_id).replaceWith("<textarea class = jdbx_url_head_content_e " +
					"id = jdbx_url_head_content_e" + this_el_id + ">" + $("#jdbx_url_head_content_href" + this_el_id).attr('href') + "</textarea>");
			$('#jdbx_url_head_edit'+this_el_id).css('background','green');
			$('#jdbx_url_head_content'+this_el_id).attr('data_edit_f','1');
		} else {
			var this_jie_ix = $("#jdbx_url_data_box" + this_el_id).attr('data_jie_ix');
			var this_node_ix = $("#jdbx_url_data_box" + this_el_id).attr('data_node_ix');
			var this_url_ix = $("#jdbx_url_data_box" + this_el_id).attr('data_url_ix');
			
			var new_href = $("#jdbx_url_head_content_e" + this_el_id).val();
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].nodes[this_node_ix].urls[this_url_ix].url = new_href;
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].nodes[this_node_ix].urls[this_url_ix].title = new_href;
			
			// update paragraph with the url
            $('#jdbx_url_head_content_e'+this_el_id).replaceWith($("<a href = " + new_href + " target='_blank' " + 
        			" class = jdbx_url_head_content_href " + "id=jdbx_url_head_content_href" + this_el_id + ">" + url.title + "</a>"));
            $('#jdbx_url_head_edit'+this_el_id).css('background','gray');
            $('#jdbx_url_head_content'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	
	// append, into the div for node content, a div with a description of the url (still TBD what a "description" is)
	$('#jdbx_url_content'+this_el_id).append($("<div class = jdbx_url_desc id=jdbx_url_desc" + this_el_id  + " data_edit_f=0>"))
	$('#jdbx_url_content'+this_el_id).append($("<div class = jdbx_url_desc_edit id=jdbx_url_desc_edit" + this_el_id + ">"))
	
	// add a paragraph with a description of the url to the description div
	$('#jdbx_url_desc'+this_el_id).append($("<p class = jdbx_url_desc_p " +
			"id=jdbx_url_desc_p" + this_el_id + ">" + url.desc + "</p>"));
	
	
	// assign the action of replacing the paragraph in the url description content with a text area to edit it
	// and change the edit button into a check button
	$("#jdbx_url_desc_edit"+this_el_id).click(function () {

		var edit_f = $('#jdbx_url_desc'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jdbx_url_desc_p'+this_el_id).replaceWith("<textarea class = jdbx_url_desc_e " +
					"id = jdbx_url_desc_e" + this_el_id + ">" + $("#jdbx_url_desc_p" + this_el_id).text() + "</textarea>");
			$('#jdbx_url_desc_edit'+this_el_id).css('background','green');
			$('#jdbx_url_desc'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#jdbx_url_data_box" + this_el_id).attr('data_jie_ix');
			var this_node_ix = $("#jdbx_node_data_box" + this_el_id).attr('data_node_ix');
			var this_url_ix = $("#jdbx_url_data_box" + this_el_id).attr('data_url_ix');
			
			var new_desc = $("#jdbx_url_desc_e" + this_el_id).val() ;
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].nodes[node_ix].urls[this_url_ix].desc = new_desc;
			
			// update paragraph with the url desc
            $('#jdbx_url_desc_e'+this_el_id).replaceWith("<p class = jdbx_url_desc_p " +
					"id = jdbx_url_desc_p" + this_el_id + ">" + new_desc + "</p>");
            $('#jdbx_url_desc_edit'+this_el_id).css('background','gray');
            $('#jdbx_url_desc'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	
	// assign the action of toggling url content div to the control button in the header
	$("#jdbx_url_head_ctr"+this_el_id).click(function () {
		$('#jdbx_url_content'+this_el_id).slideToggle('show');
	});
	
	if(expanded == 1) {
		$('#jdbx_url_content'+this_el_id).slideToggle('show');
	}
	
};

// development helpers only 
Wj_Jie_Map.prototype.print_jie_list = function () {
    
	var jies_and_nodes = new Array();
	
	for(var ix_jie in this.jie_list) {
		var this_jie = this.jie_list[ix_jie];
		for(var ix_node = 0; ix_node < this_jie.nodes.length; ix_node++) {
			var this_node = this_jie.nodes[ix_node];
			var this_pair = [this_jie.id,this_node.id]
			jies_and_nodes.push(this_pair);
		}
	}
	
	for(var ix_el in jies_and_nodes) {
		console.log(jies_and_nodes[ix_el]);
	}
};






