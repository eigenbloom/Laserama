<?php
$filename = $_POST[ "filename" ];
$fh = fopen( $filename, "r") or die( "Unable to open file " . $filename );
$size = filesize( $filename );
$levelString = fread( $fh, $size );
echo $levelString;
fclose($fh);
?>