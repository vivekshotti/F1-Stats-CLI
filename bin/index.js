#!/usr/bin/env node
const request = require('request');
const cheerio = require('cheerio');
const figlet = require('figlet');

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  figlet('F1 Stats', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    console.log("Welcome to F1 stats")
  });
  await sleep();

  const readline = require('readline');

  // Define the available options
  const options = [
    { key: 'a', value: 'Schedule for the 2023 Season' },
    // { key: 'b', value: 'Option B' },
    // { key: 'c', value: 'Option C' },
  ];

  // Create the readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Display the options
  console.log('Please select an option:');
  options.forEach(option => console.log(`${option.key}: ${option.value}`));

  rl.question('Enter your choice: ', answer => {
    const selectedOption = options.find(option => option.key === answer.toLowerCase());

    if (selectedOption.key=="a") {
      
      const { createSpinner } = require('nanospinner');


      const spinner = createSpinner('Schedule \n').start()

      setTimeout(() => {
        spinner.success()
      }, 1000)


 
      stats();
    } else {
      console.log('Invalid choice');
    }

    rl.close();
  });

}

function stats() {
  const url = 'https://www.formula1.com/en/racing/2023.html';
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const raceList = $('.event-item-link').toArray();

      // console.log("List of races:");

      const raceData = [];
      raceList.forEach((race, i) => {
        const countryName = $(race).attr('data-racecountryname');
        const roundNo = $(race).attr('data-roundtext');
        const monthWrapperText = $('.month-wrapper').eq(i).text();
        // const firstWord = monthWrapperText.trim().split(/[^a-zA-Z0-9]/)[0];
        const firstWord = monthWrapperText.trim().split(/[^a-zA-Z0-9]/)[0];
        let secondWord;
        if(monthWrapperText.includes('-'))
        {
          secondWord = monthWrapperText.trim().split(/[^a-zA-Z0-9]/)[1];
        }
        else{
          secondWord = monthWrapperText.trim().split(/[^a-zA-Z0-9]/)[0];
        }
        const Range = $('.start-date').eq(i).text() + " " +firstWord+ " to " + $('.end-date').eq(i).text() + " " +secondWord;

        raceData.push({ 'Country': countryName, 'Round': roundNo, 'Dates': Range});
      });
      console.table(raceData);
    }
  });
}


// Main Execution Begins from here : 

console.clear();
welcome();

// I1 : In List of Races, 0th Race i.e. Pre-Season Testing Race of the season's attributes are coming undefined, due to different html css attributes, fix it.