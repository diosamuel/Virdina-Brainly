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
        global.message=''
        global.prefix=false;
    }
    set(x){
        global.message=x;
    }

    addPrefix(pre){
        global.prefix=pre
    }

    replyMessage(msg){
        global.message.reply(msg)
    }

    createCommand(command,cb){
        let userMsg = global.message.body
        if (global.prefix && userMsg.toLowerCase().startsWith(global.prefix)) {
            if(command instanceof RegExp){
                cb(userMsg.toLowerCase(),userMsg.split(command)[1].trim())
            }else{
                if (userMsg.toLowerCase().slice(1).includes(command)) {
                    cb(userMsg.toLowerCase(),userMsg.split(command)[1].trim())
                }
            }
        }
    }


    //utility
    createRandom(list){
        return list[Math.floor(Math.random()*list.length)]
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