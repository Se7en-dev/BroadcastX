/*
          _____                    _
  ___  __|___  |__ _ __         __| | _____   __
 / __|/ _ \ / / _ \ '_ \ _____ / _` |/ _ \ \ / /
 \__ \  __// /  __/ | | |_____| (_| |  __/\ V /
 |___/\___/_/ \___|_| |_|      \__,_|\___| \_/

  BroadcastX - A simple BDSX plugin to automatically broadcast messages

 */

import { existsSync, readFileSync } from "fs";
import { events } from "bdsx/event";
import { CommandPermissionLevel, CommandRawText } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";

let playerList: NetworkIdentifier[] = Array();
let messageId: number = 0;
let intervalId: NodeJS.Timeout;

if(!existsSync(`${__dirname}/../resources/BroadcastXSettings.json`)) {
    console.error("[BroadcastX] Error : Settings file not found !".red);
} else {

    const settings = JSON.parse(readFileSync(`${__dirname}/../resources/BroadcastXSettings.json`).toString());

    command.register('broadcast', 'Broadcast a message', CommandPermissionLevel.Operator).overload((args) => {
        sendBroadcast(args.message.text);
    }, {
        message: CommandRawText
    });

    function startBroadcastTask() {
        if(!settings.random_order) messageId = 0;
        intervalId = setInterval(async() => {
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
    events.packetAfter(MinecraftPacketIds.Login).on((packet, netId) => {
        playerList.push(netId);
        if(playerList.length === 1) startBroadcastTask();
    });

    /**
     * Triggers on player disconnection
     */
    events.networkDisconnected.on(netId => {
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
     * Broadcasts a message to all players
     * @param {string} messageToBroadcast
     */
    function sendBroadcast(messageToBroadcast: string) {
        playerList.forEach(netId => {
            netId.getActor()?.sendMessage(messageToBroadcast);
        });
    }
}