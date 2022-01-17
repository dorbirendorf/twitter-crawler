/** --------------------------------------------
 * Step 1 - connect to Twitter streaming API
 ----------------------------------------------- */

import Twitter from 'twitter'
import log from '@ajar/marker'

const {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
} = process.env;

const credentials = { 
  consumer_key, 
  consumer_secret, 
  access_token_key, 
  access_token_secret
}
// log.obj(credentials,'credentials:')

const t = new Twitter(credentials);


const stream = t.stream('statuses/filter', {track: 'trump'});

stream.on('data', twit => {
    // log.obj(twit,'twit')
    // process.end()
    if(twit.lang == 'en'){
        console.log(twit.text);
        console.log('-----------------------------------------------');
    }
});
 
stream.on('error', error => {
  log.error(error);
});