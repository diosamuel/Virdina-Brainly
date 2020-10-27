/*
//    Virdina.js
//    library created by virdio samuel
//
*/

const request = require('request');
const fs = require('fs');
const path = require('path')

class VirdinaBot{
    constructor(){
        global.client='';
        global.message='';
        global.prefix=false;
    }
    set(x,y){
        global.client=x;
        global.message=y;
    }

    addPrefix(pre){
        global.prefix=pre
    }

    replyMessage(msg,user){
        global.client.sendMessage(message.from || user, msg)
    }

    generateTextRandom(){
         return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    createCommand(command,cb){
        let userMsg = global.message.body
        if (global.prefix && userMsg.toLowerCase().startsWith(global.prefix)) {
            if(command instanceof RegExp){
                if(cmd.test(msg)){
                    cb(userMsg,userMsg.slice(1).split(command)[1])
                }
            }else{
                if (userMsg.toLowerCase().slice(1).includes(command)) {
                    cb(userMsg.toLowerCase(),userMsg.slice(1).split(command)[1])
                }
            }
        }
    }
    startLog(){
       (async (client, message) => {
        let user = await client.getContactById(message.from);
        let chatInfo = await client.getChats();
        if (chatInfo[0].isGroup) {
            let ID = message.author;
            let user = await client.getContactById(ID);
            console.log(`[RECV] ${user.name ? user.name : user.pushname}@${chatInfo[0].name} : ${message.body}`)
        } else {
            console.log(`[RECV] ${user.name ? user.name : user.pushname} : ${message.body}`);
        }
        })(global.client, global.message)

    }

    //utility
    generateTextRandom(){
         return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    downloadImage(uri, filename, callback){
      request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      })
    }
    resetFolder(name){
        const directory = name;
        fs.readdir(directory, (err, files) => {
          if (err) throw err;
        
          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              if (err) throw err;
            });
          }
        });
          
    }

}



module.exports=new VirdinaBot
