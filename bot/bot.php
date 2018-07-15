<?php
include('simple_html_dom.php');
$search_keyword= "donald";
$search_keyword=str_replace(' ','+',$search_keyword);
$newhtml =file_get_html("https://www.google.com/search?q=".$search_keyword."&tbm=isch&gws_rd=cr&ei=16E0WMGSKYmisAHmp6b4Ag");
$result_image_source = $newhtml->find('img', 0)->src;
echo '<img src="'.$result_image_source.'"><br>';
?>
