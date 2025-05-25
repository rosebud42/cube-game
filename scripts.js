// Frank Poth 08/13/2017
const date = new Date();
var context, controller, loop;
let isMusicPaused = false;
let currentMusic = null;
context = document.querySelector("canvas").getContext("2d");
var stepSound = new sound("sound-effects/step.wav");
var jumpSound = new sound("sound-effects/jump.mp3");
var deathSound = new sound("sound-effects/death.mp3");
var victorySound = new sound("sound-effects/victory.mp3");
var songs = [
    new sound("sound-effects/songs/song1.mp3"),
    new sound("sound-effects/songs/song2.mp3"),
];
let startTime = date.getMilliseconds();
let currentSongIndex = 0;
let musicStarted = false;
var ground = 16;
context.canvas.height = 540;
context.canvas.width = 960;
let players_involved =  [ // küplerin dahil olduğu bölümlerin listeleri
    [1,2,3,4,5,6,7,8,9,10],
    [5,6,7,8,9,10],

]
const spawnPoints = { // her bölüm için küplerin doğacağı konumlar
    1: [ 
        { x: 50, y: 300 }, 
        { x: 0, y: 0 }  
    ],
    2: [
        { x: 50, y: 300 },
        { x: 0, y: 0 }
    ],
    3: [ 
        { x: 50, y: 300 }, 
        { x: 0, y: 0 }  
    ],
    4: [
        { x: 50, y: 300 },
        { x: 0, y: 0 }
    ],
    5: [ 
        { x: 50, y: 300 }, 
        { x: 90, y: 360 }  
    ],
    6: [
        { x: 50, y: 300 },
        { x: 700, y: 50 }
    ],
    7: [
        { x : 20, y: 480},
        { x : 80, y: 480}
    ],
    8: [
        {x : 400, y: 0 },
        {x : 20, y: 166}
    ],
    9:[
        {x: 50 , y:150},
        {x: 50 , y:400}
    ],
    10:[
        { x: 50, y: 300 }, 
        { x: 100, y: 300 }  
    ]

    
};

players=[ {

    height: 32,
    jumping: true,
    width: 32,
    x: 50, // center of the canvas
    x_velocity: 0,
    y: 100,
    y_velocity: 0,
    jumpCount: 0,
    grow_height: true,
    ePressed: false,   

},
{

    height: 32,
    jumping: true,
    width: 32,
    x: 10, // center of the canvas,
    x_velocity: 0,
    y: 100,
    y_velocity: 0,
    jumpCount: 0,
    grow_height: true,
    ePressed: false,  

}   ];
game = {
    level : 1,
    fail_count :0,
}
let activePlayerIndex = 0; // hangi küp aktif
let rectangle = players[activePlayerIndex];

