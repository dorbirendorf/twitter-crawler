/**
 * Step 3 - node native tcp client
 */
import log from '@ajar/marker'
import net from 'net'

const { port } = process.env;
const search = process.argv.slice(2).join(' ');


const socket = net.createConnection({ port }, _ => {
   log.yellow('✨ ⚡connected to server! ⚡✨');
   socket.write(`${search}`);
});

socket.on('data', buffer => {
    try{
      const {tweet,score} = JSON.parse(buffer.toString());
  
      if(tweet){
        log.v(tweet,'\n' , score , '\n');
      }
    }catch(e){
      console.error(e)
    }
});
  
socket.on('end', () => { 
  log.yellow('✨ ⚡disconnected from server ⚡✨');
});