const { Plugin } = require('powercord/entities')
const { get, post } = require('powercord/http')

const Settings = require('./Settings.jsx')

const fs = require("fs")
const http = require('https')

var running = false
var listeners = [] 

module.exports = class EmojiSaver extends Plugin {
    download(uri, filename) {
        const file = fs.createWriteStream(filename)
        const request = http.get(uri, function(response) {
          response.pipe(file);
        })
    }

    escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    }    

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }    

    startPlugin() {
        running = true

        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: this.manifest.name,
            render: Settings
        }); 

        const forever = () => {
            if (running) {
                var downloadPath = this.replaceAll(String(this.settings.get("downloadPath", process.env.USERPROFILE + "/Downloads")), "\\", "/")
                var emojiWrapper = document.getElementsByClassName("emojiPicker-3PwZFl")[0]

                if (emojiWrapper) {
                    var emojis = document.getElementsByClassName("emojiItem-14v6tW")

                    Object.keys(emojis).forEach(index => {
                        var emoji = emojis[index]

                        var emojiUrl = String(emoji.children[0].src).substring(0, String(emoji.children[0].src).length - 4)
                        var emojiName = this.replaceAll(String(emoji.children[0].alt), ":", "")
                        var extension = emojiUrl.split(".").pop()

                        if (!listeners.includes(emoji)) {
                            listeners.push(emoji)
                            emoji.addEventListener("contextmenu", () => {
                                if (emoji.children[0].tagName.toLowerCase() == "img") {
                                    this.download(emojiUrl, downloadPath + "/" + emojiName + "." + extension)
                                    powercord.api.notices.sendToast("Emoji Saver", {
                                        header: "Download complete.",
                                        content: "Successfully downloaded " + emojiName + " to your download path.",
                                        type: "success"
                                    })                                        
                                } else {
                                    powercord.api.notices.sendToast("Emoji Saver", {
                                        header: "Invalid Emoji Type",
                                        content: "Failed to download " + emojiName + " because its not a custom emoji.",
                                        type: "error"
                                    })                                     
                                }
                            })                        
                        }  
                    })
                }                
            }

            setTimeout(() => {forever()}, 1000)
        }

        setTimeout(() => {forever()}, 1000)
    }

    pluginWillUnload() {
        running = false
        listeners.forEach(listener => {
            listener.removeEventListener("contextmenu")
        })
    }
}