var platform_levels = { // bölümlerdeki temel yer konumları 
    1: [{x: 0, width: context.canvas.width }],
    2: [{x: 0, width: context.canvas.width }],
    3: [{x: 0, width: 200 },{ x: 450, width: 530 },],
    4: [{x: 0, width: 200 }],
    5: [{x: 0, width: 500}],
    6: [{x:750, width: 300}],
    7: [{x:0, width: 400}],
    8: [{x:200, width:960}],
    9: [{x:0, width:300},{x:550, width:500}],
    10: [{x:0, width:250}]


}

 
var wall_levels = { // bölümlerdeki duvar ve diğer zemin konumları
    1: [
        { x: 300, y: 315, width: 20, height: 200 },
    ],
    2: [
        { x: 600, y: 450, width: 20, height: context.canvas.height-450-16 }
    ],
    4: [
        { x: 300, y: 492, width: 24, height: 48 },
        { x: 300, y: 0, width: 24, height: 342 },

        { x: 430, y: 450, width: 24, height: 48 },
        { x: 430, y: 0, width: 24, height: 300 },

        { x: 560, y: 408, width: 24, height: 48},

        { x: 718, y: 360, width: 350, height: 300},
        { x: 720, y: 0, width: 350, height: 350},
    ],
    5: [
        { x: 500, y:250, width:460,height:350},
    ],
    6: [
        { x: 660, y: 100, width:400,height:400},
        { x: 944, y: 0, width:16,height:200},
        { x:0, y:526,width:300,height:300},
    ],
    7:[
        { x:900, y: 250, width:60, height:16}
    ],
    8: [

        { x:0, y: 198, width:150,height:16},
        { x:800,y: 198, width:200,height:16},
        { x:930,y: 214,width:30,height:600}
    ],
    9: [
        { x:0,y:200,width:420,height:16},
        { x:430,y:200,width:1000,height:16},
        { x:944,y:0,width:16,height:200},
        { x:410,y:216,width:10,height:200},
        { x:430,y:216,width:10,height:200},
        { x:920,y:300,width:40,height:224}
    ],
    10: [
        { x: 300, y:500, width:40,height:40},
        { x: 400, y:440, width:40,height:40},
        { x: 500, y:380, width:40,height:40},
        { x: 600, y:320, width:40,height:40}, //
        { x: 900, y:245, width:60,height:50},
        { x: 800, y:190, width:40,height:40},
        { x: 650, y:190, width:40,height:40},
        { x: 450, y:190, width:90,height:40},
        { x: 250, y:350, width:70,height:40},
        { x: 220, y:300, width:30,height:90},
        { x: 190, y:250, width:30,height:90},
        { x: 160, y:200, width:30,height:90},
        { x: 130, y:150, width:30,height:90},
        { x: 0, y:100, width:130,height:90},




        { x:300, y:80, width:1000,height:16},
        { x:950, y:80, width:10,height:1000}

    ]
}; 
tutorial_text(game.level);//ilk tutorial yazısını vermek için
var only_x = [ // küplerin sadece x eksenine büyüyebildiği bölümler
    [10],
    [10]
]
var only_y = [ // küplerin sadece y eksenine büyüyebildiği bölümler
    [1,4,8],
    [8]
]
var no_scaling = [8] // küplerin büyüme küçülme yapamadığı bölümler

function sound(src) { // arkaplan şarkılarının çalınması için
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}   


controller = {

    left: false,
    right: false,
    up: false,
    wasUp: false,
    mPressed: false,

    keyListener: function(event) {

        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {

            case 37 : // sol ok 
            case 65: // A 
                controller.left = key_state;
                break;

            case 32: // yukarı ok
            case 87: // w
            case 38: // space
                controller.up = key_state;
                break;
            case 39: // sağ ok
            case 68: // D 
                controller.right = key_state; 
                break;

            case 69: // E  büyüme yönü değişmesi için
                if (key_state && !controller.ePressed) {
                    if(!(only_x[activePlayerIndex].includes(game.level) || only_y[activePlayerIndex].includes(game.level))){
                        controller.ePressed = true;
                        rectangle.grow_height = !rectangle.grow_height;
                    }
                }
                if (!key_state) {
                    controller.ePressed = false;
                }
                break;
            case 81: // Q küp aralarında değişiklik
                let canSwitch = true;
                if (key_state) { 
                    for(let i =0;i<players.length;i++){
                        if(!players_involved[i].includes(game.level)){ // iki kübünde levelde olup olmadığı kontrol edilip ona göre switche izin veriliyor.
                            canSwitch = false;
                        }
                    }
                    if(canSwitch){
                        activePlayerIndex = (activePlayerIndex + 1) % players.length;
                        rectangle = players[activePlayerIndex];
                    }
                }
                break;
            case 77: // M  müziği durdurup başlatma 
                if (key_state && !controller.mPressed) {
                    controller.mPressed = true;

                    if (!currentMusic) return;

                    if (isMusicPaused) {
                        currentMusic.sound.play();
                    } else {
                        currentMusic.sound.pause();
                    }

                    isMusicPaused = !isMusicPaused;
                }
                if (!key_state) {
                    controller.mPressed = false;
                }
                break;


        }

    }

};

