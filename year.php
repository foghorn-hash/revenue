<?php
header('Content-type: application/json');

set_include_path(implode(PATH_SEPARATOR, array(
    'library',
    get_include_path()
)));

require_once ('Zend/Loader.php');
require_once('config.php');

Zend_Loader::loadClass('Zend_Loader_Autoloader');

$autoloader = Zend_Loader_Autoloader::getInstance();

$uri = "https://marketplace.atlassian.com/rest/2/vendors/".$vendorId."/reporting/sales/transactions/export?accept=json&order=asc";
//$getParamns = array("accept" => "json");

$client = new Zend_Http_Client($uri);
$client->setConfig(array('timeout' => 60));
// set some parameters
$client->setAuth($username, $password, Zend_Http_Client::AUTH_BASIC);
// POST request
$client->setMethod(Zend_Http_Client::GET);

$response = $client->request();

$body = $response->getBody();

$phpNative = Zend_Json::decode($body);

$i=0;
$balanceVendor=0;

foreach ($phpNative as $key => $value) {

        //$atlassianAmount = $value['purchaseDetails']['purchasePrice'];
        $vendorAmount = number_format((float)$value['purchaseDetails']['vendorAmount'], 2, '.', '');
        $balanceVendor = $vendorAmount;
        //$balanceAtlassian += $atlassianAmount;
        //$json['root'][$i]['balanceAtlassian']=$balanceAtlassian-$balanceVendor;
        foreach ($value['purchaseDetails'] as $key => $value) {
			if ($key=="saleDate") {
				$json['root'][date("Y", strtotime($value))]['balanceVendor'] += $vendorAmount;
				$json['root'][date("Y", strtotime($value))]['saleYear'] = date("Y", strtotime($value));
			}            
        }
		
		$i++;
	
}

$i=0;

foreach ($json['root'] as $key => $value) {
    $year['root'][$i]['saleYear'] = $value['saleYear'];
	$year['root'][$i]['balanceVendor'] = $value['balanceVendor'];
	$i++;
}

echo Zend_Json::encode($year);
