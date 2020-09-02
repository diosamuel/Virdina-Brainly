// author : Virdio Samuel
//define package
const fs = require('fs');
const {
    Client
} = require('whatsapp-web.js');
const {
    MessageMedia
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const brainly = require('brainly-scraper');
const cron = require('node-cron');
const Virdina = require('./lib/Virdina');
const colors = require('colors');
const Math = require('mathjs')

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

//Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

//Use the saved values
const client = new Client({
    session: sessionData
});


//Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
        if (err) {
            console.error(err);
        }
    });
});

//qrcode
client.on('qr', (qr) => {
    console.log('QR RECEIVED');
    qrcode.generate(qr, {
        small: true
    });
});

//appear when bot is ready
client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', message => {
    //log
    (async (client, message) => {
        // console.log(JSON.stringify(message))
        // fs.writeFileSync(JSON.stringify(message),'text.txt')
        let user = await client.getContactById(message.from);
        let chatInfo = await client.getChats();
        if (chatInfo[0].isGroup) {
            let ID = message.author;
            let user = await client.getContactById(ID);
            console.log(`[RECV] ${user.name ? user.name : user.pushname}@${chatInfo[0].name} : ${message.body}`.green)
            // sendToMyLog(client, message, `[RECV] ${user.name ? user.name : user.pushname}@${chatInfo[0].name} : ${message.body}`)
        } else {
            console.log(`[RECV] ${user.name ? user.name : user.pushname} : ${message.body}`.green);
            // sendToMyLog(client, message, `[RECV] ${user.name ? user.name : user.pushname} : ${message.body}`)
        }

    })(client, message)

    //start
    Virdina.set(message);
    Virdina.addPrefix('/');

    //  /brainly <pertanyaan> -<jumlah>
    Virdina.createCommand('brainly', function(msg, res) {

        var raw = res.split(/\s/)
        var amount = Number(raw[raw.length - 1].split('-')[1]) || 5
        if (Number(raw[raw.length - 1])) {
            raw.pop()
        }
        var question = raw.join(" ")
        //

        /* 
          PERHATIAN, DISARANKAN BATAS JANGAN TERLALU BESAR 
          UNTUK MENGHINDARI DIBANNEDNYA NOMOR (KARENA SPAM)
        */
        //ATUR BATAS MAKSIMAL JAWABAN DISINI
        const BATAS = 10
        const urlQuestion = "https://brainly.co.id/app/ask?entry=hero&q="+encodeURIComponent(question)

        try{
        BrainlySearch(question, batasan(amount, BATAS), function(res) {
            console.log('test')
            console.log(`[INFO] Getting the answer from Brainly : ${question}`.yellow)
            Virdina.replyMessage(`┌ *Pertanyaan : ${question}*\n│ *Jumlah Jawaban : ${batasan(amount, BATAS)} (default 5, max ${BATAS})*\n└ _Sedang mendapatkan jawaban dari Brainly.co.id..._\n\n${urlQuestion}`)
            res.forEach(x => {
                //prevent spam
                setTimeout(() => {
                  // console.log('BRAINLY!')
                    if (x.jawaban.fotoJawaban.length <= 0) {
                      setTimeout(()=>{
                        Virdina.replyMessage(`Pertanyaan❓\n${x.pertanyaan}\n\nJawaban✅\n${x.jawaban.judulJawaban}\n\n*🖼️Foto Jawaban*\n${x.jawaban.fotoJawaban.join('\n') || "[KOSONG]"}`)
                      },3000)
                    } else {
                        let getExtention = /[^.]+$/.exec(x.jawaban.fotoJawaban[0].trim());
                        let randomName = Math.floor(Math.random() * 1000);
                        x.jawaban.fotoJawaban.forEach(fotoBrainly=>{
                        Virdina.downloadImage(fotoBrainly.trim(), `image/brainly${randomName}.${getExtention}`, () => {
                            console.log('[INFO] download img success'.yellow)
                            let imgBase64 = fs.readFileSync(`image/brainly${randomName}.${getExtention}`, 'base64')
                            const media = new MessageMedia(`image/brainly${randomName}.${getExtention}`, imgBase64)
                            client.sendMessage(message.from, media, {
                                caption: `Pertanyaan❓\n${x.pertanyaan}\n\nJawaban✅\n${x.jawaban.judulJawaban}`
                            })
                        })
                      })
                    }

                }, 5000)
            })
            console.log('[INFO] Brainly done!'.yellow)
        })
      }catch(err){
        console.log('errorrr')
      }

    })

    Virdina.createCommand("img", function(msg, res) {
        //img <url>
        let isUrl = /^(ftp|http|https):\/\/[^ "]+$/

        if (!(isUrl.test(res.trim()))) {
            Virdina.replyMessage('┌ Invalid Url!!\n└ URL harus diawali https/http/ftp dan berakhiran .jpg, .png dan sejenisnya')
        } else {
            Virdina.replyMessage('*Download image...*')
            let getExtention = /[^.]+$/.exec(res.trim());

            randomName = Math.floor(Math.random() * 1000)
            Virdina.downloadImage(res.trim(), `image/img${randomName}.${getExtention}`, () => {
                console.log('[INFO] download img success'.yellow)
                let imgBase64 = fs.readFileSync(`image/img${randomName}.${getExtention}`, 'base64')
                const media = new MessageMedia(`image/img${randomName}.${getExtention}`, imgBase64)
                client.sendMessage(message.from, media, {
                    caption: 'here'
                })
            })

        }

    })


    Virdina.createCommand("math ", function(msg, res) {
        if (typeof Math.evaluate(res) !== "number") {
            Virdina.replyMessage(`"${res}", bukan angka!`)
        } else {
            Virdina.replyMessage(`*Kalkulator*\n${res} = ${Math.evaluate(res)}`)
        }
    })

    Virdina.createCommand('help', function(msg, res) {
        pesan = ``
        pesan += `*Bot Brainly Whatsapp 🤖 👩‍💻*\n*Menu*\n\n💡Brainly Search\n/brainly <pertanyaan> -<jumlah>\n*/brainly rumus mtk -10*`
        pesan += `\n\n\n💡Kalkulator\n_hanya bisa kali(*) bagi(/) tambah(+) kurang(-)_\n/math <angka>\n*/math 100+70/2*`
        pesan += "\n\n*Created by @virdiosam*"
        Virdina.replyMessage(pesan)
    })

    Virdina.createCommand('vd ', function(msg, res) {
        try {
            Virdina.replyMessage(eval(res))
        } catch (err) {
            Virdina.replyMessage(`err!  ${err}`)
        }
    })



})

client.initialize();


//util
function BrainlySearch(pertanyaan, amount, cb) {
    brainly(pertanyaan.toString(), Number(amount)).then(res => {

        let brainlyResult = [];

        res.forEach((ask,id) => {
            let option = {
                id,
                pertanyaan: ask.pertanyaan,
                fotoPertanyaan: ask.questionMedia,
            }
            ask.jawaban.forEach(answer => {
                option.jawaban = {
                    judulJawaban: answer.text,
                    fotoJawaban: answer.media
                }
            })
            brainlyResult.push(option)
        })

        return brainlyResult

    }).then(x => {

        cb(x)

    }).catch(err => {

        console.log(`${err}`.error)

    })
}


function batasan(amount, batas) {
    return Number(amount) >= batas ? batas : Number(amount)
}

// function sendToMyLog(client, message, log) {
//     client.sendMessage(`6283876944538-1598319499@g.us`, log)
// }

//delete unwanted files
cron.schedule('5 * * * * *', () => {
  Virdina.resetFolder("image");
  console.log(`===remove unwanted files===`.bgBlue);
  if (fs.existsSync('./debug.log')) {
    fs.unlinkSync('./debug.log')
  }
});