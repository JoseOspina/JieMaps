package jm_loc.beans;

public class UrlDataBasic
{
	private Integer id;
	private String url;
	
	public UrlDataBasic()
	{
		this.id = -1;
		this.url = "";
	}
	
	public UrlDataBasic(String url)
	{
		this.id = -1;
		this.url = url;
	}
	
	public UrlDataBasic(String url, int id)
	{
		this.id = id;
		this.url = url;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer idIn) {
		id = idIn;
	}
	
	public String getUrl() {
		return url;
	}
	
	public void setUrl(String urlIn) {
		url = urlIn;
	}
}

