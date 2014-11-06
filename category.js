var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var util    = require('util');
var fs      = require('fs');

var app = express();

app.get('/category',function(req,res){

    fs.readFile('category.xml', 'utf8', function (err,data) {
      
        if (err) {
            return console.log(err);
        }
        $ = cheerio.load(data);
        
        /*
        var a = $(this).text();
        
        var name = a.text();
        console.log(name);
        var url =  a.children().children().attr('href');
        console.log(url);
        */
        var category = $('.categoryItem');
        //console.log(category.text());
        console.log(category.children[0]);
        console.log(category.children[0]);
        console.log(category.children[0]);

        
        var productName = category.find('#productHeader').text();
        var productsUrl = category.find('#productMetaDeta').text();
        console.log('productName=' + productName);
        console.log('productUrl=' +productsUrl);
        res.send(productName); 
    });
    /*
    var url = req.query.targetUrl;
    console.log('target url=' + url);
    
    request(url, function (error, response, html) {
        
        if (!error && response.statusCode == 200) {
           
            var $  = cheerio.load(html);
            console.log($);
            var html1 = util.inspect($);
            console.log(html1);
            
            var cleansed = cheerio.load(html1);
            
            console.log(cleansed.text());
            res.send(cleansed.text());
            
            var categories = $('#categoryItem');
            res.send(categories);
             
            $('#catContainer').each(function(i, element){
                console.log($(this));
                console.log(i);
            });
            
        }
    });
    */
}); //end appget
console.log('starting node , port=3000');
app.listen(3000);
