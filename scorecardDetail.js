const request = require("request");
const cheerio = require("cheerio");

// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-royal-challengers-bangalore-48th-match-1216499/full-scorecard";

function processScorecard(url){
    request(url, cb);
}

function cb(error, response, html){
    if(error){
        console.log(error);
    }else{
        getScoreCardnfo(html);
    }
}

function getScoreCardnfo(html){
    let $ = cheerio.load(html);   // parsing html for getting the interface 
    let resultEle = $("div.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    let teamsEle = $(".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-2");
    let matchStatusEle = $(".ds-text-compact-xxs.ds-p-2.ds-px-4 p>span");

    let resultStatus = $(matchStatusEle).text();
    let winner = "", winStats = "";
    let loser = "", lossStats = "";
    for(let i = 0; i< teamsEle.length; i++){
        if($(teamsEle[i]).hasClass("ds-opacity-50")){
             loser = $(teamsEle[i]).find("a").attr("title");
             lossStats = $(teamsEle[i]).find(".ds-text-compact-m.ds-text-typo.ds-text-right.ds-whitespace-nowrap strong").text();
        }else{
            winner = $(teamsEle[i]).find("a").attr("title");
            winStats = $(teamsEle[i]).find(".ds-text-compact-m.ds-text-typo.ds-text-right.ds-whitespace-nowrap strong").text();
        }
    }
    let resultArray = resultEle.text().split(",");
    let matchInfo = {
        Match: resultArray[0],
        Venue: resultArray[1],
        Date: `${resultArray[2]} ${resultArray[3]}`,
        Winner: `${winner} - ${winStats}`,
        Loser: `${loser} - ${lossStats}`,
        result: resultStatus
    }
    // let matchInfo = `Match = ${resultArray[0]}| Venue = ${resultArray[1]}| Date = ${resultArray[2]} ${resultArray[3]}| Winner = ${winner} - ${winStats}| Loser = ${loser} - ${lossStats}| result =${resultStatus} `;
    console.log({matchInfo});
}

module.exports = {
    ps: processScorecard
}