
'use strict';

/**
Gopal kataria, © 2020

this is the main javascript file for the game
access functions and classes using alt+s in vscode
names are self describing ( at least for me )
no convention is followed
class names in CamelCase with snake_case functions
Classes were used for scalability

read slowley if not seen in code in a while

*/


class Sprite {


    /**
     * @description convert any object to a sprite for easy movement , Parent class of sprite ball
     * @param {String} id id of the object to convert to sprite
     */
    constructor(id) {

        this.obj = document.getElementById(id);


    }


    /**
     * @description getter for the coordinates of the sprite
     */
    get coords() {
        return this.obj.getBoundingClientRect();
    }

    /**
    * @description setter for the coordinates of the sprite
    */
    set coords(param) {
        throw Error(" You can not assign value to this variable ")
    }


    /**
     * @param {number} x x axis from top left
     */
    jump_x(x) {
        this.obj.style.left = x.toString() + "px"


    }

    /**
     * @param {number} y y axis from top left
     */
    jump_y(y) {

        this.obj.style.top = y.toString() + "px"

    }


    /**
     * @description Logging the coordinates for debugging purposes
     */
    log_coords() {

        console.log('[y]' + this.coords.y);
        console.log('[x]' + this.coords.x);

    }


}

class Coordinates {

    /**
     * @description Coordinate object to be suplied for the sprite class constructer, coordinates in which sprite is allowed to move
     * @param {Number} top_x top left corner's X coordinate
     * @param {Number} top_y top left corner's Y coordinate
     * @param {Number} bottom_x bottom right corner's X coordinate
     * @param {Number} bottom_y bottom right corner's Y coordinate
     */
    constructor(top_x, top_y, bottom_x, bottom_y) {

        this.top = {
            X: top_x,
            Y: top_y
        }

        this.bottom = {
            X: bottom_x,
            Y: bottom_y
        }

    }
}


/**
 * @constructor
 * @extends {Sprite}
 *
 */
class Sprite_ball {

    /**
     * @description Supercharge any element and conver it into a sprite, that can be moved and jumped
     * @param {string} id id of the element to convert into sprite
     * @param {Coordinates} coords coords in which the sprite is allowed to move
     */
    constructor(id, coords_allowed) {


        this.difficulty = 2;

        this.difficulty_incrementor = 2;


        this.gameIsRunning = false;

        this.score = 0

        this.__x = 30;
        this.__y = 30;

        this.coords_allowed = coords_allowed;

        this.speed = {
            x: 1,
            y: 1
        }


        this.direction = {
            top: "top",
            bottom: "bottom",
            left: "left",
            right: "right",

        }

    }


    /**
   * @description getter for the coordinates of the sprite
   */
    get coords() {
        return {
            x: this.__x,
            y: this.__y
        };
    }

    /**
    * @description setter for the coordinates of the sprite
    */
    set coords(param) {
        throw Error(" You can not assign value to this variable ")
    }


    /**
     * @param {number} x x axis from top left
     */
    jump_x(x) {


        this.__x = x;
        this.clear();

        Ctx.drawImage(Ball_img, x, this.__y);


    }

    /**
     * @param {number} y y axis from top left
     */
    jump_y(y) {

        this.__y = y;
        this.clear()
        Ctx.drawImage(Ball_img, this.__x, y);

    }

    /**
     * clear the canvas screen
     */
    clear() {
        Ctx.clearRect(0, 0, WxH.clientWidth, WxH.clientHeight)

    }

    /**
     * X axis speed , don't use speed.x .
     * alters the horizontal speed
     */
    get speed_x() {

        return this.speed.x;

    }

    /**
     * Y axis speed , don't use speed.y .
     * alters the vertical speed
     */
    get speed_y() {

        return this.speed.y;

    }


    set speed_x(speed) {

        this.speed.x = speed;

    }


    set speed_y(speed) {

        this.speed.y = speed;

    }



