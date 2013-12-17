<html>
	<title>Laserama</title>
	<style type="text/css">
		@font-face {
		    font-family: "Disco";
		    src: url("DISKOTEQUE.TTF") format("truetype");
		}

		body {
			background: black;
			font: 20pt Disco;
			color: white;
		}
	</style>
	<head>
		<script type="text/javascript" src="../juego.js/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="../juego.js/keyboard.js"></script>
		<script type="text/javascript" src="../juego.js/image.js"></script>
		<script type="text/javascript" src="../juego.js/animatedKeys.js"></script>
		<script type="text/javascript" src="../juego.js/TileArray.js"></script>
		<script type="text/javascript" src="../juego.js/ScrollBox.js"></script>
		<script type="text/javascript" src="../juego.js/Entity.js"></script>
		<script type="text/javascript" src="../juego.js/Region.js"></script>
		<script type="text/javascript" src="../juego.js/Vec2.js"></script>
		<script type="text/javascript" src="../juego.js/Line.js"></script>
		<script type="text/javascript" src="../juego.js/Shape.js"></script>
		<script type="text/javascript" src="../juego.js/RayHit.js"></script>
		<script type="text/javascript" src="../juego.js/Ray.js"></script>
		<script type="text/javascript" src="../juego.js/mouse.js"></script>
		<script type="text/javascript" src="../juego.js/Level.js"></script>
		<script type="text/javascript" src="../juego.js/util.js"></script>
		<script type="text/javascript" src="../juego.js/Sound.js"></script>

		<script type="text/javascript" src="images.js"></script>
		<script type="text/javascript" src="sounds.js"></script>		
		<script type="text/javascript" src="Level.js"></script>
		<script type="text/javascript" src="EntityManager.js"></script>
		<script type="text/javascript" src="Laser.js"></script>
		<script type="text/javascript" src="LaserGun.js"></script>
		<script type="text/javascript" src="Battery.js"></script>
		<script type="text/javascript" src="Turret.js"></script>
		<script type="text/javascript" src="Player.js"></script>
		<script type="text/javascript" src="Button.js"></script>
		<script type="text/javascript" src="main.js"></script>
	</head>
	<body>
		<div id="center" align="center">
			<canvas id="screen" width="480" height="480">
		</div>
		<div align="center">
		Multiple targets, you only get one shot!<br/>
		</div>
		<div align="center" style="font-size:18pt">
		WASD/Move Spacebar/Jump Mouse/Aim Left Button/Fire<br />

		You need to get the battery before you can fire.<br/>
		</div>
	</body>
</html>