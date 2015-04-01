package jm_loc.db;

import java.util.*;
import java.util.regex.*;
import java.net.*;
import java.sql.*;

import jm_loc.beans.*;

public class DbHandle {
	public Connection con;
	public Random random_engine;
		
	public DbHandle() throws SQLException {
		 this.random_engine = new Random(2222);
		 this.connect();
	}
	
	public void connect() throws SQLException {
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
		}
		catch(Exception ex) {
			System.out.println(ex);
		};
		
		this.con = DriverManager.getConnection("jdbc:mysql://localhost:3306/jm_db","jaof","iristrata");
		
	}
	
	public void drop_and_create_all_tables() throws SQLException {
		
		DatabaseMetaData dbm = this.con.getMetaData();
		PreparedStatement st = null;
		String st_str;

		/**/
		ResultSet tables;
		
		tables = dbm.getTables(null, null, "tags_of_jies", null);
		if(tables.next()) {
			st_str = "DROP TABLE tags_of_jies";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
		
		tables = dbm.getTables(null, null, "urls_in_baos", null);
		if(tables.next()) {
			st_str = "DROP TABLE urls_in_baos";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
	 	
		tables = dbm.getTables(null, null, "baos_in_jies", null);
		if(tables.next()) {
			st_str = "DROP TABLE baos_in_jies";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
		
		tables = dbm.getTables(null, null, "urls", null);
		if(tables.next()) {
			st_str = "DROP TABLE urls";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
		
		tables = dbm.getTables(null, null, "baos", null);
		if(tables.next()) {
			st_str = "DROP TABLE baos";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
		
		tables = dbm.getTables(null, null, "jies", null);
		if(tables.next()) {
			st_str = "DROP TABLE jies";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
		
		tables = dbm.getTables(null, null, "tags", null);
		if(tables.next()) {
			st_str = "DROP TABLE tags";
			st = this.con.prepareStatement(st_str);
			st.executeUpdate();
		}
		
		/**/
		st_str = "CREATE TABLE urls ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "url VARCHAR(2083), "
				+ "PRIMARY KEY (id)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();		
		
		st_str = "CREATE TABLE baos ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "title VARCHAR(528), "
				+ "descr VARCHAR(2500), "
				+ "PRIMARY KEY (id)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();	
		
		st_str = "CREATE TABLE jies ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "title VARCHAR(528), "
				+ "descr VARCHAR(2500), "
				+ "PRIMARY KEY (id)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();	
		
		st_str = "CREATE TABLE tags ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "tag VARCHAR(32), "
				+ "PRIMARY KEY (id),  "
				+ "UNIQUE (tag)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();	
		
		st_str = "CREATE TABLE urls_in_baos ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "bao_id MEDIUMINT, "
				+ "url_id MEDIUMINT, "
				+ "PRIMARY KEY (id), "
				+ "CONSTRAINT fk_urls_in_bao_bao_id FOREIGN KEY (bao_id) REFERENCES baos(id), "
				+ "CONSTRAINT fk_urls_in_bao_url_id FOREIGN KEY (url_id) REFERENCES urls(id)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();	
		
		st_str = "CREATE TABLE baos_in_jies ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "jie_id MEDIUMINT, "
				+ "bao_id MEDIUMINT, "
				+ "PRIMARY KEY (id), "
				+ "CONSTRAINT fk_baos_in_jie_jie_id FOREIGN KEY (jie_id) REFERENCES jies(id), "
				+ "CONSTRAINT fk_baos_in_jie_bao_id FOREIGN KEY (bao_id) REFERENCES baos(id)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();	
		
		st_str = "CREATE TABLE tags_of_jies ("
				+ "id MEDIUMINT NOT NULL AUTO_INCREMENT, "
				+ "jie_id MEDIUMINT, "
				+ "tag_id MEDIUMINT, "
				+ "PRIMARY KEY (id), "
				+ "CONSTRAINT fk_tags_in_jies_jie_id FOREIGN KEY (jie_id) REFERENCES jies(id), "
				+ "CONSTRAINT fk_tags_in_jie_tag_id FOREIGN KEY (tag_id) REFERENCES tags(id)) "
				+ "ENGINE=InnoDB";
		
		st = this.con.prepareStatement(st_str);
		st.executeUpdate();	
		
	}
	
	public int add_url(URL url) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		String url_str;

		st_str = "INSERT INTO urls (url) VALUES (?)";
		st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
		
		url_str = url.toString();
		st.setString(1, url_str);
		st.executeUpdate();
		gk = st.getGeneratedKeys();
		gk.next();
		
		return gk.getInt(1);
	}
	
	public int add_bao(String title, String desc) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		
		st_str = "INSERT INTO baos (title,descr) VALUES (?,?)";
		st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
		
		st.setString(1, title);
		st.setString(2, desc);
		st.executeUpdate();
		gk = st.getGeneratedKeys();
		gk.next();
		
		return gk.getInt(1);
	}
	
	public int add_jie(String title, String desc) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		
		st_str = "INSERT INTO jies (title,descr) VALUES (?,?)";
		st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
		
		st.setString(1, title);
		st.setString(2, desc);
		st.executeUpdate();
		gk = st.getGeneratedKeys();
		gk.next();
		
		return gk.getInt(1);
	}
	
	public int add_tag(String tag) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		
		int curr_id = this.get_tag_id(tag);
		
		if(curr_id == 0) {
			
			st_str = "INSERT INTO tags (tag) VALUES (?)";
			st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
			
			st.setString(1, tag);
			st.executeUpdate();
			gk = st.getGeneratedKeys();
			gk.next();
			curr_id = gk.getInt(1);
		}	
			
		return curr_id;
	}
	
	public int add_url_to_bao(int bao_id, int url_id) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		
		st_str = "INSERT INTO urls_in_baos (bao_id,url_id) VALUES (?,?)";
		st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
		
		st.setInt(1, bao_id);
		st.setInt(2, url_id);
		st.executeUpdate();
		gk = st.getGeneratedKeys();
		gk.next();
		
		return gk.getInt(1);
	}
	
	public int add_bao_to_jie(int jie_id, int bao_id) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		
		st_str = "INSERT INTO baos_in_jies (jie_id,bao_id) VALUES (?,?)";
		st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
		
		st.setInt(1, jie_id);
		st.setInt(2, bao_id);
		st.executeUpdate();
		gk = st.getGeneratedKeys();
		gk.next();
		
		return gk.getInt(1);
	}
	
	public int add_tag_to_jie(int jie_id, int tag_id) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet gk = null;
		String st_str;
		
		st_str = "INSERT INTO tags_of_jies (jie_id,tag_id) VALUES (?,?)";
		st = this.con.prepareStatement(st_str,Statement.RETURN_GENERATED_KEYS);
		
		st.setInt(1, jie_id);
		st.setInt(2, tag_id);
		st.executeUpdate();
		gk = st.getGeneratedKeys();
		gk.next();
		
		return gk.getInt(1);
	}
	
