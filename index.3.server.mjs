/**
 * Step 3 - node native tcp server
 */

import log from '@ajar/marker'
import net from 'net'
import Sentiment from 'sentiment'
import Twitter from 'twitter'

const {consumer_key,consumer_secret,access_token_key,access_token_secret} = process.env;
const credentials = { consumer_key, consumer_secret, access_token_key, access_token_secret}
// log.obj(credentials,'credentials:')

const client = new Twitter(credentials);
const sentiment = new Sentiment();

let twitCount = 0;
let totalSentiments = 0;
let highest = 0;
let lowest = 0;


const { port } = process.env;

const server = net.createServer();

server.on('connection', socket => {

  log.yellow('✨ client connected ✨');

  socket.on('data', buffer => {
    const search = buffer.toString().trim()
    log.blue('-> incoming:', buffer.toString().trim());

    const t = client.stream('statuses/filter', {track: `${search}`});

t.on('data', twit => {
  if(twit.lang == 'en'){

    const {score} = sentiment.analyze(twit.text);

    twitCount++;
    totalSentiments += score;

    if(score > highest) highest = score;
    if(score < lowest) lowest = score;

    const avg = totalSentiments / twitCount;
    //log.v(twit.text);
    log.v(`${twitCount}`,`score ${score}\t|\tavg ${avg.toFixed(2)}\t|\thigh: ${highest} \t|\tlow: ${lowest}`);
    socket.write(`${JSON.stringify({tweet:twit.text,score})}\n`)
  }

});
 
t.on('error', error => {
  log.error(error);
});

  });

  socket.on('end', () => {
    // log.red('client disconnected');
    log.yellow('✨ client disconnected ✨');
    //clearInterval(intervalID)
  }); 

  // let count = 0
  // let intervalID = setInterval( _ => {
  //   socket.write(`${ JSON.stringify( { value: count++ } ) }\n` )
  // }, 100)

  // socket.pipe(socket);
});

server.on('error', err => log.error(err));
server.listen(port, () => log.v('✨ ⚡Server is up  🚀'));