function DataManager(gm){  //recebe como parâmetro uma instância da classe GraphicManager.
	
	var $kind_of_function = $('#kind_of_function');

	var constraint_id = "#constraint_";
	var variable_id = "#x";
	var variableOnFunction_id = "#c";
	var sign_id = "#sign_";
	var b_id = "#b";

	var that = this;

	this.getKindOfFunction = function(){
		var kindOf = $kind_of_function.val();
		return kindOf;
	};

	this.getVectorC = function(){
		var c = [];
		for(var i=0; i<gm.numberOfVariables; i++){
			var $id = $(variableOnFunction_id+(i+1));

			var value = parseFloat($id.val());
			if(isNaN(value)){
				c.push(1);
				continue;
			}
			c.push(value);
		}
		return c;
	};

	this.getLPP = function(){
		var lpp = new LPP();
		var type = that.getKindOfFunction();

		lpp.setFunction(type, that.getVectorC());

		for(var i=0; i<gm.numberOfConstraints; i++){
			var list = [];
			for(var j=0; j<gm.numberOfVariables; j++){
				var $id = $(variable_id+(i+1)+"_"+(j+1));
				var value = parseFloat($id.val());
				if(isNaN(value)){
					list.push(1);
					continue;
				}
				list.push(value);
			}

			var $s_id = $(sign_id+(i+1));
			var s_value = $s_id.val();

			var $Bid = $(b_id+(i+1));
			var b_value = parseFloat($Bid.val());
			if(isNaN(b_value)){
				b_value = 1;
			}

			lpp.createConstraint(list, s_value, b_value);
		}

		return lpp;
	};

	this.putLPP = function(lpp){
		gm.putMatrix(lpp.getNumberOfLines(), lpp.getNumberOfColumns());
		that.partialPutLPP(lpp);
	};

	this.partialPutLPP = function(lpp){
		
		$kind_of_function.val(lpp.getType());

		var columns = gm.numberOfVariables > lpp.getNumberOfColumns() ? lpp.getNumberOfColumns() : gm.numberOfVariables;
		var lines = gm.numberOfConstraints > lpp.getNumberOfLines() ? lpp.getNumberOfLines() : gm.numberOfConstraints;

		for(var i=0; i<columns; i++){
			var $id = $(variableOnFunction_id+(i+1));
			$id.val(lpp.getC(i));
		}

		for(var i=0; i<lines; i++){
			var constraint = lpp.getConstraint(i);

			for(var j=0; j<columns; j++){
				var $id = $(variable_id+(i+1)+"_"+(j+1));
				$id.val(constraint.values[j]);
			}

			var $s_id = $(sign_id+(i+1));
			$s_id.val(constraint.sign);

			var $Bid = $(b_id+(i+1));
			$Bid.val(constraint.b);
		}
	};

	var createSimplexTableHTML = function(simplex, name, number){
		var table = simplex.getTable();
		var size = table.size();
		var variables = simplex.getVariablesInBase();

		var element = '<div class="panel panel-info">';
		element += '<div class="panel-heading toggler" data-target="#'+name+number+'">';
		element += '<h4 class="panel-title">'+name+' '+number+'</h4>';
		element += '</div>';
		element += '<div id="'+name+number+'" class="panel-body toggler-target">';
		element += '<table class="table">';
		element += '<thead><tr>';
		element += '<th>base</th>';
	
		for(var i=1; i<size[1]; i++){
			element += '<th>x'+i+'</th>';
		}

		element += '<th>RHS</th>';
		element += '</tr></thead>';
		element += '<tbody>';

		for(var i=0; i<size[0]; i++){
			element += '<tr>';
			if(i>0) element += '<td>x'+(variables[i-1]+1)+'</td>';
			else element += '<td>costs</td>';

			for(var j=0; j<size[1]; j++){
				var value = table.subset(math.index(i,j));
				element += '<td>'+math.round(value,3)+'</td>';
			}
			element += '</tr>';
		}

		element += '</tbody>';
		element += '</table>';
		element += '</div>';
		element += '</div>';

		return element;
	};

	//TODOing
	this.putSimplex = function(simplex){
		var $solutions = $('#solutions');
		var $steps = $('#steps');

		$steps.empty();
		$solutions.empty();

		var element = createSimplexTableHTML(simplex.getSolution(), "solution", "1");
		$solutions.append(element);
	};
}
