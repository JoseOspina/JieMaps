package jm_ser.ctr;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class HelperBase
{
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	protected HttpServlet servlet;
	
	public HelperBase(HttpServlet servlet,HttpServletRequest request, HttpServletResponse response) 
	{
		this.servlet = servlet;
		this.request = request;
		this.response = response;
	}
}