public int add_url_obj(UrlDataBasic url) throws SQLException, MalformedURLException {
		
		// Add the url and get the id
		URL new_url = new URL(url.getUrl());
		
		int url_id = this.add_url(new_url);
		
		return url_id;
	}
	
	public int add_bao_obj(BaoDataBasic bao, boolean add_tags) throws SQLException, MalformedURLException {
		
		// Add the bao and get the id
		int bao_id = this.add_bao(bao.getTitle(),bao.getDesc());
		
		for(UrlDataBasic url : bao.getUrls()){
			int url_id = this.add_url_obj(url);
			this.add_url_to_bao(bao_id,url_id);
		};
		
		return bao_id;
	}
	
	public void add_jie_obj(JieDataBasic jie, boolean add_tags) throws SQLException, MalformedURLException {
		
		// Add the jie and get the id
		int jie_id = this.add_jie(jie.getTitle(),jie.getDesc());
		
		if(add_tags) {
			List<String> tags = this.extract_tags_from_string(jie.getDesc());
			List<Integer> tags_ids = this.add_tags(tags);
			this.add_tags_to_jie(jie_id, tags_ids);
		}
		
		for(BaoDataBasic bao : jie.getBaos()){
			int bao_id = this.add_bao_obj(bao, add_tags);
			this.add_bao_to_jie(jie_id,bao_id);
		};
	
	}
	
	public void add_jies_objs(List<JieDataBasic> jie_list, boolean add_tags) throws SQLException, MalformedURLException {

		for(JieDataBasic jie : jie_list){
			this.add_jie_obj(jie,add_tags);
		};
	}
	
	public List<Integer> add_tags(List<String> tags) throws SQLException {
		
		List<Integer> tag_ids = new ArrayList<Integer>();
		
		for(String tag : tags){
			Integer tag_id = this.add_tag(tag);
			tag_ids.add(tag_id);
		};
			
		return tag_ids;
	}
	
	public void add_tags_to_jie(Integer jie_id, List<Integer> tags_ids) throws SQLException {

		for(Integer tag_id : tags_ids){
			this.add_tag_to_jie(jie_id, tag_id);
		};
	}
	
	public List<String> extract_tags_from_string(String str) {
		
		List<String> tags = new ArrayList<String>();
		
		Pattern tag_pat = Pattern.compile( "#\\w+");
		Matcher matcher = tag_pat.matcher(str);
		
		while(matcher.find()) {
			if(matcher.group().length() != 0) {
				String tag_with_pad = matcher.group(); 
				tags.add(tag_with_pad.substring(1));
			}			
		}
		
		return tags;
	}
	
	public UrlDataBasic get_url_from_db(int id) throws SQLException {
		PreparedStatement st = null;
		ResultSet rs = null;
		String st_str;
		
		st_str = "SELECT (url) FROM urls WHERE id = (?)";
		st = this.con.prepareStatement(st_str);
		st.setInt(1, id);
		rs = st.executeQuery();
		
		rs.next();
		
		UrlDataBasic url_found = new UrlDataBasic(rs.getString("url"),id);
		
		return url_found;
	}
	
	public BaoDataBasic get_bao_from_db(int id) throws SQLException {
		PreparedStatement st = null;
		ResultSet rs = null;
		String st_str;
		
		st_str = "SELECT title, descr FROM baos WHERE id = (?)";
		st = this.con.prepareStatement(st_str);
		st.setInt(1, id);
		rs = st.executeQuery();
		
		List<UrlDataBasic> url_list = this.get_urls_of_bao(id);
		
		rs.next();
		
		BaoDataBasic bao = new BaoDataBasic(rs.getString("title"),rs.getString("descr"),url_list,id);
		
		return bao;
	}
		
	public JieDataBasic get_jie_from_db(int id) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet rs = null;
		String st_str;
		
		st_str = "SELECT title, descr FROM jies WHERE id = (?)";
		st = this.con.prepareStatement(st_str);
		st.setInt(1, id);
		rs = st.executeQuery();
		
		rs.next();
		
		List<BaoDataBasic> bao_list = this.get_baos_of_jie(id);
		
		JieDataBasic jie = new JieDataBasic(rs.getString("title"),rs.getString("descr"),bao_list,id);
		
		return jie;
	}	
	
	public List<UrlDataBasic> get_urls_of_bao(int id) throws SQLException {
		PreparedStatement 	st 	= null;
		ResultSet rs = null;
		String st_str;
		List<UrlDataBasic> url_list = new ArrayList<UrlDataBasic>();
		
		st_str = "SELECT (url_id) FROM urls_in_baos WHERE bao_id = (?)";
		st = this.con.prepareStatement(st_str);
		st.setInt(1, id);
		rs = st.executeQuery();
		
		while(rs.next()) {
			UrlDataBasic url = this.get_url_from_db(rs.getInt("url_id"));
			url_list.add(url); 
		}
		
		return url_list;
	}
	
	public List<BaoDataBasic> get_baos_of_jie(int id) throws SQLException {
		PreparedStatement st = null;
		ResultSet rs = null;
		String st_str;
		List<BaoDataBasic> bao_list = new ArrayList<BaoDataBasic>();
		
		st_str = "SELECT (bao_id) FROM baos_in_jies WHERE jie_id = (?)";
		st = this.con.prepareStatement(st_str);
		st.setInt(1, id);
		rs = st.executeQuery();
		
		while(rs.next()) {
			BaoDataBasic bao = this.get_bao_from_db(rs.getInt("bao_id"));
			bao_list.add(bao); 
		}
		
		return bao_list;
	}
	
	public List<JieDataBasic> get_jies_with_tag(String tag) throws SQLException {
		// if tag is received as a string, look for tag id and call get_jies_with_tag again.
		return this.get_jies_with_tag(this.get_tag_id(tag));
	}
	
	public List<JieDataBasic> get_jies_with_tag(int id) throws SQLException {
		PreparedStatement st = null;
		ResultSet rs = null;
		String st_str;
		List<JieDataBasic> jie_list = new ArrayList<JieDataBasic>();
		
		st_str = "SELECT (jie_id) FROM tags_of_jies WHERE tag_id = (?)";
		st = this.con.prepareStatement(st_str);
		st.setInt(1, id);
		rs = st.executeQuery();
		
		while(rs.next() && jie_list.size() < 10) {
			JieDataBasic jie = this.get_jie_from_db(rs.getInt("jie_id"));
			jie_list.add(jie); 
		}
		
		return jie_list;	
	}	
	
	public int get_tag_id(String tag) throws SQLException {
		PreparedStatement st = null;
		ResultSet rs = null;
		String st_str;
		
		st_str = "SELECT (id) FROM tags WHERE tag = (?)";
		st = this.con.prepareStatement(st_str);
		st.setString(1, tag);
		rs = st.executeQuery();
		
		int ret_val = 0; 
		
		if(rs.next()) {
			ret_val = rs.getInt("id");
		}		
		
		return ret_val;
	}	
	
}


