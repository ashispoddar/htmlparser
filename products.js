var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var URI = require('URIjs');

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/sfly';

//server framework
var app = express();
var port = process.env.PORT || 8000;
console.log('starting webapp at port='+port);
app.listen(port);


//API end-points
app.get('/test1', function(req,res){
    
    var data = req.query.a;
    console.log(data);
    var uri = URI(data);
    var data = uri.query(true);
    console.log(data);
    res.send(data);
                
});
app.get('/test', function(req,res){
	
    
    MongoClient.connect(url, function(err, db) {
        console.log("connected correctly to server");
        db.collection('category', function(err, collection) {
            console.log('collection found');
            collection.find().toArray(function(err, docs) {
                console.log('collection has data');
                console.log(docs);
                db.close();
                res.send(docs);
            });
        });
    });
});
//get a list of products summary based on category code
app.get('/products',function(req,res){

    var url = req.query.targetUrl;
    console.log('target url=' + url);
    
    request(url, function (error, response, html) {
        
        if (!error && response.statusCode == 200) {
            var products = [];
            var $ = cheerio.load(html);
            $('span.cat_item_price').each(function(i, element){
                var a = $(this).prev();
                
                //product name
                var name = a.text();
                name = name.replace(/[\n\r\t]/g, '').trim();

                //product url
                var url =  a.children('.thumbName').children().attr('href');
                url = 'http://www.shutterly.com/' + url;
                var queryParams = URI(url).query(true);
                //key index fields
                var categoryId = queryParams['categoryCode'];
                var productId = queryParams['productCode'];
                var skuId = queryParams['skuCode'];
                
                //product pricing
                var pricing = $(this).text();
                pricing = pricing.replace(/[\n\r]/g,'').trim().split('\t');
                var fromPrice;
                for(i = 0; i< pricing.length; i++){
                    price = pricing[i];
                    if(price != undefined && price.length > 0 && price.charAt(0) == '$'){
                        fromPrice = price;
                    }
                }
                var product = {
                        id : productId,
                        skuId : skuId,
                        categoryId : categoryId,
                        name: name,
                        fromPrice :fromPrice,
                        url: url
                };
                console.log(product);
                products.push(product);
            });
            
            //db operation
            res.send(products);
        }
    });
}); //end appget
//get product details based on skuCode/productCode
app.get('/product',function(req,res){
	
    var url = req.query.targetUrl;
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {

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
                var index = name[0].indexOf('$');
                if(index > 0 ){
                    var data = name[0].split('$');
                    name = data[0];
                    var regPrice = '$' + data[1];
                    
                    var origPrice = $(this).find('.orig').text();
                    var salePrice = $(this).find('.sale').text();
                    var itemPrice = {
                        name : name,
                        price : regPrice,
                        origPrice : origPrice,
                        salePrice : salePrice
                    }
                    pricing.push(itemPrice);
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
            res.send(product);
        }
    });//end request
}); //end appget