    /**
     * @description Move the ball
     */
    move() {

        if (this.gameIsRunning) {

            // onlyif game is runnig we'll draw the next frame

        let current_y = this.coords.y;
        let new_y = current_y + this.speed_y;

        let current_x = this.coords.x;
        let new_x = current_x + this.speed_x;


        // X - axis movement

        if (new_x > this.coords_allowed.top.X && new_x < this.coords_allowed.bottom.X) {
            this.jump_x(new_x)
        } else {



            if (this.speed_x < 0) {

                this.bounce(this.direction.left) // bounce only after the reversal
            } else if (this.speed_x > 0) {
                this.bounce(this.direction.right) // bounce only after the reversal
            }

        }






        // y axis movement with score count
        if (new_y > this.coords_allowed.top.Y && new_y < this.coords_allowed.bottom.Y) {
            this.jump_y(new_y)
        } else {


            if (this.speed_y < 0) {

                this.bounce(this.direction.top)


            } else if (this.speed_y > 0) {


                if (this.coords.x + 35 < Bouncer.safe_cord.max && this.coords.x + 35 > Bouncer.safe_cord.min) {

                    // bouncing and tapping up the score
                    this.bounce(this.direction.bottom)
                    this.score += 1
                    score_update(this.score)
                } else {
                    game_over();
                }

            }


        }
    }

    }


    stop() {

        this.speed_x = 0
        this.speed_y = 0
        this.gameIsRunning = false

        this.clear()

    }


    pause() {
        this.gameIsRunning = false;
        this.clear()
        this.score = 6
    }

    start() {

        Ball.gameIsRunning = true
        Ball.jump_x(50)
        Ball.jump_y(50)
        window.requestAnimationFrame(main_thread);
        if (this.speed_x == 0) { speed_init() }

    }


    /**
     * logs the bounce direction, has nothing to do with actual bounce at all
     *
     *
     * @param {String} direction direction relative to screen centre where ball bounced
     */
    bounce(direction) {
        // console.log(direction);


        if (direction == this.direction.left) {

            this.speed_x = - this.speed_x;




        } else if (direction == this.direction.right) {
            this.speed_x = - this.speed_x;



        } else if (direction == this.direction.top) {

            this.speed_y = (- this.speed_y);

            this.speed_x = this.rand_ang(this.speed_x)

            this.speed_y = this.rand_speed(this.speed_y)





        }
        else if (direction == this.direction.bottom) {

            this.speed_y = (- this.speed_y);

            this.speed_x = this.rand_ang(this.speed_x)

            this.speed_y = this.rand_speed(this.speed_y)

        }

        setTimeout('reset_all_sides()', 3100);


    }

    rand_ang(angle) {

        if (this.score % 2 == 0) {
            return angle + 0.5
        } else {
            return angle - 0.5
        }


    }

    rand_speed(speed) {

        if (speed > 10) {
            return 8;
        }
        if (speed < -10) {
            return -8;
        }

        let n_speed = 0;
        const change_speed = (this.difficulty / 25);


        if (this.score % this.difficulty_incrementor == 0) {
            n_speed = speed - change_speed;
        } else {
            n_speed = speed + change_speed;
        }

        if (this.score % 5 == 0) {

            this.difficulty += 1;
            this.difficulty_incrementor += 1;

        }




        return n_speed




    }


}


class Bouncer_sprite extends Sprite {

    /**
     *
     * @param {String} id id of the bouncer sprite
     */
    constructor(id) {
        super(id)

        this.safe = {
            min: this.coords.x - 10,
            max: this.coords.x + 110,
        }

        this.timehandler = null;
    }

    get safe_cord() {
        return this.safe;
    }

    get all() {
        return document.getElementsByClassName('bouncer')
    }

    set all(param) {
        throw Error(" you can not change the value of this variable ")
    }

    /**
     * takes mouse event and follows the user
     * @param {MouseEvent} e event cauth by the listener
     */
    follow_user(e) {

        let given_x = e.clientX;

        if (given_x < coords.top.X) {
            console.log(" out of bonds ")

            this.jump_x((coords.top.X))

        } else if (given_x > coords.bottom.X) {

            this.jump_x(coords.bottom.X - 20)


        } else {
            this.jump_x((given_x - 50))

        }

        this.safe = {
            min: this.coords.x - 10,
            max: this.coords.x + 110,
        }



    }

