var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var URI = require('URIjs');

var MongoClient = require('mongodb').MongoClient
var app = express();

app.get('/test1', function(req,res){
    
    var data = req.query.a;
    console.log(data);
    var uri = URI(data);
    var data = uri.query(true);
    console.log(data);
    res.send(data);
                
});
app.get('/test', function(req,res){
	
    var url = 'mongodb://localhost:27017/sfly';
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
var port = process.env.PORT || 8000;
console.log('starting webapp at port='+port);
app.listen(port);



