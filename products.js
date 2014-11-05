var request = require('request');
var cheerio = require('cheerio');
var express = require('express');

var app = express();
app.get('/', function(req,res){
	res.send("apification of SFLY web");
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
                var name = a.text();
                name = name.replace(/[\n\r\t]/g, '').trim();

                var url =  a.children('.thumbName').children().attr('href');;
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
                        name: name,
                        fromPrice :fromPrice,
                        url:url
                };
                console.log(product);
                products.push(product);
            });
        res.send(products);
        }
    });
}); //end appget
var port = process.env.PORT || 8000;
console.log('starting webapp at port='+port);
app.listen(port);



