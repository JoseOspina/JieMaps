/**
 * 
 */
function Matrix(nr,nc,init) {
	
	this.values = new Array(nr);
    for (var i = 0; i < nr; i++) {
    	col = new Array(nc);
    	this.values[i] = col;
    	for (j = 0; j < nc; j++) {
        	this.values[i][j] = init;
        }
    }
};

Matrix.prototype.get_n_rows = function () {
	return this.values.length;
};

Matrix.prototype.get_n_cols = function () {
	return this.values[0].length;
};

Matrix.prototype.add_empty_row = function () {

	if(this.get_n_rows() == 0) {
		new_row = [0];
	} else {
		new_row = new Array(this.get_n_rows());
		for (var ix_col = 0; ix_col<this.get_n_cols(); ix_col++) {
			new_row[ix_col] = 0;
		}
	}
	
	this.values.push(new_row);
};

Matrix.prototype.add_empty_col = function () {
	
	for (var ix_col = 0; ix_col<this.get_n_cols(); ix_col++) {
		this.values[ix_col].push(0);
	}	
};

Matrix.prototype.add_empty_row_and_col = function () {
	
	if(this.get_n_rows() != 0) {
		this.add_empty_row();
		this.add_empty_col();	
	} else {
		this.add_empty_row();
	}
};

Matrix.prototype.set_value = function (row,col,value) {
	
	this.values[row][col] = value;
};

Matrix.prototype.set_value_sym = function (row,col,value) {
	
	this.values[row][col] = value;
	this.values[col][row] = value;
};

Matrix.prototype.set_value_asym = function (row,col,value) {
	
	this.values[row][col] =  value;
	this.values[col][row] = -value;
};

Matrix.prototype.sum_value = function (row,col,value) {
	
	this.values[row][col] += value;
};


Matrix.prototype.sum_value_sym = function (row,col,value) {
	
	this.values[row][col] += value;
	this.values[col][row] += value;
};

Matrix.prototype.sum_value_asym = function (row,col,value) {
	
	this.values[row][col] += value;
	this.values[col][row] -= value;
};

Matrix.prototype.get_value = function (row,col) {
	
	return this.values[row][col];
};

Matrix.prototype.get_row = function (row) {
	
	return this.values[row];
};

Matrix.prototype.sum_row = function (row) {
	
	var sum = 0
	
	this_row = this.get_row(row);
	
	for(var ix in this_row) {
		sum = sum + this_row[ix];
	}
	
	return sum;
};