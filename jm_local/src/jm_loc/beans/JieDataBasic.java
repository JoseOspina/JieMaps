package jm_loc.beans;

import java.util.*;

public class JieDataBasic
{
	private Integer id;
	private List<NodeDataBasic> nodes;
	private String title;
	private String desc;
	
	public JieDataBasic(String title, String desc, List<NodeDataBasic> nodes, int id) {
		this.id = id;
		this.title = title;
		this.desc = desc;
		this.nodes = nodes;
	}
		
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer idIn) {
		this.id = idIn;
	}
	
	public List<NodeDataBasic> getNodes() {
		return nodes;
	}
	
	public void setNodes(ArrayList<NodeDataBasic> nodesIn) {
		this.nodes = nodesIn;
	}
	
	public NodeDataBasic getOneNode(Integer i) {
		return nodes.get(i);
	}
	
	public void setOneNode(NodeDataBasic nodeIn,Integer i) {
		this.nodes.add(i,nodeIn);	
	}

	public void appendOneNode(NodeDataBasic nodeIn) {
		nodes.add(nodeIn);	
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String titleIn) {
		this.title = titleIn;
	}

	public NodeDataBasic getUrlNode(UrlDataBasic url) {
		for(NodeDataBasic node : this.nodes) {
			if(node.getUrls().contains(url)) {
				return node; 
			}
		}
		return null;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}
}

