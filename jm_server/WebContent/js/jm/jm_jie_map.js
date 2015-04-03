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
	
	// bao style
	this.bao_radius = 10*this.init_scale; // the radius of the central circle of a bao
	this.bao_line_thk = 0*this.init_scale; // the thickness of the border of the bao

	this.jie_name_indent = this.init_scale*10;
	this.jie_name_dist = this.init_scale*20;
	this.title_fontsize = this.init_scale*12;
	
	// vertices style
	this.vert_thk = 16*this.init_scale; // the thickness of the vertices among baos
	this.vert_color_count = 0; // a counter to plot the vertices of each new jie
	this.vert_color_list = this.vert_color_list = Please.make_color({	colors_returned:50,
																		seed:"111",
																		full_random:true,
																		minval:0.3,
																		maxval:0.7});
	
	// urls style
	this.url_ang0 = wj_deg2rad(-15); // the inital rotation of the branches
	this.url_radius = 6*this.init_scale; // url radius
	this.url_dist = 12*this.init_scale; // url distance to bao center
	this.url_link_thk = 6; // the distance from the center of the bao to the
	
	this.url_color_lightness = 0.3;
	this.url_border_darkness = 0.15;
	this.bao_color_darkness = 0.3;
	
	// JieDataBox Style
	this.jd_opacity = 0.8;
	
	// Jie Map components
	this.jie_list = null; // store a complete jie list with all the jies currently in the map
	this.new_jies_ixs = new Array(); // store a list of the ixs of the jies in the jie_list that are new
	this.jie_graph = new Wj_Jie_Graph(this.init_scale); // store the jie_graph object used to layout the jies in the map
	this.panZoom = null; // this object allows for panZoom features
	
	// variables to help interacting with different objects
	this.jie_ix_sel = 0;
	this.bao_ix_sel = 0;
	this.url_ix_sel = 0;
	this.n_new_jies = 0;
	this.n_new_baos = 0;
	this.n_new_urls = 0;
	
	// jie creation
	this.temp_bao = null;
	this.my_jie_list = null;
	
	this.init();
};


//===================================
//Jie Map Initialization Methods
//===================================

Wj_Jie_Map.prototype.init = function () {
	this.init_paper();
};