window.addEventListener("wheel", function(event) { // büyüme fonksiyonu için mouse tekerleği dinleniyor
    if(no_scaling.includes(game.level)){ // büyümenin yasaklı olduğu bölüm için return yapılıyor 
        return; 
    }
    let prevHeight = rectangle.height;
    let prevWidth = rectangle.width;

    const walls = wall_levels[game.level] || [];

    
    let canGrow = true;

    if(rectangle.grow_height){

        let newHeight = rectangle.height + (event.deltaY < 0 ? 3 : -3); // büyümeden önce büyünecek konum hesaplanıyor

        // hesaplanan konumda büyümesini engelleyen bir şey var mı kontrolü yapılıyor
        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];

            let willCollideUp = (
                rectangle.x + rectangle.width > w.x &&
                rectangle.x < w.x + w.width &&
                rectangle.y + prevHeight - newHeight < w.y + w.height &&
                rectangle.y > w.y 
            );

            if (willCollideUp) {
                canGrow = false;
                break;
            }
        }

        // büyüme sınırında değilse veya diğer nesnelere çarpmıyorsa büyümeye izin veriliyor
        if (event.deltaY < 0 && rectangle.height < 250 && canGrow) {
            let oldHeight = rectangle.height;
            rectangle.height += 3;
            rectangle.y -= (rectangle.height - oldHeight); 
        }   
        else if (event.deltaY > 0 && rectangle.height > 10) {
            rectangle.height -= 3;
        }
        

        } else {
            // aynı kontroller genişlik için yapılıyor
            let newWidth = rectangle.width + (event.deltaY < 0 ? 3 : -3);

            for (let i = 0; i < walls.length; i++) {
                let w = walls[i];

                let willCollideSide = (
                    rectangle.y + rectangle.height > w.y &&
                    rectangle.y < w.y + w.height &&
                    (
                        (rectangle.x < w.x && rectangle.x + newWidth > w.x) || // sağ duvara çarpma
                        (rectangle.x > w.x && rectangle.x < w.x + w.width && rectangle.x - (newWidth - rectangle.width) < w.x + w.width) // sol duvara çarpma
                    )
                );

                if (willCollideSide) {
                    canGrow = false;
                    break;
                }
            }

            if (event.deltaY < 0 && rectangle.width < 250 && canGrow) {
                rectangle.width += 3;
            } else if (event.deltaY > 0 && rectangle.width > 10) {
                rectangle.width -= 3;
            }
        }

        // küp büyüdükten sonra dünyadan düşmemesi için kontrol
        const platforms = platform_levels[game.level] || [];
        let groundY = context.canvas.height - ground;

        for (let i = 0; i < platforms.length; i++) {
            let p = platforms[i];

            if (
                rectangle.x + rectangle.width > p.x &&
                rectangle.x < p.x + p.width &&
                rectangle.y + prevHeight >= groundY &&
                rectangle.y + prevHeight <= groundY + 10
            ) {
                rectangle.y = groundY - rectangle.height;
            }
        }

        // küp büyürken kafası bir şeye çarpars durması için 
        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];

            if (
                rectangle.x + rectangle.width > w.x &&
                rectangle.x < w.x + w.width &&
                rectangle.y + prevHeight >= w.y &&
                rectangle.y + prevHeight <= w.y + 10
            ) {
                rectangle.y = w.y - rectangle.height;
            }
        }
        // diğer küplere fiziksel çarpışmalar
        for (let i = 0; i < players.length; i++) {
            if (i === activePlayerIndex || !players_involved[i].includes(game.level)) continue;

            let other = players[i];

            let collides = (
                rectangle.x < other.x + other.width &&
                rectangle.x + rectangle.width > other.x &&
                rectangle.y < other.y + other.height &&
                rectangle.y + rectangle.height > other.y
            );

            if (collides) {
                if (rectangle.grow_height) {
                    // üstünde küp varken büyürse üstündekini taşıyor
                    let delta = rectangle.height - prevHeight;
                    other.y -= delta;
                } else {
                    // yanında küp varken büyürse yana itiyor
                    let delta = rectangle.width - prevWidth;
                    if (rectangle.x < other.x) {
                        other.x += delta;
                    } else {
                        other.x -= delta;
                    }
                }
            }
        }
});



function playNextSong(){ // arkaplan müziğini tekrarlı çalmak için
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0; // Baştan başla
    }

    currentMusic = songs[currentSongIndex]; // aktif müziği kaydet
    currentMusic.sound.loop = false;
    currentMusic.play();

    currentMusic.sound.onended = function () {
        currentSongIndex++;
        playNextSong();
    };
}

