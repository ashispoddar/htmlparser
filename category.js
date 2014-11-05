var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var util    = require('util');

var app = express();

app.get('/category',function(req,res){

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
            /*
            var categories = $('#categoryItem');
            res.send(categories);
             
            $('#catContainer').each(function(i, element){
                console.log($(this));
                console.log(i);
            });
            */
        }
    });
}); //end appget
app.listen(3000);
