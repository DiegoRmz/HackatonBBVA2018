<?php
require_once(__DIR__.'/../vendor/autoload.php');


class QRCreator{
    private $barcode;

    function __construct(){
        $this->barcode = new \Com\Tecnick\Barcode\Barcode();
    }

    function createQRCode($url){
        $qrCode = $this->barcode->getBarcodeObj(
            'QRCODE,H',
            $url,
            -4,
            -4,
            'black',
            array(-2,-2,-2,-2)
        )->setBackgroundColor('white');
        
        return $qrCode->getSvgCode();
    }

    function saveQRCode($svgQrCode,$qrCodeName){
        return file_put_contents($qrCodeName.'.svg',$svgQrCode);
    }
}