    /**
    * takes mouse event and follows the user on phone by touch
    * touch on left to move left and right to move right
    * kepps moving till mouseup evt
    * @param {MouseEvent} e event caugth by the listener
    */
    follow_user_phone(e) {


        const timeinterval = 10;






        if (this.coords.x + 40 < Ball.coords_allowed.bottom.X) {



            this.jump_x(e.clientX)

            console.log(e.clientX)

            this.safe = {
                min: this.coords.x - 10,
                max: this.coords.x + 110,
            }

        }


        if (this.coords.x > 20) {


            this.jump_x(e.clientX)
            this.safe = {
                min: this.coords.x - 10,
                max: this.coords.x + 110,
            }

        }




    }


}


/**
 *
 *
 * Here the class declaration are over and we start const declarations to use in the whole doc
 *
 * 🏛
 *
 *
*/




var WxH = document.getElementById('WxH')
var half = document.getElementById('half')

const Top = document.getElementById('top');
const Left = document.getElementById('left');
const Right = document.getElementById('right');



var canvas = document.createElement('canvas')
canvas.id = "canvas"
canvas.width = WxH.clientWidth
canvas.height = WxH.clientHeight

document.body.appendChild(canvas)


const Ctx = canvas.getContext('2d')
const Ball_img = document.getElementById('ball_img')

const Bouncer = new Bouncer_sprite('bouncer');

const coords = new Coordinates(
    20,
    20,
    WxH.clientWidth - 20 - 55,
    Number(Bouncer.coords.top.toFixed()) - 75
)




const Ball = new Sprite_ball('ball', coords);





const Sidebars = [Left, Top, Right]



// const declaration end here



/**

 * speed of the ball is defined over here throughout the game on restart as well as first start
 * tweak it here
 * it doen't affect during the gameplay
 */
function speed_init() {
    Ball.speed_x = 5;
    Ball.speed_y = 5;
}


function reset_all_sides() {
    for (let index = 0; index < Sidebars.length; index++) {
        const side = Sidebars[index];
        side.style.animation = ""

    }
}

//easter egg
// 🥚🐰
// stop the ball when s key is pressed on the keyboard
// start again when anything else is pressed on the keyboard



window.addEventListener('keypress', (e) => {
    if (e.key == 's' || 'S') {

        if ( ! Ball.gameIsRunning ) {
            Ball.start()
        } else {
            Ball.pause()
        }
    }

})



//checking if device is a mobile or not


if (!('ontouchstart' in window || navigator.msMaxTouchPoints)) {

    //it is not a mobile
    document.addEventListener('mousemove', e => {

        Bouncer.follow_user(e)

    });

} else {


    // it is a mobile
    WxH.addEventListener("mousedown", e => {
        Bouncer.follow_user(e)
    })






    half.addEventListener("mousedown", e => {
        Bouncer.follow_user(e)
    })




}


function game_over() {
    Ball.stop()
    Ball.gameIsRunning = false
    Ball.clear()
    score_update(0);

    document.getElementById('replay').style.display = "inline";
    document.getElementById('out_score').innerText = " Game \nOver \n Score : " + Ball.score;

}

// speeding here

speed_init()
Ball.gameIsRunning = true;





function replay() {

    document.getElementById('replay').style.display = "none";
    Ball.score = 0;
    Ball.start()

}


function score_update(score) {
    document.getElementById("score").innerText = score
}


var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;


console.log(width, " x ", height)





// regitering the service worker
if (navigator.serviceWorker) { // checking if the browser can use it
    window.addEventListener('load', function () {
        // registering
        console.log("trying to register service worker ")
        navigator.serviceWorker.register('/sw.js').then(function (register) {
            //successfully registered and logging
            console.log("service worker registered \n scope :" + register.scope)
        }).catch(function (err) {
            // catching any errors and logging
            console.error("service worker was not registered \n error : " + err)
        })
    })
};

function main_thread() {


    if (Ball.gameIsRunning) {

        window.requestAnimationFrame(main_thread);
    } else {

    }
    // main thread is here
    Ball.move()


}



document.getElementById('play').addEventListener('click', () => {

    window.setTimeout('Ball.start()', 500)

    document.getElementById('start').style.visibility = 'hidden'

})

document.getElementById('replay_btn').addEventListener('click', () => {


    speed_init();

    replay()

})


window.addEventListener("resize", function () {

    window.location.reload(false);

}, false);



