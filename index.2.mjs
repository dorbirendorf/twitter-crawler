/**
 * Step 2 - add basic sentiment analysis
 */

import Twitter from 'twitter'
import log from '@ajar/marker'
import Sentiment from 'sentiment'

const {consumer_key,consumer_secret,access_token_key,access_token_secret} = process.env;
const credentials = { consumer_key, consumer_secret, access_token_key, access_token_secret}
// log.obj(credentials,'credentials:')

const client = new Twitter(credentials);
const sentiment = new Sentiment();

let twitCount = 0;
let totalSentiments = 0;
let highest = 0;
let lowest = 0;

const t = client.stream('statuses/filter', {track: 'trump'});

t.on('data', twit => {
  if(twit.lang == 'en'){

    const {score} = sentiment.analyze(twit.text);

    twitCount++;
    totalSentiments += score;

    if(score > highest) highest = score;
    if(score < lowest) lowest = score;

    const avg = totalSentiments / twitCount;

    log.v(`${twitCount}`,`score ${score}\t|\tavg ${avg.toFixed(2)}\t|\thigh: ${highest} \t|\tlow: ${lowest}`);
  }

});
 
t.on('error', error => {
  log.error(error);
});


