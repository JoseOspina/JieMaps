package jm_ser.ctr;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class Controller extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doPost (HttpServletRequest request, HttpServletResponse response)	
			throws ServletException, IOException
	{
		
		try {
			ControllerHelper helper = new ControllerHelper(this,request,response);
			helper.doPost();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
