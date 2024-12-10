import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer ({port:8080});
//connecting to the websocket server
const games = []; //current games going on (rooms)
 let waitingPlayer:WebSocket;//storing the websocket connection only
wss.on('connection',(ws)=>{
    ws.send("hello from server");
    ws.on('message',(message)=>{
        const data = JSON.parse(message.toString()) //converting the buffer to the string(json format) then to the object 
        const {type, payload} = data;
        if(type === 'JOIN_GAME'){
            if(!waitingPlayer){
                waitingPlayer = ws;
                console.log("added to the queue")
                ws.send('please wait for a while we find an opponent for you')
            }
            else{
                startGame(ws,waitingPlayer);
                //informing both player that game started
                players.player1?.send('game started');
                players.player2?.send('game started');

            }
        }
    if(type === 'ROLL_DICE'){
        if(ws === players['player1'] && gameState['turns']['player1']){
            ws.send('not your turn'); //do ws.send works as return (as i need to return from here)
            console.log("Player2: not your turn")
        }
        if(ws === players['player2'] && !gameState['turns']['player2']){
            ws.send('not your turn'); //do ws.send works as return (as i need to return from here)
            console.log("Player2: not your turn")
        }

        const diceShow = Math.floor(Math.random()*7);
        if(ws === players['player1']){
            gameState['board']['player1'] = gameState['board']['player2'] + diceShow;
            gameState['turns'].player1 = ! gameState['turns'].player1 ;
            gameState['turns'].player2 = ! gameState['turns'].player2 ;//making turn to false

            console.log(diceShow);
            console.log(gameState['board'])
        }
        ws.send(JSON.stringify({type:'score',data:gameState['board']}))//sending the scores

        if(ws === players['player2']){
            gameState['board']['player2'] = gameState['board']['player2'] + diceShow;
            gameState['turns'].player1 = ! gameState['turns'].player1 ;//making turn to false
            gameState['turns'].player2 = ! gameState['turns'].player2 ;//making turn to false

            console.log(diceShow);
            console.log(gameState['board'])
        }
    }

    })
    ws.on('disconnect',()=>{
        console.log('deleted',ws)
    })

});
interface Players{
    player1:WebSocket | null;
    player2:WebSocket | null;
}
let players: Players = {
        player1:null,
        player2:null
}
let gameState= {
    board :{
        player1:0,
        player2:0
    },
    turns:{
        player1:true,
        player2:false,
    }
}
function startGame(firstPlayer:WebSocket, secondPlayer:WebSocket ) {
    console.log('game sarted');
    //set the players
    players['player1'] = firstPlayer,
    players['player2'] = secondPlayer
}








//1. start a wss server
//2. create a game - using class or something else