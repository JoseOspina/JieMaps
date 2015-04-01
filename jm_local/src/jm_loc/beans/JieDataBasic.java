package jm_loc.beans;

import java.util.*;

public class JieDataBasic
{
	private Integer id;
	private List<BaoDataBasic> baos;
	private String title;
	private String desc;
	
	public JieDataBasic(String title, String desc, List<BaoDataBasic> baos, int id) {
		this.id = id;
		this.title = title;
		this.desc = desc;
		this.baos = baos;
	}
		
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer idIn) {
		this.id = idIn;
	}
	
	public List<BaoDataBasic> getBaos() {
		return baos;
	}
	
	public void setBaos(ArrayList<BaoDataBasic> baosIn) {
		this.baos = baosIn;
	}
	
	public BaoDataBasic getOneBao(Integer i) {
		return baos.get(i);
	}
	
	public void setOneBao(BaoDataBasic baoIn,Integer i) {
		this.baos.add(i,baoIn);	
	}

	public void appendOneBao(BaoDataBasic baoIn) {
		baos.add(baoIn);	
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String titleIn) {
		this.title = titleIn;
	}

	public BaoDataBasic getUrlBao(UrlDataBasic url) {
		for(BaoDataBasic bao : this.baos) {
			if(bao.getUrls().contains(url)) {
				return bao; 
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