loop = function() { 

    let headBlocked = false;
    for(let i =0;i<players.length;i++){ // küplerin hangi yöne büyüyebildiklerinin kontrolü yapılıp ona göre son büyüme yönleri veriliyor
        if(only_x[i].includes(game.level)){
            players[i].grow_height = false;
        }else if(only_y[i].includes(game.level)){
            players[i].grow_height = true;
        }
    }

    if (controller.up && !controller.wasUp && rectangle.jumpCount < 2) { // zıplama , jumpcount<2 doublejump için 

    const walls = wall_levels[game.level] || [];

        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];

            let collidesAbove = (
                rectangle.x + rectangle.width > w.x &&
                rectangle.x < w.x + w.width &&
                rectangle.y > w.y + w.height &&
                rectangle.y - 5 < w.y + w.height
            );

            if (collidesAbove) {
                headBlocked = true;
                break;
            }
        }

        // diğer küple kafa çarpışma kontrolü
        for (let i = 0; i < players.length; i++) {
            if (i === activePlayerIndex || !players_involved[i].includes(game.level)) continue;

            let other = players[i];

            let collidesAbove = (
                rectangle.x + rectangle.width > other.x &&
                rectangle.x < other.x + other.width &&
                rectangle.y > other.y + other.height &&
                rectangle.y - 5 < other.y + other.height
            );

            if (collidesAbove) {
                headBlocked = true;
                break;
            }
        }

        if (!headBlocked) {
            if(game.level==10){
                rectangle.y_velocity = -10.5  ; // 10.bölüm ekstra yüksek zıplama
            }else{
                rectangle.y_velocity = -8;
            }
            if(rectangle.height > 32){
                rectangle.y_velocity -= rectangle.height * 0.02;
            }
            jumpSound.play();
            rectangle.jumping = true;
            rectangle.jumpCount++;
        }
    }





    controller.wasUp = controller.up;

    if (controller.left) { //sola yürüme 
        stepSound.play();
        rectangle.x_velocity -= 0.2;
    }

    if (controller.right) { // sağa yürüme
        stepSound.play();
        rectangle.x_velocity += 0.2;
    }

    for (let i = 0; i < players.length; i++) {
        if (!players_involved[i].includes(game.level)) continue;

        let p = players[i];
        p.y_velocity += 0.5; // yer çekimi
        p.x_velocity *= 0.9; // x sürtünme
        p.y_velocity *= 0.9; // y sürtünme 
    }

    // hareket etmeden önce çarpışma tespiti
    let nextX = rectangle.x + rectangle.x_velocity;
    let nextY = rectangle.y + rectangle.y_velocity;

    const walls = wall_levels[game.level] || [];
    
    for (let i = 0; i < walls.length; i++) {
        let w = walls[i];

        let collidesX = nextX < w.x + w.width && nextX + rectangle.width > w.x;
        let collidesY = nextY < w.y + w.height && nextY + rectangle.height > w.y;

        if (collidesX && collidesY) {

            if (rectangle.y + rectangle.height <= w.y && rectangle.y_velocity >= 0) {// dikey çarpışma kontrolü (üstüne düşme)
                nextY = w.y - rectangle.height;
                rectangle.y_velocity = 0;
                rectangle.jumping = false;
                rectangle.jumpCount = 0;
            }

            else if (rectangle.x + rectangle.width <= w.x && rectangle.x_velocity > 0) {// sağdan çarpma
                nextX = w.x - rectangle.width;
                rectangle.x_velocity = 0;
            }

            else if (rectangle.x >= w.x + w.width && rectangle.x_velocity < 0) { // soldan çarpma
                nextX = w.x + w.width;
                rectangle.x_velocity = 0;
            }
        }
    }
    const platforms = platform_levels[game.level] || [];
    let groundY = context.canvas.height - ground;

    for (let i = 0; i < players.length; i++) {
        if (!players_involved[i].includes(game.level)) continue;

        let p = players[i];
        let px = p.x;
        let py = p.y;

        if (i === activePlayerIndex) {
            px = rectangle.x + rectangle.x_velocity;
            py = rectangle.y + rectangle.y_velocity;
        }

        let grounded = false;

        for (let j = 0; j < platforms.length; j++) { // platforma temas kontrolü
            let plat = platforms[j];

            if (
                px + p.width > plat.x &&
                px < plat.x + plat.width &&
                py + p.height >= groundY &&
                py + p.height <= groundY + 10
            ) {
                p.y = groundY - p.height;
                p.y_velocity = 0;
                grounded = true;

                if (i === activePlayerIndex) {
                    nextY = p.y;
                }

                break;
            }
        }

        if (!grounded) { // diğer oyuncunun üstünde durma kontrolü
            for (let k = 0; k < players.length; k++) {
                if (k === i || !players_involved[k].includes(game.level)) continue;

                let other = players[k];

                let horizontallyAligned = px + p.width > other.x &&
                                        px < other.x + other.width;

                let feetOnHead = py + p.height >= other.y &&
                                py + p.height <= other.y + 10; // +-10 tolerans

                if (horizontallyAligned && feetOnHead) {
                    p.y = other.y - p.height;
                    p.y_velocity = 0;
                    grounded = true;

                    if (i === activePlayerIndex) {
                        nextY = p.y;
                    }

                    break;
                }
            }
        }

        if (!grounded) {
            for (let j = 0; j < walls.length; j++) {
                let w = walls[j];

                let horizontallyAligned = px + p.width > w.x &&
                                        px < w.x + w.width;

                let feetOnWall = py + p.height >= w.y &&
                                py + p.height <= w.y + 10;

                if (horizontallyAligned && feetOnWall) {
                    p.y = w.y - p.height;
                    p.y_velocity = 0;
                    grounded = true;

                    if (i === activePlayerIndex) {
                        nextY = p.y;
                    }

                    break;
                }
            }
        }

        // yere bastıysa sıfırla
        if (grounded) {
            p.jumping = false;
            p.jumpCount = 0;
        }
    }


    
    // diğer oyuncularla çarpışma kontrolü
    for (let i = 0; i < players.length; i++) {
        if (i === activePlayerIndex || !players_involved[i].includes(game.level)) continue;

        let other = players[i];

        let willCollideX = nextX < other.x + other.width && nextX + rectangle.width > other.x;
        let willCollideY = nextY < other.y + other.height && nextY + rectangle.height > other.y;

        if (willCollideX && willCollideY) {

            // dikey çarpışmalar
            if (rectangle.y + rectangle.height <= other.y && rectangle.y_velocity > 0) {
                nextY = other.y - rectangle.height;
                rectangle.y_velocity = 0;
                rectangle.jumping = false;
                rectangle.jumpCount = 0;
            } else if (rectangle.y >= other.y + other.height && rectangle.y_velocity < 0) {
                nextY = other.y + other.height;
                rectangle.y_velocity = 0;
            }

            // yatay çarpışmalar
            if (rectangle.x + rectangle.width <= other.x && rectangle.x_velocity > 0) {
                nextX = other.x - rectangle.width;
                rectangle.x_velocity = 0;
            } else if (rectangle.x >= other.x + other.width && rectangle.x_velocity < 0) {
                nextX = other.x + other.width;
                rectangle.x_velocity = 0;
            }
        }
    }
    
    for (let i = 0; i < players.length; i++) {
        if (!players_involved[i].includes(game.level)) continue;

        if (i === activePlayerIndex) {
            players[i].x = nextX;
            players[i].y = nextY;
        } else {
            players[i].x += players[i].x_velocity;
            players[i].y += players[i].y_velocity;
        }
    }  



    // küp dünyadan aşağıya düşerse
    for(let i=0;i<players.length;i++){
        cube = players[i];
        if (cube.y > context.canvas.height+200) {
            deathSound.play();
            game.fail_count++;
            spawnPlayersForLevel(game.level);
        }
    }
    if(rectangle.x > context.canvas.width){ // bölüm geçilirse
        victorySound.play();
        game.level++;

        spawnPlayersForLevel(game.level); // spawn noktası uygula
        tutorial_text();    
    }
    if(rectangle.x <=0){
        rectangle.x =0; // küp mapin soluna gidemesin
    } 

    context.fillStyle = "#c1e1e6";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height); 
    if(rectangle.grow_height){
        context.fillStyle = "#192c70" // dikey büyüme rengi 
    }else{
        context.fillStyle = "#f29500"; // yatay büyüme rengi
    }
    for (let i = 0; i < players.length; i++) {
        if(players_involved[i].includes(game.level)){ // oyuncu o levelda spawn olmalı mı kontrolü 

            let player = players[i];
            context.fillStyle = (i === activePlayerIndex) 
                ? (player.grow_height ? "#192c70" : "#f29500") 
                : "#242526"; //deaktif rengi

            context.beginPath();
            context.rect(player.x, player.y, player.width, player.height);
            context.fill();
        }
    }
    level_design();
        context.font = "24px Arial";
        context.fillStyle = "white";

    if(level==11){
        context.font = "30px Arial";         
        context.fill = "white";
        context.textAlign = "center";          

        context.fillText("Congrats! You Finished The Game!", 480, 190 );
        context.fillText("Total Fails: "+ game.fail_count, 480, 250 );
        context.fillText("You Won Nothing", 480, 310 );
        context.fillText("Made by Efekan Aksoy", 480, 370 );
    }else{
        context.fillText("Level "+ game.level,0,24);
        context.fillText("Fail "+ game.fail_count,850,24)
    }

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);

};

