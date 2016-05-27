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
function Title() 
{
	this.name = "Title";
	this.GameObjects =[];
	this.Groups = [];
	this.Cameras = [];
	this.CurrentCamera = null;
	this.AlphaMask = null;
	this.started = false;
	this.nbrPlayers = 0;

	this.WorldSize = new Vector(4096,4096);

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
			
			var url = 'http://10.10.7.55:8000';
			var socket = io.connect(url);
			var _self = this;
			var fn = function(e)
			{
				console.log(_self);
				if (_self.nbrPlayers < 2 ) 
				{
					console.log("waiting for player");
				}
				else
				{	
					socket.emit("Ready");	
					console.log("We are Ready");		
					
				}
				// Scenes["MultiGrid"] = new MultiGrid();
				// Application.LoadedScene = Scenes["MultiGrid"];
				// window.removeEventListener('click',fn);

			};
			window.addEventListener('click',fn);
			

			socket.on('CheckConnection',function(_data)
			{
				socket.emit('ConnectionOK',_data);
			})


			socket.on('PlayersConnected', function(_nbrPlayers) 
			{
				_self.nbrPlayers = _nbrPlayers;
				console.log("P :" + _nbrPlayers);

			})


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
		//ctx.fillStyle = "#E8FFBC";
		//ctx.fillRect(0,0,canvas.width,canvas.height);

		var iw = Images["Title"].width;
		var ih = Images["Title"].height;
		var cw = canvas.width;
		var ch = canvas.height;

		ctx.drawImage(Images["Title"],(cw - iw) * .5,(ch - ih) * .5);
		if (!Application.gamePaused) 
		{
			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				this.GameObjects[i].Start();
			}
			for (var i = 0; i < this.Groups.length; i++) 
			{
				this.Groups[i].Start();
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
			this.StartGame();
		} 
		else 
		{
			// Show pause menu
		}
	}

	this.StartGame = function()
	{
		var time = Math.floor(Time.Time / 500);

		if (time % 3 != 0)
		{
			ctx.font = '40px Arial';
			ctx.textAlign = 'center';
			ctx.fillStyle = 'red';
			ctx.fillText('Click for launch the game', canvas.width * 0.5,canvas.height - 50 );
		}
	}

	this.Awake()
}