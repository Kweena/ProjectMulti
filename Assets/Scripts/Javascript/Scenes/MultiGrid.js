/**
 * Create a new Scene
 * <ul><li>Copy the content of this file in a new .js document.</li>
 * <li>Save the new file in Assets/Javascript/Scenes/NameOfYourScene.js .</li>
 * <li>In the index.html add below this comment <!-- Scene --> the line: 
*                    "<script type="text/javascript" src="Assets/Scripts/Javascript/Scenes/NameOfYourGameObject.js"></script>"</li>
 * <li>For create a new scene, use this instruction: "new Scene()".</li>
 * </ul>
 * <strong>To load your scene, use this instruction: "Application.LoadLevel(LevelName)".</strong>
 * 
 * @class
 * 
 * @return {Scene}
 * */
function MultiGrid() 
{
	this.name = "MultiGrid";
	//this.GameObjects =[];
	this.started = false;
	this.offsetGrid = new Vector(0,0);

	this.Players = [];
	this.Items = [];
	this.Scores =  [];
	this.newScore = null;

	this.timer = new Timer(20);



	var bigger = canvas.width > canvas.height ? canvas.width : canvas.height;
	var smaller = canvas.width < canvas.height ? canvas.width : canvas.height;
	if(canvas.width > canvas.height)
	{
		this.offsetGrid.x = (bigger - smaller) / 2;
	}
	else
	{	
		this.offsetGrid.y = (bigger - smaller) / 2;
	}
	this.Grid = new Grid(this.offsetGrid.x, this.offsetGrid.y, smaller, 4);


	//this.WorldSize = new Vector(4096,4096);

	/**
	 * Called at the instruction new Scene().
	 * */
	this.Awake = function() 
	{
		console.clear();
		Print('System:Scene ' + this.name + " Created !");
	}
	
	/**
	 * Start the Scene and show a message in console or launch Update() if already started
	 * Called at the first use of scene in game.
	 * */
	this.Start = function() 
	{
		if (!this.started) 
		{
			Time.SetTimeWhenSceneBegin();
			// operation start
			var p = new Player(0,0,this.Grid, "#BADA55", 1);
			var p1 = new Player(1,1,this.Grid, "#1ce" , 2);
			var p2 = new Player(3,3,this.Grid, "#b00b13", 3);
			this.Players.push(p);
			this.Players.push(p1, p2);
			p.score = 3;
			p1.pseudo = "Ricco7La";
			p1.score = 2;
			p2.pseudo = "Kweena";
			p2.score = 1;

			var scaling = (this.Grid.caseLength / Images["Player"].width) * 0.5; 
			p.Transform.Scale.Mul(scaling);
			p1.Transform.Scale.Mul(scaling);
			p2.Transform.Scale.Mul(scaling);
			
			var item = new ItemPoint(2,2)
			this.Items.push(item);

			var posX = canvas.width - (canvas.width - canvas.height) * 0.5;
			var scoreGroup = new ScoreGroup(new Vector(posX * 1.05, 10), new Vector((canvas.width - canvas.height) * 0.45, canvas.height));
			this.Scores.push(scoreGroup);

			var score = new ScorePanel(p, scoreGroup.Transform.Size.x * 0.5, 100);
			var score1 = new ScorePanel(p1, scoreGroup.Transform.Size.x * 0.5, 150);
			var score2 = new ScorePanel(p2, scoreGroup.Transform.Size.x * 0.5, 200);
			this.Scores.push(score, score1, score2);
			this.SetAllScorePosition();

			this.started = true;


			Print('System:Scene ' + this.name + " Started !");
			Time.SetTimeWhenSceneLoaded();
		}
		this.Update();
	}
	/**
	 * Start every GameObject, Group and apply the debug mode if asked
	 * Called each frame,code game is here.
	 * */
	this.Update = function() 
	{
		if (!Application.gamePaused) 
		{
			this.Grid.Draw();

			this.ShowTimer();

			for (var i = 0; i < this.Items.length; i++) 
			{
				this.Items[i].Start();
			}
			for (var i = 0; i < this.Players.length; i++) 
			{
				this.Players[i].Start();
			}
			if (this.newScore != null) 
			{
				this.Scores = this.newScore;
				this.newScore = null;
			}
			this.Scores[0].Start();
			for (var i = this.Scores.length-1; i > 0; i--) 
			{
				this.Scores[i].Start();
			}

			for (var i = 0; i < this.Players.length; i++) 
			{
				for (var j = 0; j < this.Items.length; j++) 
				{
					if (this.Players[i].Transform.IndexPosition.x == this.Items[j].Transform.IndexPosition.x && this.Players[i].Transform.IndexPosition.y == this.Items[j].Transform.IndexPosition.y ) 
					{
						this.Items.splice(j,1);
						j--;
						for (var k = 0; k < this.Grid.Color.length; k++) 
						{
							if (this.Grid.Color[k] == this.Players[i].color) 
							{
								delete this.Grid.Color[k];
								this.Players[i].score ++;
							}
						}
						this.SortScore(this.Players[i]);
					}
				}
			}
		}

		if (Application.debugMode) 
		{
			Debug.DebugScene();
		}
		this.GUI();
	}
	/**
	 * Called each frame, code all the GUI here.
	 * */
	this.GUI = function() 
	{
		if (!Application.GamePaused) 
		{
			//Show UI
		} 
		else 
		{
			// Show pause menu
		}
	}

	this.AddPlayer = function()
	{
		var player = new Player(this.Grid,Math.Random.ColorHEX());
		//this.GameObjects.push(player);
		this.Players.push(player);

		if(this.Players.length >= 2)
		{
			this.Grid.ChangeSize(this.Players.length * 2);
		}
		else
		{
			console.log("Wait for another player");
		}
	}

	this.RemovePlayer = function(_id)
	{
		//this.GameObjects.splice(this.player)
		//Todo - remove player array
		if(this.Players.length >= 2)
		{
			this.Grid.ChangeSize(this.Players.length * 2);
		}
		else
		{
			console.log("Wait for it");
		}
	}

	this.SortScore = function(_player)
	{
		var changingRank = false;
		var arrayCopy = this.Scores.splice(0);
		for(var i = 1; i < arrayCopy.length; i++)
		{

			if (i == _player.rank) 
			{
				break;
			}
			if (changingRank) 
			{
				arrayCopy[i].Player.rank = i;
				arrayCopy[i].StartPosition = arrayCopy[i].Transform.RelativePosition.Copy();
				arrayCopy[i].EndPosition = new Vector(arrayCopy[i].Transform.RelativePosition.x, 40 + arrayCopy[i].Transform.Size.y * arrayCopy[i].Transform.RelativeScale.y * i * 1.1);
			}
			else if (arrayCopy[i].Player.score < _player.score) 
			{
				var myscore = arrayCopy.splice(_player.rank,1)[0];
				_player.rank = i;
				arrayCopy.splice(i,0,myscore);
				arrayCopy[i].StartPosition = arrayCopy[i].Transform.RelativePosition.Copy();
				arrayCopy[i].EndPosition = new Vector(arrayCopy[i].Transform.RelativePosition.x, 40 + arrayCopy[i].Transform.Size.y * arrayCopy[i].Transform.RelativeScale.y * i * 1.1);
				changingRank = true;

			}
		}
		this.newScore = arrayCopy;
	}
	this.SetAllScorePosition = function()
	{

		for(var i = 1; i < this.Scores.length; i++)
		{
			this.Scores[i].StartPosition = this.Scores[i].Transform.RelativePosition.Copy();
			this.Scores[i].EndPosition = new Vector(this.Scores[i].Transform.RelativePosition.x, 40 + this.Scores[i].Transform.Size.y * this.Scores[i].Transform.RelativeScale.y * i * 1.1);
		}
	}

	this.ShowTimer = function()
	{
		var t = this.timer.duration - this.timer.currentTime;
		var sec = t.toFixed(0) % 60;
		var min;

		(sec == 0) ? min = Math.round(t / 60) : min = Math.floor(t / 60);
		if(sec < 10) sec = "0"  + sec;
		if(t < 60 && sec != 0)	min = 0;
		if(t == 0)
		{
			//alert(this.Scores)
			Scenes["Ending"] = new Ending(this.Scores);
			Application.LoadedScene = Scenes["Ending"]; 
		}
		

		ctx.font = '40px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText('Timer :', (canvas.width - this.Grid.length) * .25, 50);
		ctx.fillText(min + " : " + sec, (canvas.width - this.Grid.length) * .25, 100);
	}

	this.Awake()
}