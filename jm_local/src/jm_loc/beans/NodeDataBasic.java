package jm_loc.beans;

import java.util.*;

public class BaoDataBasic
{
	private Integer id;
	private List<UrlDataBasic>	urls;
	private String title;
	private String desc;
	
	public BaoDataBasic(String title, String desc, List<UrlDataBasic>	url_list, int id)
	{
		this.id = id;
		this.title = title;
		this.desc = desc;
		this.urls = url_list;
	}
	
	public Integer getId()
	{
		return id;
	}
	
	public void setId(Integer idIn)
	{
		this.id = idIn;
	}
	
	public List<UrlDataBasic> getUrls()
	{
		return urls;
	}
	
	public void setUrls(ArrayList<UrlDataBasic> urlsIn)
	{
		this.urls = urlsIn;
	}
	
	public UrlDataBasic getOneUrl(Integer i)
	{
		return urls.get(i);
	}
	
	public void setOneUrl(UrlDataBasic urlIn,Integer i)
	{
		this.urls.add(i,urlIn);	
	}

	public void appendOneUrl(UrlDataBasic urlIn)
	{
		this.urls.add(urlIn);	
	}

	
	public String getTitle()
	{
		return title;
	}
	
	public void setTitle(String titleIn)
	{
		this.title = titleIn;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

}

