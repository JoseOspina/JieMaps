function wj_remove_elements(array,elements) {
	
	for(var ix_el in elements) {
		for(var ix_array in array) {
			if(array[ix_array] == elements[ix_el]) {
				array.splice(ix_array, 1);
			}			
		}
	}
};

function wj_create_incremental_array(init,end) {
	array = new Array();
	for(var i = init; i <= end; i++) {
		array.push(i);
	}
	return array;
};

function wj_interpolate(X,Y,x,extrap_f) {
	
	np = X.length;
	
	x_min = X[0];
	x_max = X[np - 1];
	
	if(extrap_f == 0) {
		if(x <= x_min) {
			return Y[0];
		}
		
		if(x >= x_max) {
			return Y[np-1];
		}	
	}
	
	for(var ix_LUT = 0; ix_LUT < X.length; ix_LUT++)	{
		if(x > X[ix_LUT] ) {
			ix_out = ix_LUT;
		}	
	}

	if(ix_out == np){
		if(x < x_min) {
			ix_out = np - 2;	
		}
	}
	
	if(ix_out == 1) {
		if(x < x_min) {
			ix_out = 0;
		}
	}
			
	y = Y[ix_out] + (Y[ix_out + 1] - Y[ix_out])/(X[ix_out + 1] - X[ix_out])*(x - X[ix_out]);
	
	return y;
};

function wj_rad2deg(x) {
	return x * 180 / Math.PI;
};

function wj_deg2rad(x) {
	return x * Math.PI / 180;
};

function wj_random(low,high) {
	return low + (low - high)*Math.random();
}
