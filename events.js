(function(){
	var gm = new GraphicManager();
	var dm = new DataManager(gm);
	var firstLPP = new LPP();
	firstLPP.setFunction("min",[-1,-1]);
	firstLPP.createConstraint([3,2],'>',6);
	firstLPP.createConstraint([4,1],'<',16);
	firstLPP.createConstraint([-2,3],'<',6);
	firstLPP.createConstraint([1,4],'>',4);
	dm.putLPP(firstLPP);

	var firstFase = true;

	var simplex = null;

	$("#add_column_btn").on('click',function(e){
		var lpp = dm.getLPP();
		gm.addColumn();
		dm.partialPutLPP(lpp);
	});
	$("#remove_column_btn").on('click',function(e){
		var lpp = dm.getLPP();
		gm.removeColumn();
		dm.partialPutLPP(lpp);
	});
	$("#add_line_btn").on('click',function(e){
		var lpp = dm.getLPP();
		gm.addLine();
		dm.partialPutLPP(lpp);
	});
	$("#remove_line_btn").on('click',function(e){
		var lpp = dm.getLPP();
		gm.removeLine();
		dm.partialPutLPP(lpp);
	});
	$("#calculate_simplex_btn").on('click',function(e){
		var lpp = dm.getLPP();
		dm.putLPP(lpp);
		firstFase = true;
		$('#great_base').empty();
		$('#solutions').empty();
		$('#steps').empty();

		var sp = new Simplex(lpp);
		if(sp.calculateSimplex2Fases()){
			gm.putAlertMessage("solve_msg","Problem solved.","success");
			gm.printTypeOfSolution("type_solution_msg", sp.getSolution().getTypeOfSolution());
			simplex = sp;
			dm.putSolution(sp.getSolution(),1);
			dm.putGreatBase(sp.getGreatBase());
		}
		else{
			gm.removeAlertMessage("type_solution_msg");
			gm.putAlertMessage("solve_msg","Invalid LPP.","danger");
		}
		
	});

	$("#next_solution").on('click',function(){
		if(simplex == null){
			gm.putAlertMessage("next_solution_msg","First press the button solve lpp.","warning");
			$('#solutions').empty();
			return;
		}

		var result = simplex.nextSolution();
		if(result == null){
			gm.putAlertMessage("next_solution_msg","There isn't more solutions.","info");
			return;
		}
		dm.putSolution(result, simplex.getStepSolution());
	});

	$("#next_step").on('click',function(){
		if(simplex == null){
			gm.putAlertMessage("next_step_msg","First press the button solve lpp.","warning");
			$('#steps').empty();
			firstFase = true;
			return;
		}

		var result = simplex.nextStepFirstFase();
		if(result == null){
			if(firstFase){
				gm.endOfFirstFaseMessage();				
				firstFase = false;
			}
			result = simplex.nextStepSecondFase();
		}
		if(result == null) gm.putAlertMessage("next_step_msg","End of steps.","info");

		dm.putStep(result, simplex.getStep());
	});

	$(".toggler").click(function(){
		var target = $(this).attr("data-target");
		$(target).fadeToggle();
	});
})();
