package jm_ser.ctr;

import java.io.*;
import java.sql.*;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServlet;

import com.google.gson.*;

import jm_loc.db.*;
import jm_loc.beans.*;

public class ControllerHelper extends HelperBase
{
	private DbHandle dbHnd; 	
	
	public ControllerHelper(HttpServlet servlet,
							HttpServletRequest request, 
							HttpServletResponse response)  
	throws SQLException {
		super(servlet,request,response);
		this.dbHnd 	= new DbHandle();
	}
	
	public void doGet() 
			throws ServletException, IOException
	{
	}
	
	public void doPost() 
		throws ServletException, IOException, SQLException
	{
		Integer action 			= Integer.parseInt(request.getParameter("action_code"));
		
		// stringify the list of jies matching this keyword
		Gson gson = new Gson();
		
		switch(action) 
		{
			// Get Jie Grp from keyword
			case 101:
				// get keyword
				String keyw = request.getParameter("keyw");
				
				// query DB for this keyword
				List<JieDataBasic> jie_list_to_send = dbHnd.get_jies_with_tag(keyw);
				
		        JsonObject jie_list_json = new JsonObject();
		        JsonElement jie_list_element = gson.toJsonTree(jie_list_to_send);
		        
		        jie_list_json.add("jie_list", jie_list_element);
		        
		        String jie_list_json_str = jie_list_json.toString();
				
		        // prepare HTTP response, with jie list data
				PrintWriter out = response.getWriter();
				
		        response.setContentType("text/html");
		        response.setHeader("Cache-control", "no-cache, no-store");
		        response.setHeader("Pragma", "no-cache");
		        response.setHeader("Expires", "-1");
		        response.setHeader("Access-Control-Allow-Origin", "*");
		        response.setHeader("Access-Control-Allow-Methods", "POST");
		        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		        response.setHeader("Access-Control-Max-Age", "86400");

		        out.println(jie_list_json_str);
		        out.close();
				
			break;
			
			case 201:
				// get jie list JSON
				String new_jies_str = request.getParameter("new_jies");

				JieDataBasic[] jie_array_received = gson.fromJson(new_jies_str, JieDataBasic[].class);
				List<JieDataBasic> jie_list_received = Arrays.asList(jie_array_received);
				
				dbHnd.add_jies_objs(jie_list_received,true);
				
			break;
				
		}
	}
}


