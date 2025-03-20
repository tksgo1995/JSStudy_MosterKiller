const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 21;
const HEAL_VALUE = 20;

const MODDE_ATTACK = "ATTACK";
const MODDE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Maximum life for you and the monster.", "100");

let chosenMaxLife = parseInt(enteredValue);
if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };

    switch(ev){
        case LOG_EVENT_PLAYER_ATTACK:
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_MONSTER_ATTACK:
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "PLAYER";
            break;
        default:
            logEntry = {};
            break;
    }

    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame();
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK, 
        playerDamage, 
        currentMonsterHealth, 
        currentPlayerHealth
    );

    if(currentPlayerHealth < 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but the bonus life saved you!");
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You won!");
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            "PLAYER WON", 
            currentMonsterHealth, 
            currentPlayerHealth
        );
    }
    else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("You lost!");
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            "MONSTER WON", 
            currentMonsterHealth, 
            currentPlayerHealth
        );
    }
    else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("You have a draw!");
        writeToLog(
            LOG_EVENT_GAME_OVER, 
            "A DRAW", 
            currentMonsterHealth, 
            currentPlayerHealth
        );
    }

    if(currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        reset();
    }
}

function attackMonster(mode){
    const maxDamage = mode === MODDE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODDE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    writeToLog(
        logEvent, 
        damage, 
        currentMonsterHealth, 
        currentPlayerHealth
    );

    endRound();
}

function attackHandler() {
    attackMonster(MODDE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODDE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You can't heal to more than your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL, 
        healValue, 
        currentMonsterHealth, 
        currentPlayerHealth
    );
    endRound();
}

function printLogHandler(){
    for(const logEntry of battleLog){
        console.log(logEntry);
    }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);