Wj_Jie_Map.prototype.clear = function () {
	this.jie_list = null;
	this.new_jies_ixs = new Array();
	this.jie_graph = new Wj_Jie_Graph(this.init_scale);
	
	this.jd_empty();
	
	this.clean_paper();
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

Wj_Jie_Map.prototype.add_jie = function(jie,map_options,jd_options) {
	
	var jie_ix = 0;
	
	jd_options = jd_options || {pos:0, expand_f:false, edit_on_f:false};
	map_options = map_options || {layout_force_f:false, draw_f:false}
	
	if(this.jie_list) {
		// update the jie list
		this.jie_list.push(jie);
		// jie ix is the length as it was added at the end
		jie_ix = this.jie_list.length - 1;
		
		// update the jie graph graph
		this.jie_graph.add_baos_and_links_from_jie(jie);

		if(map_options.layout_force_f) {
			this.layout_force_f();
		}
		
		if(map_options.draw_f) {
			this.draw();
		}
		
		// update the jie data
		this.jd_append_jie(jie_ix,jd_options);
		
	} else {
		// if empty, create empty array and add the jie
		this.jie_list = new Array();
		jie_ix = this.add_jie(jie);
	}
	
	return jie_ix;
};

Wj_Jie_Map.prototype.remove_jie = function(jie_ix,map_options) {
	
	// Jie is not deleted, but its not shown in the map 
	// nor in the Jie Data Box
	
	map_options = map_options || {layout_force_f:false,draw_f:false}
	
	if(this.jie_list) {
		// do not show this jie in the map and redraw
		this.jie_list[jie_ix].map_data.show_f = false;
		
		// hide data from Jie Data box
		this.jd_remove_jie(jie_ix);
		
		if(map_options.layout_force_f) {
			this.layout_force_f();
		}
		
		if(map_options.draw_f) {
			this.draw();
		}
	}
};

Wj_Jie_Map.prototype.add_bao = function(bao,jie_ix,map_options,jd_options) {
	
	var link_to = new Array();
	var bao_ix = '';
	
	map_options = map_options || {layout_force_f:false, draw_f:false}
	jd_options = jd_options || {pos:0, expand_f:false, edit_on_f:false};
	
	// if jie list 
	if(this.jie_list) {
		// if jie at index exist
		if(this.jie_list[jie_ix]) {
			// if baos array exist
			if(this.jie_list[jie_ix].baos) {
				// link to the current last bao on this jie
				last_bao_ix = this.jie_list[jie_ix].baos.length - 1;
				link_to.push(this.jie_list[jie_ix].baos[last_bao_ix]);
			}							
			
			this.jie_list[jie_ix].baos.push(bao);
			// bao ix is the length as it was added at the end
			bao_ix = this.jie_list[jie_ix].baos.length-1;
			
			// add the bao to the jie_graph
			this.jie_graph.add_bao(bao,link_to);
			
			if(map_options.layout_force_f) {
				this.layout_force();
			}
			
			if(map_options.draw_f) {
				this.draw();
			}
			
			// add bao to jie data box
			this.jd_append_bao(jie_ix,bao_ix,jd_options) ;
			
		} else {
			// index in jie list does not exist, do nothing
		}
	} else {
		// if jie list does not exist, do nothing
	}
	
	return bao_ix;
};

Wj_Jie_Map.prototype.remove_bao_of_jie = function(jie_ix,bao_ix,map_options) {
	
	map_options = map_options || {layout_force_f:false,draw_f:false}
		
	// do not show this jie in the map and redraw
	if(this.jie_list[jie_ix].baos.length > 1) {
		this.jie_list[jie_ix].baos.splice(bao_ix,1);
		
		this.jie_graph.update_baos_and_links_from_jie_list(this.jie_list);
		
		if(map_options.layout_force_f) {
			this.layout_force();
		}
		
		if(map_options.draw_f) {
			this.draw();
		}
		
		// remove bao data box
		this.jd_update_baos(jie_ix);
	}
};

Wj_Jie_Map.prototype.add_url = function(url,jie_ix,bao_ix,map_options,jd_options) {
	
	var url_ix = 0;
	
	jd_options = jd_options || {pos:0, expand_f:false, edit_on_f:false};
	map_options = map_options || {layout_force_f:false, draw_f:false}
	
	if(this.jie_list) {
		if(this.jie_list[jie_ix]) {
			// if jie list and jie at index exist
			if(this.jie_list[jie_ix].baos) {
				this.jie_list[jie_ix].baos[bao_ix].urls.push(url);
				url_ix = this.jie_list[jie_ix].baos[bao_ix].urls.length-1;
				
				if(map_options.layout_force_f) {
					this.layout_force();
				}
				
				if(map_options.draw_f) {
					this.draw();
				}
				
				// add url to jie data box
				this.jd_append_url(jie_ix,bao_ix,url_ix,jd_options);
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

Wj_Jie_Map.prototype.get_new_bao_id = function() {
	var bao_id = 'N' + this.n_new_baos;
	this.n_new_baos = this.n_new_baos + 1;
	
	return bao_id;
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
	this.draw_baos(debug_f);
	this.draw_jie_links();
	this.draw_names();
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

Wj_Jie_Map.prototype.draw_baos = function(debug_f) {
	
	this.update_baricenter();
	this.jie_graph.update_injies(this.jie_list);
	
	for(var ix_bao in this.jie_graph.baos) {
		
		var this_bao = this.jie_graph.baos[ix_bao];
		
		// check in which jies this bao is present to decide if it
		// should be shown and which color
		var injies = this_bao.graph.injies;
		
		var this_colors = new Array();
		var this_show_fs = new Array();
		for(var ix_injie in injies) {
			this_colors.push(this.vert_color_list[injies[ix_injie]]);
			this_show_fs.push(this.jie_list[injies[ix_injie]].map_data.show_f);
		}
		var this_color = this.mix_colors(this_colors);
		
		// if any of the jies containing this node is to be shown, the node is shown
		var show_f = false;
		for(var ix_showfs in this_show_fs) {
			if(this_show_fs[ix_showfs]) {
				show_f = true;
			}				
		}
		
		if(show_f) {
			this.draw_bao(this_bao,this_color,debug_f);
		}
	}
};

Wj_Jie_Map.prototype.update_baricenter = function() {
	
	this.baricenter = [0,0];

	var n_baos = this.jie_graph.get_n_baos();
	
	for(var ix_bao in this.jie_graph.baos) {
		var this_bao = this.jie_graph.baos[ix_bao];
		
		this.baricenter[0] += this_bao.graph.pos[0]/n_baos;
		this.baricenter[1] += this_bao.graph.pos[1]/n_baos;
	}
	
};

Wj_Jie_Map.prototype.draw_bao = function(this_bao,color,debug_f) {
	
	debug_f = debug_f || 0;
	
	var bao_center_map_pos = this.mapcoord_to_paper(this_bao.graph.pos);
	
	this_center_color = this.get_darker_color(color,this.bao_color_darkness);
	this_url_link_color = this_center_color;
	this_url_color = this.get_lighter_color(color,this.url_color_lightness);
	
	var raph_center = this.draw_raph_bao(bao_center_map_pos,this_center_color);
	
	if(debug_f == 1) {
		this.paper.text(bao_center_map_pos[0], bao_center_map_pos[1], this.jie_graph.baos.indexOf(this_bao));
	} else {
		n_urls = this_bao.urls.length;
		var rel_url_pos = new Array(n_urls); // position relative to bao center
		
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
				link_end[0] = bao_center_map_pos[0] + this_url_rel_pos[0];
				link_end[1] = bao_center_map_pos[1] + this_url_rel_pos[1];
				
				raph_url_links[ix_url] = this.draw_line(bao_center_map_pos,link_end,this_url_link_color,this.url_link_thk,0);
				rel_url_pos[ix_url] = this_url_rel_pos;
			}
		}
	
		raph_urls = new Array(n_urls); // array of raphael objects of urls
		
		for(var ix_url = 0; ix_url < n_urls; ix_url++){
			var url_pos = new Array(2);
			url_pos[0] = bao_center_map_pos[0] + rel_url_pos[ix_url][0];
			url_pos[1] = bao_center_map_pos[1] + rel_url_pos[ix_url][1];
			
			raph_urls[ix_url] = this.draw_raph_url(url_pos,this_bao.urls[ix_url],this_url_color);
		}
		
		
		this_bao.raph.center = raph_center;
		this_bao.raph.links = raph_url_links;
		this_bao.raph.urls = raph_urls;
		
		this.bao_toFront(this_bao);
	}
};

Wj_Jie_Map.prototype.bao_toFront = function(bao) {
	urls = bao.raph.urls;
	links = bao.raph.links;
	center = bao.raph.center;

	// the bao links on top of it
	for(var ix_links = 0; ix_links < links.length; ix_links++){
		links[ix_links].toFront();
	}
		
	// the bao center
	center.toFront();
	
	// the urls
	for(var ix_url = 0; ix_url < urls.length; ix_url++){
		urls[ix_url].toFront();
	}

};

Wj_Jie_Map.prototype.draw_raph_bao = function (pos,color) {
	
	var raph_bao = this.paper.circle(pos[0], pos[1], this.bao_radius);

	this_bao_color = color;
	this_bao_line_color = color;
	
    raph_bao.attr('fill', this_bao_color);
    raph_bao.attr('stroke', this_bao_line_color);
    raph_bao.attr('stroke-width', this.bao_line_thk);

    return raph_bao;
};

Wj_Jie_Map.prototype.draw_raph_url = function (pos,url_obj,color) {
    
	var raph_url = this.paper.circle(pos[0], pos[1], this.url_radius);

	var this_url_color = color;
	var this_url_line_color = this.get_darker_color(color,this.url_border_darkness);
	var this_url_hover_color = this_url_line_color;
	
	raph_url.attr('fill', this_url_color);
	raph_url.attr('stroke', this_url_line_color);
	raph_url.attr('stroke-width', this.url_line_thk);

	raph_url.attr('cursor', 'pointer');

    $(raph_url.node).click(function () {
        window.open(url_obj.url);
    });
    
    $(raph_url.node).hover(function () {
    	$(this).attr('fill',this_url_hover_color);
    }, function () {
		$(this).attr('fill',this_url_color);
	});
         
    return raph_url;
};

Wj_Jie_Map.prototype.draw_jie_links = function() {
	
	for(var ix_jie in this.jie_list) {
		var this_jie = this.jie_list[ix_jie];
		if(this_jie.map_data.show_f) {
			for(var ix_bao = 0; ix_bao < this_jie.baos.length - 1; ix_bao++) {
				var this_bao = this_jie.baos[ix_bao];
				var next_bao = this_jie.baos[ix_bao+1];
				var ix_color = ix_jie % this.vert_color_list.length;
				this.draw_line(this.mapcoord_to_paper(this_bao.graph.pos),this.mapcoord_to_paper(next_bao.graph.pos),this.vert_color_list[ix_color],this.vert_thk,1);
			}
		}
	}
};

Wj_Jie_Map.prototype.draw_names = function() {
	
	for(var ix_jie in this.jie_list) {
		var this_jie = this.jie_list[ix_jie];
		if(this_jie.map_data.show_f) {
			this.draw_jie_name(this_jie,this.vert_color_list[ix_jie]);
		}
	}
};

Wj_Jie_Map.prototype.draw_jie_name = function(jie,color) {
	
	var bao0_pos = this.mapcoord_to_paper(jie.baos[0].graph.pos);
	var title = this.paper.text(bao0_pos[0],bao0_pos[1],jie.title);
	var angle_deg = 0;
	
	if(jie.baos.length > 1) {
		// Text is rotated along the first bao position to be aligned towards the 
		// second bao
		var bao1_pos = this.mapcoord_to_paper(jie.baos[1].graph.pos);
		var bao1_relpos = [ bao1_pos[0] - bao0_pos[0], bao1_pos[1] - bao0_pos[1] ];
		angle_deg = Math.atan2(bao1_relpos[1],bao1_relpos[0])*180/Math.PI;
	}
	
	title.transform(["r",angle_deg,"t",this.jie_name_indent,",",this.jie_name_dist]);
	
	title.attr({"font-size": this.title_fontsize});
	title.attr({"fill": color});
	title.attr({'text-anchor':'start'});
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

Wj_Jie_Map.prototype.get_darker_color = function (color,size) {
	var color_HSV = Please.HEX_to_HSV(color);
	color_HSV.v = color_HSV.v*(1-size);
	return Please.HSV_to_HEX(color_HSV);
}

Wj_Jie_Map.prototype.get_lighter_color = function (color,size) {
	var color_HSV = Please.HEX_to_HSV(color);
	color_HSV.v = color_HSV.v + (1-color_HSV.v)*size;
	return Please.HSV_to_HEX(color_HSV);
}

Wj_Jie_Map.prototype.mix_colors = function (colors) {
	
	var hues = new Array();
	var sats = new Array();
	var vals = new Array();
		
	for(ix_color in colors) {
		var color_HSV = Please.HEX_to_HSV(colors[ix_color]);
		
		hues.push(color_HSV.h);
		sats.push(color_HSV.s);
		vals.push(color_HSV.v);
	}
	
	var hue_mean = 0;
	var sat_mean = 0;
	var val_mean = 0;
	
	for(ix_hue in hues) {
		hue_mean += hues[ix_hue]/hues.length;
		sat_mean += sats[ix_hue]/sats.length;
		val_mean += vals[ix_hue]/vals.length;
	}
	
	var color_HSV;
	
	color_HSV.h = hue_mean;
	color_HSV.s = sat_mean;
	color_HSV.v = val_mean;
	
	return Please.HSV_to_HEX(color_HSV);
};

Wj_Jie_Map.prototype.change_alpha = function (e, alpha) { //e = jQuery element, alpha = background-opacity
    b = e.css('backgroundColor');
    e.css('backgroundColor', 'rgba' + b.slice(b.indexOf('('), ( (b.match(/,/g).length == 2) ? -1 : b.lastIndexOf(',') - b.length) ) + ', '+alpha+')');
};

//===================================
// Jie Data Box
//===================================

Wj_Jie_Map.prototype.jd_empty = function() {
	
	$(this.jd_base_div_ref).empty();
};

Wj_Jie_Map.prototype.jd_get_jieboxJQ_from_boxix = function(boxix) {
	
	var childs = $(this.jd_base_div_ref).children();
	return $(childs[boxix]);
}

Wj_Jie_Map.prototype.jd_get_jieboxJQ_from_jieix = function(jieix) {
	
	return $('#jie_data_box'+jieix);
}

Wj_Jie_Map.prototype.jd_get_baoboxJQ_from_jieix_and_baoix = function(jieix,baoix) {
	
	return $('#bao_data_box'+jieix+'_'+baoix);
}

Wj_Jie_Map.prototype.jd_get_urlboxJQ_from_jieix_baoix_and_urlix = function(jieix,baoix,urlix) {
	
	return $('#url_data_box'+jieix+'_'+baoix+'_'+urlix);
}

Wj_Jie_Map.prototype.jd_remove_jie = function(jie_ix) {
	this.jd_get_jieboxJQ_from_jieix(jie_ix).slideUp();
}

Wj_Jie_Map.prototype.jd_append_jie = function(jie_ix,options) {

	options = options || {pos:0, expand_f:0, edit_on_f:false};
	
	expand_f = options.expand_f || false;
	pos = options.pos || 0;
	edit_on_f = options.edit_on_f || false;
	
	var jie = this.jie_list[jie_ix];
	
	var this_el_id = jie_ix;
	
    var el_to_append = $("<div class = jie_data_box id = jie_data_box" + this_el_id + " data_jie_ix = " + jie_ix + "/>");
    
    if (typeof pos !== 'undefined') {
    	if($(this.jd_base_div_ref).children().length > 0) {
    		this.jd_get_jieboxJQ_from_boxix(pos).before(el_to_append);	
    	} else {
    		$(this.jd_base_div_ref).append(el_to_append);
    	}		
	} else {
		$(this.jd_base_div_ref).append(el_to_append);
	}
	
    this_back_color = this.vert_color_list[jie_ix];
    
    $('#jie_data_box'+this_el_id).css("background-color",this.get_lighter_color(this_back_color,this.url_color_lightness));
    this.change_alpha($('#jie_data_box'+this_el_id), this.jd_opacity);
    
	// append, into the jie div, the div for the header and that of the content
	$('#jie_data_box'+this_el_id).append($("<div class = jie_head id=jie_head" + this_el_id + ">"))
	$('#jie_data_box'+this_el_id).append($("<div class = jie_content id=jie_content" + this_el_id + ">"))
	
	// append, into the header div, the div for the control button, 
	$('#jie_head'+this_el_id).append($("<div class = jie_head_ctr id=jie_head_ctr" + this_el_id + ">"))
	// append, into the header div, the div for the header text (title). Add custom attributo to control its edition 
	$('#jie_head'+this_el_id).append($("<div class = jie_head_content id=jie_head_content" + this_el_id + " data_edit_f=0>"))
	// append, into the header div, the div for the delete button
	$('#jie_head'+this_el_id).append($("<div class = jie_head_delete id=jie_head_delete" + this_el_id + ">"))
		// append, into the header div, the div for the edit button
	$('#jie_head'+this_el_id).append($("<div class = jie_head_edit id=jie_head_edit" + this_el_id + ">"))
	// append, into the header div, a dummy div to clear both so that te head div has correct height
	$('#jie_head'+this_el_id).append($("<div class = jie_head_last id=jie_head_last" + this_el_id + ">"))
	
	// append, into the div for the header title, a paragraph with the jie title
	$('#jie_head_content'+this_el_id).append($("<p class = jie_head_content_p " +
			"id = jie_head_content_p" + this_el_id + ">" + jie.title + "</p>"));
	
	// assign the action of replacing the paragraph in the jie header content with a text area to edit it
	// and change the edit button into a check button
	$("#jie_head_edit"+this_el_id).click(function () {
		
		var edit_f = $('#jie_head_content'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jie_head_content_p'+this_el_id).replaceWith("<textarea class = jie_head_content_e " +
					"id = jie_head_content_e" + this_el_id + ">" + $("#jie_head_content_p" + this_el_id).text() + "</textarea>");
			$('#jie_head_edit'+this_el_id).css('background-image','url(icons/check.svg)');
			$('#jie_head_content'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#jie_data_box" + this_el_id).attr('data_jie_ix')
			var new_title = $("#jie_head_content_e" + this_el_id).val();
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].title = new_title;
			
			// update paragraph with the jie title
            $('#jie_head_content_e'+this_el_id).replaceWith("<p class = jie_head_content_p " +
                    "id = jie_head_content_p" + this_el_id + ">" + new_title + "</p>");
            $('#jie_head_edit'+this_el_id).css('background-image','url(icons/brush.svg)');
            $('#jie_head_content'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	// assign the action of deleting the jie from the map
	$("#jie_head_delete"+this_el_id).click(function () {
		
		var this_jie_ix = $("#jie_data_box" + this_el_id).attr('data_jie_ix')
		
		options = {layout_f:false, draw_f:true}
		
		// update the jie list
		WJ_GLOBAL_jie_map.remove_jie(this_jie_ix,options);
		
		// update paragraph with the jie title
        $('#jie_data_box'+this_el_id).slideUp();
 	});
	
	// assign the action of showing/hiding jie contents
	$("#jie_head_ctr"+this_el_id).click(function () {
		var displayed = $('#jie_content'+this_el_id).css('display');
		if(displayed == 'none') {
			$('#jie_head_ctr'+this_el_id).css({'background-image':'url(icons/arrow-down.svg)'});
		} else {
			$('#jie_head_ctr'+this_el_id).css({'background-image':'url(icons/arrow-right.svg)'});
		}
		
		$('#jie_content'+this_el_id).slideToggle('show');
	});
	
	if(expand_f == 1) {
		$('#jie_content'+this_el_id).slideToggle('show');
	}
	
	// append the div in which the bao_data_boxes will be added
	$('#jie_content'+this_el_id).append($("<div class = jie_baos id=jie_baos" + this_el_id + ">"))
	
	// append all baos
	this.jd_append_baos(jie_ix,options);
	
	// append the "new bao" div
	$('#jie_content'+this_el_id).append($("<div class = new_bao_box id=new_bao_box" + this_el_id + 
			" data_jie_ix=" + jie_ix + ">"));
	// append the ctr div to the new bao div
	$('#new_bao_box'+this_el_id).append($("<div class = new_bao_ctr id=new_bao_ctr" + this_el_id + ">"))
	// appen the text to the new bao div
	$('#new_bao_box'+this_el_id).append($("<p class = new_bao_box_text_content_p " +
			"id = new_bao_box_text_content_p" + this_el_id + ">add new bao</p>"));
	
	// assign the action of adding a bao when clicking on the new bao button
	$('#new_bao_box'+this_el_id).click(function () {
		
		var data_jie_ix = $(this).attr('data_jie_ix');
		var bao_id = WJ_GLOBAL_jie_map.get_new_bao_id();
		var new_bao = new BaoObj(bao_id);
		
		jd_options = {edit_on_f:true,expand_f:true};
		map_options = {layout_force_f:true,draw_f:true}
		
		// add bao to the jie map
		var bao_ix = WJ_GLOBAL_jie_map.add_bao(new_bao,data_jie_ix,map_options,jd_options);
	});
	
	// append, into the div for jie content, a div with metadata of the jie (current data is only the description)
	$('#jie_content'+this_el_id).append($("<div class = jie_metadata id=jie_metadata" + this_el_id + ">"))

	// append, into the div for jie metadata, a div with the description of the jie and its edition button
	$('#jie_metadata'+this_el_id).append($("<div class = jie_desc id=jie_desc" + this_el_id + " data_edit_f=0>"))
	$('#jie_metadata'+this_el_id).append($("<div class = jie_desc_edit id=jie_desc_edit" + this_el_id + ">"))
	// append, into the metadata div, a dummy div to clear both so that the metadata div has correct height
	$('#jie_metadata'+this_el_id).append($("<div class = jie_metadata_last id=jie_metadata_last" + this_el_id + ">"))
	
	// add a paragraph with a description of the jie to the description div
	$('#jie_desc'+this_el_id).append($("<p class = jie_desc_p " +
			"id = jie_desc_p" + this_el_id + ">" + jie.desc + "</p>"));

	// assign the action of replacing the paragraph in the jie description content with a text area to edit it
	// and change the edit button into a check button
	$("#jie_desc_edit"+this_el_id).click(function () {

		var edit_f = $('#jie_desc'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#jie_desc_p'+this_el_id).replaceWith("<textarea class = jie_desc_e " +
					"id = jie_desc_e" + this_el_id + ">" + $("#jie_desc_p" + this_el_id).text() + "</textarea>");
			$('#jie_desc_edit'+this_el_id).css('background-image','url(icons/check.svg)');
			$('#jie_desc'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#jie_data_box" + this_el_id).attr('data_jie_ix')
			var new_desc = $("#jie_desc_e" + this_el_id).val() ;
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].desc = new_desc;
			
			// update paragraph with the bao desc
            $('#jie_desc_e'+this_el_id).replaceWith("<p class = jie_desc_p " +
					"id = jie_desc_p" + this_el_id + ">" + new_desc + "</p>");
            $('#jie_desc_edit'+this_el_id).css('background-image','url(icons/brush.svg)');
            $('#jie_desc'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
};

Wj_Jie_Map.prototype.jd_update_baos = function(jie_ix,options) {
	this.jd_remove_baos(jie_ix);
	this.jd_append_baos(jie_ix);
}

Wj_Jie_Map.prototype.jd_remove_baos = function(jie_ix,options) {
	
	var childs = $('#jie_baos'+jie_ix).children();
	
	for (var childix = 0; childix < childs.length; childix++) {
		// append each bao
		$(childs[childix]).remove();
	}
}

Wj_Jie_Map.prototype.jd_append_baos = function(jie_ix,options) {
	
	var jie = this.jie_list[jie_ix];
	
	for (var bao_ix in jie.baos) {
		// append each bao
		this.jd_append_bao(jie_ix,bao_ix,options);
	}
}

Wj_Jie_Map.prototype.jd_append_bao = function(jie_ix,bao_ix,options) {
	
	options = options || {pos:0, expand_f:0, edit_on_f:false};
	
	expand_f = options.expand_f || false;
	pos = options.pos || 0;
	edit_on_f = options.edit_on_f || false;
	
	// adds a bao div with all its urls sub divs to the jie div of the jie_ix specified
	
	var jie = this.jie_list[jie_ix];
	var bao = jie.baos[bao_ix];
		
	var this_el_id = jie_ix + "_" + bao_ix;

	// baos container id is standard
	jie_baos_ref = "#jie_baos"+jie_ix;
	
	// append the div in which this bao data will be added. Store the jie index and the bao index as attributes
	var el_to_append =  $("<div class = bao_data_box id=bao_data_box" + this_el_id + 
			" data_jie_ix = " + jie_ix + " data_bao_ix = " + bao_ix + "/>");
	
	$(jie_baos_ref).append(el_to_append);
	
	// append, into the bao div, the div for the header and that of the content
	$('#bao_data_box'+this_el_id).append($("<div class = bao_head id=bao_head" + this_el_id + ">"));
	$('#bao_data_box'+this_el_id).append($("<div class = bao_content id=bao_content" + this_el_id + ">"));
	
	// append, into the header div, the div for the control button,
	$('#bao_head'+this_el_id).append($("<div class = bao_head_ctr id=bao_head_ctr" + this_el_id + ">"))
	// append, into the header div, the div for the header text (title). Add custom attribute to control its edition 
	$('#bao_head'+this_el_id).append($("<div class = bao_head_content id=bao_head_content" + this_el_id + " data_edit_f=0>"))
	// append, into the header div, and the div for the delete button
	$('#bao_head'+this_el_id).append($("<div class = bao_head_delete id=bao_head_delete" + this_el_id + ">"))
	// append, into the header div, the div for the edit button
	$('#bao_head'+this_el_id).append($("<div class = bao_head_edit id=bao_head_edit" + this_el_id + ">"))
	// append, into the header div, a dummy div to clear both so that te head div has correct height
	$('#bao_head'+this_el_id).append($("<div class = bao_head_last id=bao_head_last" + this_el_id + ">"))
	
	
	// append, into the div for the header title, a paragraph with the bao title
	$('#bao_head_content'+this_el_id).append($("<p class = bao_head_content_p " +
			"id=bao_head_content_p" + this_el_id + ">" + bao.title + "</p>"));
			
	// assign the action of replacing the paragraph in the bao header content with a text area to edit it
	// and change the edit button into a check button
	$("#bao_head_edit"+this_el_id).click(function () {
		
		var edit_f = $('#bao_head_content'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#bao_head_content_p'+this_el_id).replaceWith("<textarea class = bao_head_content_e " +
					"id = bao_head_content_e" + this_el_id + ">" + $("#bao_head_content_p" + this_el_id).text() + "</textarea>");
			$('#bao_head_edit'+this_el_id).css('background-image','url(icons/check.svg)');
			$('#bao_head_content'+this_el_id).attr('data_edit_f','1');
		} else {
			var this_jie_ix = $("#bao_data_box" + this_el_id).attr('data_jie_ix');
			var this_bao_ix = $("#bao_data_box" + this_el_id).attr('data_bao_ix');
			var new_title = $("#bao_head_content_e" + this_el_id).val();
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].baos[this_bao_ix].title = new_title;
			
			// update paragraph with the jie title
            $('#bao_head_content_e'+this_el_id).replaceWith("<p class = bao_head_content_p " +
                    "id = bao_head_content_p" + this_el_id + ">" + new_title + "</p>");
            $('#bao_head_edit'+this_el_id).css('background-image','url(icons/brush.svg)');
            $('#bao_head_content'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	// assign the action of deleting the jie from the map
	$("#bao_head_delete"+this_el_id).click(function () {
		
		var this_jie_ix = $("#bao_data_box" + this_el_id).attr('data_jie_ix')
		var this_bao_ix = $("#bao_data_box" + this_el_id).attr('data_bao_ix');
		
		options = {layout_f:false, draw_f:true}
		
		// update the jie list
		WJ_GLOBAL_jie_map.remove_bao_of_jie(this_jie_ix,this_bao_ix,options);
		
	});
	
	// assign the action of toggling bao content div to the control button in the header
	$("#bao_head_ctr"+this_el_id).click(function () {
		var displayed = $('#bao_content'+this_el_id).css('display');
		if(displayed == 'none') {
			$('#bao_head_ctr'+this_el_id).css({'background-image':'url(icons/arrow-down.svg)'});
		} else {
			$('#bao_head_ctr'+this_el_id).css({'background-image':'url(icons/arrow-right.svg)'});
		}
			
		$('#bao_content'+this_el_id).slideToggle('show');
	});
	
	if(expand_f == 1) {
		$('#bao_content'+this_el_id).slideToggle('show');
	}
	
	// append the div in which the url_data_box will be added
	$('#bao_content'+this_el_id).append($("<div class = bao_urls id=bao_urls" + this_el_id + ">"))
	
	// append all urls
	this.jd_append_urls(jie_ix,bao_ix,options);
	
	// append the "new url" division
	$('#bao_content'+this_el_id).append($("<div class = new_url_box id=new_url_box" + this_el_id + 
			" data_jie_ix=" + jie_ix + " data_bao_ix=" + bao_ix + ">"));
	// append the ctr div to the new bao div
	$('#new_url_box'+this_el_id).append($("<div class = new_url_ctr id=new_url_ctr" + this_el_id + ">"))
	// appen the text to the new bao div
	$('#new_url_box'+this_el_id).append($("<p class = new_url_box_text_content_p " +
			"id = new_url_box_text_content_p" + this_el_id + ">add new url</p>"));
	
	// assign the action of adding a bao when clicking on the new bao button
	$('#new_url_box'+this_el_id).click(function () {
		
		var data_jie_ix = $(this).attr('data_jie_ix');
		var data_bao_ix = $(this).attr('data_bao_ix');
				
		var url_id = WJ_GLOBAL_jie_map.get_new_url_id();
		
		var new_url = new UrlObj(url_id);
		
		jd_options = {edit_on_f:true,expand_f:true};
		map_options = {layout_force_f:false,draw_f:true}
		
		// add bao to the jie map
		var url_ix = WJ_GLOBAL_jie_map.add_url(new_url,data_jie_ix,data_bao_ix,map_options,jd_options);
		
	});
	
	// append, into the div for bao content, a div with metadata of the bao (current data is only the description)
	$('#bao_content'+this_el_id).append($("<div class = bao_metadata id=bao_metadata" + this_el_id + ">"))

	// append, into the div for bao content, a div with a description of the bao (still TBD what a "description" is)
	$('#bao_metadata'+this_el_id).append($("<div class = bao_desc id=bao_desc" + this_el_id  + " data_edit_f=0>"))
	$('#bao_metadata'+this_el_id).append($("<div class = bao_desc_edit id=bao_desc_edit" + this_el_id + ">"))
	// append, into the metadata div, a dummy div to clear both so that the metadata div has correct height
	$('#bao_metadata'+this_el_id).append($("<div class = bao_metadata_last id=bao_metadata_last" + this_el_id + ">"))
	
	
	// add a paragraph with a description of the bao to the description div
	$('#bao_desc'+this_el_id).append($("<p class = bao_desc_p " +
			"id=bao_desc_p" + this_el_id + ">" + bao.desc + "</p>"));

	
	// assign the action of replacing the paragraph in the bao description content with a text area to edit it
	// and change the edit button into a check button
	$("#bao_desc_edit"+this_el_id).click(function () {

		var edit_f = $('#bao_desc'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#bao_desc_p'+this_el_id).replaceWith("<textarea class = bao_desc_e " +
					"id = bao_desc_e" + this_el_id + ">" + $("#bao_desc_p" + this_el_id).text() + "</textarea>");
			$('#bao_desc_edit'+this_el_id).css('background-image','url(icons/check.svg)');
			$('#bao_desc'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#bao_data_box" + this_el_id).attr('data_jie_ix');
			var this_bao_ix = $("#bao_data_box" + this_el_id).attr('data_bao_ix');
			var new_desc = $("#bao_desc_e" + this_el_id).val() ;
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].baos[this_bao_ix].desc = new_desc;
			
			// update paragraph with the bao desc
            $('#bao_desc_e'+this_el_id).replaceWith("<p class = bao_desc_p " +
					"id = bao_desc_p" + this_el_id + ">" + new_desc + "</p>");
            $('#bao_desc_edit'+this_el_id).css('background-image','url(icons/brush.svg)');
            $('#bao_desc'+this_el_id).attr('data_edit_f','0')
		}
			
	});

};

Wj_Jie_Map.prototype.jd_append_urls = function(jie_ix,bao_ix,options) {
	
	var jie = this.jie_list[jie_ix];
	var bao = jie.baos[bao_ix];
	
	for (var url_ix in bao.urls) {
		// append each url
		this.jd_append_url(jie_ix,bao_ix,url_ix,options);
	}
}

Wj_Jie_Map.prototype.jd_append_url = function(jie_ix,bao_ix,url_ix,options) {
	
	options = options || {pos:0, expand_f:0, edit_on_f:false};
	
	expand_f = options.expand_f || false;
	pos = options.pos || 0;
	edit_on_f = options.edit_on_f || false;
		
	var jie = this.jie_list[jie_ix];
	var bao = jie.baos[bao_ix];
	var url = bao.urls[url_ix];

	var this_el_id = jie_ix + "_" + bao_ix + "_" + url_ix;
	
	// baos container id is standard
	bao_urls_ref = "#bao_urls"+jie_ix+"_"+bao_ix;

	var el_to_append = $("<div class = url_data_box id=url_data_box" + this_el_id + 
			" data_jie_ix = " + jie_ix + " data_bao_ix = " + bao_ix + " data_url_ix = " + url_ix + "/>");
	
	$(bao_urls_ref).append(el_to_append);

	// append, into the url div, the div for the header and that of the content
	$('#url_data_box'+this_el_id).append($("<div class = url_head id=url_head" + this_el_id + ">"));
	$('#url_data_box'+this_el_id).append($("<div class = url_content id=url_content" + this_el_id + ">"));
	
	// append, into the header div, the div for the control button,
	$('#url_head'+this_el_id).append($("<div class = url_head_ctr id=url_head_ctr" + this_el_id + ">"))
	// append, into the header div, the div for the header text (title). Add custom attribute to control its edition 
	$('#url_head'+this_el_id).append($("<div class = url_head_content id=url_head_content" + this_el_id + " data_edit_f=0>"))
	// append, into the header div, and the div for the edit button
	$('#url_head'+this_el_id).append($("<div class = url_head_edit id=url_head_edit" + this_el_id + ">"))
	// append, into the header div, a dummy div to clear both so that te head div has correct height
	$('#url_head'+this_el_id).append($("<div class = url_head_last id=url_head_last" + this_el_id + ">"))
	
	
	// append, into the div for the header title, a paragraph with the url title
	$('#url_head_content'+this_el_id).append($("<a href = " + url.url + " target='_blank' " + 
			" class = url_head_content_href " + "id=url_head_content_href" + this_el_id + ">" + url.title + "</a>"));
	
			
	// assign the action of replacing the paragraph in the url header content with a text area to edit it
	// and change the edit button into a check button
	$("#url_head_edit"+this_el_id).click(function () {
		
		var edit_f = $('#url_head_content'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#url_head_content_href'+this_el_id).replaceWith("<textarea class = url_head_content_e " +
					"id = url_head_content_e" + this_el_id + ">" + $("#url_head_content_href" + this_el_id).attr('href') + "</textarea>");
			$('#url_head_edit'+this_el_id).css('background-image','url(icons/check.svg)');
			$('#url_head_content'+this_el_id).attr('data_edit_f','1');
		} else {
			var this_jie_ix = $("#url_data_box" + this_el_id).attr('data_jie_ix');
			var this_bao_ix = $("#url_data_box" + this_el_id).attr('data_bao_ix');
			var this_url_ix = $("#url_data_box" + this_el_id).attr('data_url_ix');
			
			var new_href = $("#url_head_content_e" + this_el_id).val();
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].baos[this_bao_ix].urls[this_url_ix].url = new_href;
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].baos[this_bao_ix].urls[this_url_ix].title = new_href;
			
			// update paragraph with the url
            $('#url_head_content_e'+this_el_id).replaceWith($("<a href = " + new_href + " target='_blank' " + 
        			" class = url_head_content_href " + "id=url_head_content_href" + this_el_id + ">" + url.title + "</a>"));
            $('#url_head_edit'+this_el_id).css('background-image','url(icons/brush.svg)');
            $('#url_head_content'+this_el_id).attr('data_edit_f','0')
		}
			
	});

	if(edit_on_f) {
		$("#url_head_edit"+this_el_id).trigger('click');
	}	
	
	// append, into the div for url content, a div with metadata of the url (current data is only the description)
	$('#url_content'+this_el_id).append($("<div class = url_metadata id=url_metadata" + this_el_id + ">"))

	
	// append, into the div for url content, a div with a description of the url
	$('#url_metadata'+this_el_id).append($("<div class = url_desc id=url_desc" + this_el_id  + " data_edit_f=0>"))
	$('#url_metadata'+this_el_id).append($("<div class = url_desc_edit id=url_desc_edit" + this_el_id + ">"))
	// append, into the metadata div, a dummy div to clear both so that the metadata div has correct height
	$('#url_metadata'+this_el_id).append($("<div class = url_metadata_last id=url_metadata_last" + this_el_id + ">"))
	
	// add a paragraph with a description of the url to the description div
	$('#url_desc'+this_el_id).append($("<p class = url_desc_p " +
			"id=url_desc_p" + this_el_id + ">" + url.desc + "</p>"));
	
	
	// assign the action of replacing the paragraph in the url description content with a text area to edit it
	// and change the edit button into a check button
	$("#url_desc_edit"+this_el_id).click(function () {

		var edit_f = $('#url_desc'+this_el_id).attr('data_edit_f')
		
		if(edit_f == '0') {
			$('#url_desc_p'+this_el_id).replaceWith("<textarea class = url_desc_e " +
					"id = url_desc_e" + this_el_id + ">" + $("#url_desc_p" + this_el_id).text() + "</textarea>");
			$('#url_desc_edit'+this_el_id).css('background-image','url(icons/check.svg)');
			$('#url_desc'+this_el_id).attr('data_edit_f','1')
		} else {
			var this_jie_ix = $("#url_data_box" + this_el_id).attr('data_jie_ix');
			var this_bao_ix = $("#bao_data_box" + this_el_id).attr('data_bao_ix');
			var this_url_ix = $("#url_data_box" + this_el_id).attr('data_url_ix');
			
			var new_desc = $("#url_desc_e" + this_el_id).val() ;
			
			// update the jie list
			WJ_GLOBAL_jie_map.jie_list[this_jie_ix].baos[bao_ix].urls[this_url_ix].desc = new_desc;
			
			// update paragraph with the url desc
            $('#url_desc_e'+this_el_id).replaceWith("<p class = url_desc_p " +
					"id = url_desc_p" + this_el_id + ">" + new_desc + "</p>");
            $('#url_desc_edit'+this_el_id).css('background-image','url(icons/brush.svg)');
            $('#url_desc'+this_el_id).attr('data_edit_f','0')
		}
			
	});
	
	
	// assign the action of toggling url content div to the control button in the header
	$("#url_head_ctr"+this_el_id).click(function () {
		var displayed = $('#url_content'+this_el_id).css('display');
		if(displayed == 'none') {
			$('#url_head_ctr'+this_el_id).css({'background-image':'url(icons/arrow-down.svg)'});
		} else {
			$('#url_head_ctr'+this_el_id).css({'background-image':'url(icons/arrow-right.svg)'});
		}
		
		$('#url_content'+this_el_id).slideToggle('show');
	});
	
	if(expand_f == 1) {
		$('#url_content'+this_el_id).slideToggle('show');
	}
	
};

// development helpers only 
Wj_Jie_Map.prototype.print_jie_list = function () {
    
	var jies_and_baos = new Array();
	
	for(var ix_jie in this.jie_list) {
		var this_jie = this.jie_list[ix_jie];
		for(var ix_bao = 0; ix_bao < this_jie.baos.length; ix_bao++) {
			var this_bao = this_jie.baos[ix_bao];
			var this_pair = [this_jie.id,this_bao.id]
			jies_and_baos.push(this_pair);
		}
	}
	
	for(var ix_el in jies_and_baos) {
		console.log(jies_and_baos[ix_el]);
	}
};






