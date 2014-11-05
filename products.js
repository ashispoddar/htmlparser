var request = require('request');
var cheerio = require('cheerio');
var express = require('express');

var app = express();

app.get('/scrape',function(req,res){
	
//	res.send('hello world');
	request('http://www.shutterfly.com/sitesearch/iphone?sflyPage=1', function (error, response, html) {
  	if (!error && response.statusCode == 200) {
    		//console.log(html);
		var products = [];
    		var $ = cheerio.load(html);
    		$('span.cat_item_price').each(function(i, element){
        		var a = $(this).prev();
        		var name = a.text();
        		name = name.replace(/[\n\r]/g, '').trim();

        		//var url = a.attr('href');
        		//var url = a.html();
        		//var url = a.contents();
        		var url =  a.children('.thumbName').children().attr('href');;
        		var pricing = $(this).text();
        		pricing = pricing.replace(/[\n\r\t]/g,'').trim();

        		var product = {
                		name: name,
                		pricing:pricing,
                		url:url
        		};
        		console.log(product);
			products.push(product);
    		});
		res.send(products);
  	}
});
}); //end appget

app.listen(3000);


