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
	this.Groups = [];
	this.Cameras = [];
	this.CurrentCamera = null;
	this.AlphaMask = null;
	this.started = false;
	this.offsetGrid = new Vector(0,0);
	this.WalkableTiles = [0];
	this.ColorById = [];

	this.Players = [];
	this.Items = [];


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
			var p = new Player(this.Grid, "#BADA55");
			//this.GameObjects.push(p);
			this.Players.push(p);
			var item = new ItemPoint(2,2)
			this.Items.push(item);
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

			for (var i = 0; i < this.Items.length; i++) 
			{
				this.Items[i].Start();
			}
			for (var i = 0; i < this.Players.length; i++) 
			{
				this.Players[i].Start();
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
								console.log(this.Players[i].score)
							}
						}
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
			this.Scoring();
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

	this.Scoring = function()
	{
		ctx.font = '40px Arial';
		ctx.textAlignLast = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText('Scoring', canvas.width - 300, 50);
	}

	this.Awake()
}