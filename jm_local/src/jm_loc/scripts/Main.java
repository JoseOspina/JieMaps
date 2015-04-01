package jm_loc.scripts;

import java.io.*;
import java.sql.SQLException;

import jm_loc.db.*;

public class Main {
	
	public static void main(String[] args) throws SQLException, IOException {

		/**/
		System.out.println("Emptying DB");
		
		DbHandle db = new DbHandle();
		db.drop_and_create_all_tables();
		
		System.out.println("done");
		/**/
		
		/*
		System.out.println("re-populating DB");
		
		DbRandomFill db = new DbRandomFill();
		db.random_init();
		
		System.out.println("done");
		*/
    }
}
