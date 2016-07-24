//Principle amount
var Prin_min = 2500, Prin_max = 160000;
//Interest Rate
var Int_min = 0.05, Int_max = 0.20;
//Period
var Prd_min = 5, Prd_max = 40;

//Formula
//Fa = Pa * (1 + Interest_rate)^Prd;
/*
function calculate_CI()
{
	var node = document.getElementById("list");
	var text = document.createElement("LI");

	for(var P = Prin_min; P <= Prin_max ; P*=2)
	{
		for(var I = Int_min; I <= Int_max ; I+=0.05)
		{
			for(var N = Prd_min; N <= Prd_max; N+=5)
			{
				text.appendChild(document.createTextNode((P*12)+" "+(I*100)+"% for "+N+" Yrs : "+( (P*12)   *  Math.pow((1+I),N)  )));
				node.appendChild(text);
			}
		}
	}
}
*/

function clearGraph()
{
	var parent = document.getElementsByTagName("svg")[0];
	var childs = document.getElementsByTagName("circle");

	while( childs.length > 0 )
	{
		parent.removeChild(childs[0]);
	}

	childs = document.getElementsByTagName("text");

	while( childs.length > 0 )
	{
		parent.removeChild(childs[0]);
	}

	childs = document.getElementsByTagName("line");
	while( childs.length > 0)
	{
		parent.removeChild(childs[0]);
	}

	childs = document.getElementsByTagName("path");
	while( childs.length > 0)
	{
		parent.removeChild(childs[0]);
	}
}

function createGraph()
{
	//clearing old data points
	clearGraph();

	//Getting Principle and Interest from user
	var P = parseInt( document.getElementById("principle").value);
	var I = parseInt(document.getElementById("interest").value);

	//var Pr = [ 5,10,15,20,25,30,35,40];
	var Pr_Max = 40, Pr_Min = 5;
	var Fa = [] ;
	var MaxFa = 0, BaseFa = 100000000;
	var j = 0;
	for(var i = Pr_Min ; i <= Pr_Max ; i+=5)
	{
		Fa[j] = ( (P*12) * Math.pow((1 + (I/100)),i) );
		//Storing the maximum future amount
		if(Fa[j] > MaxFa)
		{
			MaxFa = Fa[j];
		}
		//minimum Future amount
		if(Fa[j] < BaseFa)
		{
			BaseFa = Fa[j];
		}
		j++;
	}
	//some buffer is added so that points dont collide with border

	var dataAxis = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	var svg = document.getElementsByTagName('svg')[0];

	//Reduce height and width by a total of 40px each to give room for margins and text
	var height = svg.getAttribute("height") - 20;
	var width = svg.getAttribute("width") - 30;
	/*
		Pixel location formula
		
		Range / height = Units;
		(Current_Value - Lowest_value) / Units = Position

		Height - Position = Inverted_Position
	*/


	//Each Pixel will be representing units amount of value
	var pixel_yunits = (MaxFa - BaseFa) / height;
	var pixel_xunits = width / (Pr_Max - Pr_Min);
	
	//Chart units 
	var chart_xunits = width / Fa.length;
	var chart_yunits = height / Fa.length;

	
	//code for drawing x-axis
	var xaxis_xloc = 15;
	var yaxis_yloc = height + 15;
	var tmp_prd = Pr_Min;

	for(var i = 0 ; i< Fa.length; i++)
	{
		var txt = document.createElementNS("http://www.w3.org/2000/svg","text");
		txt.setAttribute("x",xaxis_xloc+chart_xunits);
		txt.setAttribute("y",yaxis_yloc);
		txt.setAttribute("class","label");
		txt.setAttribute("style","text-anchor:middle;");

		txt.innerHTML = tmp_prd;
		tmp_prd += 5;

		xaxis_xloc += chart_xunits;
		
		// add text to axis
		svg.appendChild(txt);

	}
	
	//code for y-axis
	var Fa_Min = P*12;
	var Fa_Max = 50000000;
	var yaxis_yunits = ( Fa_Max - Fa_Min ) / Fa.length;
	xaxis_xloc = 25;
	yaxis_yloc = height ;
	var tmp_Fa = Fa_Min;
	for(var i=0; i < Fa.length ; i++)
	{
		var txt = document.createElementNS("http://www.w3.org/2000/svg","text");
		txt.setAttribute("x",xaxis_xloc);
		txt.setAttribute("y",yaxis_yloc);
		txt.setAttribute("class","label");
		txt.setAttribute("style","text-anchor:middle;");
		
		//lines to make soptting values easy
		var line = document.createElementNS("http://www.w3.org/2000/svg","line");
		line.setAttribute("x1",0);
		//adding 2 pixels so that line doesn't overrun the values
		line.setAttribute("y1",yaxis_yloc+2);
		line.setAttribute("x2",width+30);
		line.setAttribute("y2",yaxis_yloc+2);
		line.setAttribute("class","lines");

		txt.innerHTML = tmp_Fa ;
		tmp_Fa += yaxis_yunits;
		yaxis_yloc -= chart_yunits;
		
		//add text to axis
		svg.appendChild(txt);
		svg.appendChild(line);
	}
	
	//Last data point location in pixel value
	var pixel_location = [];
	var index = 0;
	var x = 20 ,y = 20;
	for(var i = 0; i < Fa.length; i++)
	{
		var dot = document.createElementNS("http://www.w3.org/2000/svg","circle");
		var cx = (x+chart_xunits);
		var cy = ( height -  (Fa[i] - BaseFa )/pixel_yunits)
		
		//these pixel location are used to draw a line
		pixel_location[index++] = cx;
		pixel_location[index++] = cy;
		
		dot.setAttribute("cx",cx);
		dot.setAttribute("cy",cy);
		dot.setAttribute("r",2);
		dot.setAttribute("stroke-width",1);
		dot.setAttribute("fill","blue");
		
		svg.appendChild(dot);
		x += chart_xunits;
	}

	//adding a line to trace the path
	var line_path = "M "+ pixel_location[0] + " " + pixel_location[1]; 
	for(var i = 2 ;i < pixel_location.length ; i+=2)
	{
		line_path = line_path + " L " + pixel_location[i] + " " + pixel_location[i+1];
	}
	var path = document.createElementNS("http://www.w3.org/2000/svg","path");
	path.setAttribute("d",line_path);
	path.setAttribute("class","path");
	svg.appendChild(path);
}
