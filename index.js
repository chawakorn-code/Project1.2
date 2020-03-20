const Discord = require('discord.js')
const papedBot = new Discord.Client()
const moment = require('moment')

const mongoose = require('mongoose')
const { configDB } = require('./config/config')
const employeeSchema = require('./model/employee')


///////////////////
///// Database/////
///////////////////
mongoose.connect(`mongodb://${configDB.dbHost}:${configDB.dbPort}/${configDB.dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection
  .once('open', () => console.log('Database is connected! === Discord CHECK-IN'))
  .on('error', (error) => {
    console.warn('Warning', error);
  });

const Employee = mongoose.model('employee', employeeSchema)
//////////////////
///////////


///////////////////
///////// BOT /////
///////////////////
papedBot.login('NjkwMjM1ODYzOTQyMTY4Njk2.XnOehA.tRZbTV02NEB8yLCVu6bmrWILfwM', () => {
}).catch((err) => console.log('err', err))

papedBot.on('ready', () => {
    console.log('Paped Ready!!!')
})

papedBot.on('message', async msg => {
    const username = msg.author.username
    const id = msg.author.discriminator
    const text = msg.content
    const currentChannel = msg.channel.id
    const checkInChannel = '690221415928168469'

    if(username !== 'ป้าเป็ด' && id !== '0060' && currentChannel === checkInChannel){
        switch (text) {
            case 'check':
                await Employee.create({
                    name: username,
                    userId: id,
                    startWork: Date.now()
                })
                msg.reply('บันทึกสำเร็จค่ะ มาทำงานเวลา : ' + moment().format('MMMM Do YYYY, h:mm:ss') + "อย่าลืมเวลาออกงาน พิมพ์ bye ด้วยนะคะ")
                break;
            case 'bye':
                await Employee.create({
                    name: username,
                    userId: id,
                    endWork: Date.now()
                })
                msg.reply('บันทึกสำเร็จค่ะ ออกงานเวลา : ' + moment().format('MMMM Do YYYY, h:mm:ss'))
                break;
            default:
                msg.reply('บันทึกผิดพลาดค่ะ โปรดลองใหม่อีกครั้ง ต้องการ เข้างาน พิมพ์ check ออกงาน พิมพ์ bye')
                break;
        }

    }

});
//////////////////
/////////////
/////////////////
