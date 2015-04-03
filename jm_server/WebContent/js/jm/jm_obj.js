function UrlObj(id, url) {
	// Standard elements
	this.id =  id || -1;
	this.title =  url || 'Jiemaps';
	this.url =  url || 'http://www.jiemaps.com';
	this.desc = "url description";
};

function BaoRaph(center,links,urls) {
	this.center = center || null;
	this.links = links || null;
	this.urls = urls || null;
};

function BaoGraph(pos, move_f) {
	this.pos = pos || [0,0];
	this.move_f = move_f || 1;
	this.injies = null;
};

function BaoObj(id, title, desc, urls, url_id) {
	// Standard elements
	this.id = id || -1;
	this.title = title || 'bao name'
	this.urls = urls || new Array(new UrlObj(url_id));
	this.desc = desc || "bao description";

	// Graph elements
	var pos = pos || [0,0];
	var move_f = move_f || 1;
	
	this.graph = new BaoGraph(pos,move_f);
	
	// Raphael elements
	this.raph = new BaoRaph();
};

function jie_JieMapData(show_f) {
	this.show_f = show_f || true;
};

function JieObj(id, title, desc, baos, bao_id) {
	// Standard elements
	var bao_id = bao_id || -1;	
	
	this.id = id || -1;
	this.title = title || 'jie name';
	this.baos = baos || new Array(new BaoObj(bao_id));
	this.desc = desc || "jie description";
	
	// Additional data needed for JieMap manipulation
	this.map_data = new jie_JieMapData(true);
	
	// Raphael elements
	this.raph = null;
};

function JieObjBasic(id, title, desc, baos) {
	// Standard elements
	this.id = id || -1;
	this.title = title || '';
	this.desc =  desc || '';
	this.baos = baos || new Array(new BaoObjBasic());
};

function BaoObjBasic(id, title, desc, urls) {
	// Standard elements
	this.id =  id || -1;
	this.title =  title || '';
	this.desc =  desc || '';
	this.urls =  urls || new Array(new UrlObjBasic());
};

function UrlObjBasic(id, url) {
	// Standard elements
	this.id =  id || -1;
	this.url =  url || 'http://www.jiemaps.com';
};