function level_design() {
    level = game.level;
    const platforms = platform_levels[level] || [];
    const walls = wall_levels[level] || [];

    // platformlar
    context.fillStyle = "#444444";
    for (let i = 0; i < platforms.length; i++) {
        let p = platforms[i];
        context.fillRect(p.x, context.canvas.height - ground, p.width, ground);
    }

    // duvarlar
    context.fillStyle = "#800303";
    for (let i = 0; i < walls.length; i++) {
        let w = walls[i];
        context.fillRect(w.x, w.y, w.width, w.height);
    }
}


window.addEventListener("keydown", () => { //bir tuşa basmadan müzik başlamadığı için çözüm
    if (!musicStarted) {
        playNextSong();
        musicStarted = true;
    }
});
function tutorial_text(){ //oyunun üstündeki tutorial yazıları
    level = game.level;
    text = document.getElementById("tutorial");
    switch (level){
        case 1:
            text.innerHTML="Use your mouse wheel to grow up or grow down!"
            break;
        case 2:
            text.innerHTML="The higher you are the higher you can jump! Jump twice to double jump!";
            break;
        case 3:
            text.innerHTML="Press 'E' to change your growing direction.";
            break;
        case 4:
            text.innerHTML="Your muscles are not enough! Use your brain. <br>You are not allowed to grow sideways.";
            break;
        case 5:
            text.innerHTML="Meet your new cube buddy! Press 'Q' to switch between cubes!";
            break; 
        case 6:
            text.innerHTML="Now you are on your own! Dont forget, one cube pass is enough.";
            break;
        case 7:
            text.innerHTML="";
            break;
    }
}

