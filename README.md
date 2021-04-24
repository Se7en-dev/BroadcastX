# BroadcastX - A BDSX Plugin

BroadcastX is a simple BDSX Plugin that lets you automatically broadcast messages at a configurable interval of time !



---

## Features

- Broadcast messages automatically

- Broadcast command



## Configuration

You can configure everything within [`/resources/BroadcastXSettings.json`](resources/BroadcastXSettings.json) :

```json
{
  "prefix": "§9[Broadcast] §r",
  "broadcast_interval": 300,
  "messages": [
    "Hello, world !",
    "BDSX is awesome !",
    "Birds aren't real"
  ],
  "random_order": false
}
```

| Value                | Type     | Description                                   | Notes                                          |
| -------------------- | -------- | --------------------------------------------- | ---------------------------------------------- |
| `prefix`             | String   | Broadcast messages start with this value      | Leave blank for no prefix                      |
| `broadcast_interval` | Integer  | Time interval, in seconds, between broadcasts |                                                |
| `messages`           | String[] | Messages to broadcast                         |                                                |
| `random_order`       | Bool     | Broadcast messages in a random order          | If disabled, messages are broadcasted in order |

## Broadcast command

Use `/broadcast <message>` to broadcast a message !

- Only server operators can see and use this command

- Command blocks can execute this command !
  
  

## Installation and usage

Clone the repository into your BDSX folder :

```shell
git clone https://github.com/Se7en-dev/BroadcastX.git
```

or download and extract the zip file from [Releases](https://github.com/Se7en-dev/BroadcastX/releases).



Add this line within `index.ts` :

```typescript
import './BroadcastX';
```



##### Configure the plugin to your liking and enjoy !

---

### License

This plugin is licensed under **GNU General Public License v3.0**

Thank you for using my plugin ! If you have any questions add me on Discord : `Se7en#9999`