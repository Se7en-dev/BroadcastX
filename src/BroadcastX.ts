/*

  .d88888b           d88888P                   d88888P d88  d88
  88.    "'              d8'                       d8'  88   88
  `Y88888b. .d8888b.    d8'  .d8888b. 88d888b.    d8'   88   88
        `8b 88ooood8   d8'   88ooood8 88'  `88   d8'    88   88
  d8'   .8P 88.  ...  d8'    88.  ... 88    88  d8'     88   88
   Y88888P  `88888P' d8'     `88888P' dP    dP d8'     d88P d88P

  BroadcastX - A simple BDSX plugin to automatically broadcast messages

 */

import {existsSync, readFileSync, writeFileSync} from "fs";
import {TextPacket} from "bdsx/bds/packets";
import {events} from "bdsx/event";
import {command, MinecraftPacketIds, NetworkIdentifier} from "bdsx";
import {CommandPermissionLevel, CommandRawText} from "bdsx/bds/command";

let playerList = Array();
let messageId = 0;
let intervalId: NodeJS.Timeout;

if(!existsSync(`${__dirname}/../resources/BroadcastXSettings.json`)){
    const defaultSettings = JSON.stringify({
        prefix: "§9[Broadcast] §r", //Leave blank for no prefix
        broadcast_interval: 300, //in seconds
        messages: ["Hello, world !", "BDSX is awesome !", "Birds aren't real"],
        random_order: false //true : Broadcast the messages randomly. false : Broadcast the messages in order
    });
    writeFileSync(`${__dirname}/../resources/BroadcastXSettings.json`, defaultSettings);
}

const settings = JSON.parse(readFileSync(`${__dirname}/../resources/BroadcastXSettings.json`).toString());

command.register('broadcast', 'Broadcast a message', CommandPermissionLevel.Operator).overload((args) => {
    sendBroadcast(args.message.text);
}, {
    message: CommandRawText
});

function startBroadcastTask() {
    if(!settings.random_order) messageId = 0;
    intervalId = setInterval(async () => {
        if(settings.random_order) messageId = Math.floor(Math.random() * settings.messages.length);
        sendBroadcast(settings.messages[messageId]);
        if(!settings.random_order) {
            messageId++;
            if(messageId === settings.messages.length) messageId = 0;
        }
    }, 1000 * settings.broadcast_interval);
}

/**
 * Triggers after player login
 */
events.packetAfter(MinecraftPacketIds.Login).on((ptr, netId) => {
    playerList.push(netId);
    if(playerList.length === 1) startBroadcastTask();
});

/**
 * Triggers on player disconnection
 */
NetworkIdentifier.close.on(netId => {
    let index = playerList.indexOf(netId);
    if(index > -1) playerList.splice(index, 1);
    if(playerList.length === 0) clearInterval(intervalId);
});

/**
 * Triggers at server stop.
 * Not necessary since clearInterval is already triggered at player disconnection, but i keep it for safety
 */
events.serverStop.on(() => clearInterval(intervalId));

/**
 * @param {string} messageToBroadcast
 */
function sendBroadcast(messageToBroadcast: string) {
    const packet = TextPacket.create();
    packet.type = TextPacket.Types.Raw; //Raw, Chat and Announcement TextPacket types do basically the same thing
    packet.message = settings.prefix + messageToBroadcast;
    playerList.forEach(netId => {
        packet.sendTo(netId);
    });
    packet.dispose();
}
