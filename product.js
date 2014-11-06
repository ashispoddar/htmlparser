var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
//var fs    = require('fs');

var app = express();

app.get('/product',function(req,res){
	
    var url = req.query.targetUrl;
    //var url ='http://www.shutterfly.com/photo-gifts/custom-iphone-cases/my-sunshine-iphone-case?skuCode=1092986';
    request(, function (error, response, html) {
        if (!error && response.statusCode == 200) {

            //fs.writeFile("data.html",html);
            
            var $  = cheerio.load(html);
            var productInfo = $('#pipProductInfoBox');
            
            var headline = productInfo.find('#pipProductHeadline').text();
            var summary = productInfo.find('#pipShortDescription').text();
            var highlights = productInfo.find('#productDetails').text();
            
            console.log('getting various meta-data now');
            //var phoneTypes = productInfo.find('#pipProductAndSkuOptions').text();
            var phoneTypes =[];
            productInfo.find('#skuOptionFINISH').find('.skuOptionValueLabel').each(function(i, element){
                var option = $(this).text(); 
                console.log(option);  
                phoneTypes.push(option)
            });
            
            var caseTypes = [];
            productInfo.find('#skuOptionCASE_TYPE').find('.skuOptionValueLabel').each(function(i, element){
                var option = $(this).text(); 
                console.log(option);  
                caseTypes.push(option)
            });
            
            var finishTypes = [];
            productInfo.find('#skuOptionFINISH').find('.skuOptionValueLabel').each(function(i, element){
                var option = $(this).text(); 
                console.log(option);  
                finishTypes.push(option)
            });
            
            var pricingInfo = productInfo.find('.pricetable');
            var pricing = [];
            var items = pricingInfo.find('.row').each(function(i,element){
                
                var name = $(this).find('.body').text().split("\n",1);
                
                if(name != undefined && name.length > 0 ){
                    
                    name = name[0].trim();
                    if(name[0] != undefined && name[0].length > 0) {

                        console.log('Item_'+i+'='+name);

                        var origPrice = $(this).find('.orig').text();
                        console.log('OrigPrice'+i+'='+origPrice);

                        var salePrice = $(this).find('.sale').text();
                        console.log('SalePrice'+i+'='+salePrice);

                        var itemPrice = {
                            name : name,
                            origPrice : origPrice,
                            salePrice : salePrice
                        }
                        pricing.push(itemPrice);
                    }
                }
            });
            
            var product = {
                headline: headline.trim(),
                summary: summary.replace(/[\n\r\t]/g,'').trim(),
                highlights : highlights.replace(/[\t]/g,'').trim().split('\n'),
                phoneTypes : phoneTypes,
                caseTypes : caseTypes,
                finishTypes : finishTypes,
                pricing: pricing,
                
        		};
            //console.log(product);
            res.send(product);
        }
    });//end request
}); //end appget

console.log('listening nodeapp in port 3000');
app.listen(3000);