function levelFailed(){ // level geçilemezse yeniden başlama
    level = game.level;
    for(let i=0;i<players.length;i++){
        player = players[i];
        if (players_involved[i].includes(level)){
            player.x = players_spawning_location[i][level-1][0];
            player.y = players_spawning_location[i][level-1][1];
            player.height = 32;
            player.width = 32;
        }
    }
    game.fail_count++;
    deathSound.play();
}


function spawnPlayersForLevel(level) { // küplerin başlangıç noktalarını ayarlayıp sıfırlayan fonksiyon
    const spawns = spawnPoints[level] || [];
    let ending_time;
    ending_time = date.getMilliseconds;

    spend_time = ending_time-startTime;
    console.log(spend_time*100);

    players.forEach((player, index) => {
        const spawn = spawns[index];
        if (spawn) {
            player.x = spawn.x;
            player.y = spawn.y;
        } else {
            player.x = 0;
            player.y = 0;
        }   
        if(level==8){
            players[0].height=300;
            players[0].width=50;
            players[1].height=32;
            players[1].height=32;
        }else{
        player.height = 32;
        player.width = 32;}

        // Oyuncu durumunu sıfırla
        player.x_velocity = 0;
        player.y_velocity = 0;
        player.jumpCount = 0;
        player.jumping = false;
        player.width = 32;
        player.height = 32;
        player.grow_height = true;
    });
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
