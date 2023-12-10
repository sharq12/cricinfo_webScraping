const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecardDetail");

// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";     // home page of cric Info 
const url = "https://www.espncricinfo.com/series/icc-cricket-world-cup-2023-24-1367856";

request(url, cb);    // sending request to the homepage(user- opening the homepage)
function cb(error, response, html){
    if(error){
        console.log(error);
    }else{
        extractAllMatchesLink(html);    // extract link of "view all matches"
    }
}

function extractAllMatchesLink(html){
    let $ = cheerio.load(html);    // parsing the html of home page

    let viewAllMatchesEle = $("a[title='View All Results']");
    let viewAllMatcheslink = viewAllMatchesEle.attr('href');
    let fullLink = ("https://www.espncricinfo.com" + viewAllMatcheslink).trim();    // link of "view All Matches"
    getAllMatchesLink(fullLink);     // get all matches link 
}

function getAllMatchesLink(url){
    request(url, cb);
    function cb(error, response, html){
        if(error){
            console.log(error);
        }else{
            allScorecardLink(html);   // all matches scorecard links
        }
    }
}

function  allScorecardLink(html){
    let $ = cheerio.load(html);
    let allMatchesLinkEle = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent");
    for(let i = 0; i< allMatchesLinkEle.length; i++){
        let matchLink = $(allMatchesLinkEle[i]).find("a.ds-no-tap-higlight");
        let link =  matchLink.attr("href").trim();
        let fullLink = ("https://www.espncricinfo.com" + link).trim();

        scorecardObj.ps(fullLink);     // match detail         // asyncronous nature 
    }
}
