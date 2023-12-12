const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function players(html, Match, venue, date, result){
    playerDetail(html, Match, venue, date, result);
};

function playerDetail(html, Match, venue, date, result) {
    let $ = cheerio.load(html); // parsing HTML 
    let inningsEle = $(".ds-rounded-lg.ds-mt-2");
    // let htmlStr = "";
    for(let i = 0; i < inningsEle.length; i++){
        // htmlStr += $(inningsEle[i]).html();     // html of batting innings 
        let teamName = $(inningsEle[i]).find("div.ds-flex.ds-flex-col.ds-grow.ds-justify-center").text().split("(")[0].trim();
        let opponentName = $(inningsEle[1-i]).find("div.ds-flex.ds-flex-col.ds-grow.ds-justify-center").text().split("(")[0].trim();
        let battingTrEle = $(inningsEle[i]).find(".ds-p-0>table.ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr");
        for(let j = 0; j< battingTrEle.length; j++){
            if($(battingTrEle[j]).hasClass('ds-hidden') === false && $(battingTrEle[j]).hasClass('!ds-border-b-0') === false){
                let battingtd = $(battingTrEle[j]).find("td.ds-w-0") ;
                if($(battingtd[0]).text() !== ""){
                    let playerName = $(battingtd[0]).text().trim();
                    let runs = $(battingtd[1]).text().trim();
                    let balls = $(battingtd[2]).text().trim();
                    let SR = $(battingtd[6]).text().trim();
                    let fours = $(battingtd[4]).text().trim();
                    let sixes = $(battingtd[5]).text().trim();
                console.log(`|TeamName - ${teamName} |OpponentName - ${opponentName}  |Batsman - ${$(battingtd[0]).text()} |Runs - ${$(battingtd[1]).text()} |Balls - ${$(battingtd[2]).text()} |SR - ${$(battingtd[6]).text()}`);
                  processPlayer(teamName, opponentName, playerName, runs, balls, SR, fours, sixes, Match, venue, date, result)  //matchInfo.Venue, matchInfo.Date ,matchInfo.result);
            }
            }
        }
        console.log(" ");
    }  
}
  
function processPlayer(teamName,opponentName, playerName, runs, balls, SR, fours, sixes, Match, venue, date, result){
    let teamPath = path.join(__dirname, "wc2023", teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        opponentName,
        runs,
        balls,
        fours, 
        sixes,
        SR, 
        Match,
        venue, 
        date, 
        result
    };
    content.push(playerObj);
    excelWriter(content, playerName, filePath);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);    // create the directory
    }
}

function excelWriter(jsonData, sheetName, filePath){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath) == false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans ; 
}

module.exports = {
    battingDetail:players
}

