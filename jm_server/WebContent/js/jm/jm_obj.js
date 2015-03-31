function UrlObj(id, url) {
	// Standard elements
	this.id =  id || -1;
	this.title =  url || 'Jiemaps';
	this.url =  url || 'http://www.jiemaps.com';
	this.desc = "url description";
};



function NodeRaph(center,links,urls) {
	this.center = center || null;
	this.links = links || null;
	this.urls = urls || null;
};

function NodeGraph(pos, move_f) {
	this.pos = pos || [0,0];
	this.move_f = move_f || 1;
};

function NodeObj(id, title, desc, urls, url_id) {
	// Standard elements
	this.id = id || -1;
	this.title = title || 'node name'
	this.urls = urls || new Array(new UrlObj(url_id));
	this.desc = desc || "node description";

	// Graph elements
	var pos = pos || [0,0];
	var move_f = move_f || 1;
	
	this.graph = new NodeGraph(pos,move_f);
	
	// Raphael elements
	this.raph = new NodeRaph();
};

function JieObj(id, title, desc, nodes, node_id) {
	// Standard elements
	node_id = node_id || -1;	
	this.id = id || -1;
	this.title = title || 'jie name';
	this.nodes = nodes || new Array(new NodeObj(node_id));
	this.desc = desc || "jie description with #thetag and #othertag";
	
	// Raphael elements
	this.raph = null;
};

function JieObjBasic(id, title, desc, nodes) {
	// Standard elements
	this.id = id || -1;
	this.title = title || '';
	this.desc =  desc || '';
	this.nodes = nodes || new Array(new NodeObjBasic());
};

function NodeObjBasic(id, title, desc, urls) {
	// Standard elements
	this.id =  id || -1;
	this.title =  title || '';
	this.desc =  desc || '';
	this.urls =  urls || new Array(new UrlObjBasic());
};

function UrlObjBasic(id, url) {
	// Standard elements
	this.id =  id || -1;
	this.url =  url || 'http://www.webjies.com';
};