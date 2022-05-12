let active_fallers = [];
let burger_stack = [];
let toppings_allowed = [];
let lettuce_image, tomato_image, patty_image, onion_image, egg_image;
let skip_frame_counter = 0;
const faller_width = 100;
const faller_height = 70;
const catcher_width = 100;
let bottom_border_factor = 20;
let catcher_x;

// toppings class to store height and width of each topping
class Topping {
    constructor(image, height, width) {
        this.image = image;
        this.height = height;
        this.width = width;
    }
}

// ellipise falling from top of the screen to the bottom    
// random color, speed, and x cordinate assigned
class Faller {
    constructor( x_pos, y_pos, y_speed, topping ) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.y_speed = y_speed;
        this.topping = topping;
    }
    // move faller's position based on speed
    move() {
        // remove faller from list if out of screen
        if( this.y_pos > windowHeight+faller_width/2) {
            let index_to_remove = active_fallers.indexOf(this);
            active_fallers.splice(index_to_remove,1);
            delete this;
        }

        // advance faller
        this.y_pos += this.y_speed;
    }
    // display faller in the current position
    display() {
        imageMode(CENTER);
        image(this.topping.image, this.x_pos, this.y_pos, this.topping.width, this.topping.height);
    }
    // check if faller is colliding with the top of the stack
    // if so add to stack and remove from active fallers
    isColliding() {
        // check x_pos value is with X pixels of catcher
        if( abs(this.x_pos - catcher_x) < this.topping.height/2 ) {
            // check y_pos value is within X pixels of catcher
            let stack_height = burger_stack.length * this.topping.height * 1/3;
            if( abs(this.y_pos - (windowHeight - bottom_border_factor - stack_height) ) < this.topping.height/2 ) {
                // grab index of faller colliding
                const index_of_faller = active_fallers.indexOf(this);

                // remove faller from list of actice_fallers
                active_fallers.splice(index_of_faller,1);

                // add topping to stack
                burger_stack.push(this);
            }
        }
    }
}

// load background image
function preload() {
    lettuce_image = loadImage("images/lettuce_leaf.png");
    tomato_image = loadImage("images/tomato_slice.png");
    patty_image = loadImage("images/burger_patty.png");
    egg_image = loadImage("images/fried_egg.png");
    onion_image = loadImage("images/onion_slice.png");
}

// set p5 canvas
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    catcher_x = windowWidth / 2;

    // set up toppings array
    toppings_allowed.push( new Topping(lettuce_image, faller_height, faller_width) );
    toppings_allowed.push( new Topping(tomato_image, faller_height, faller_width) );
    toppings_allowed.push( new Topping(patty_image, faller_height, faller_width) );
    toppings_allowed.push( new Topping(egg_image, faller_height, faller_width) );
    toppings_allowed.push( new Topping(onion_image, faller_height, faller_width) );

}

// call this function each new frame
function draw() {

    // clear canvas
    clear();

    // run fallers and catcher
    runFallingStack();
}

// function to add new Faller to sky
function addFaller() {
    // set random x_pos and get negative y_pos
    let x_pos = Math.random()*(windowWidth - faller_width/2) + faller_width/2;
    let y_pos = -(faller_height/2);
    let y_speed = Math.floor( Math.random()* 7) + 3;
    
    // grab random topping
    let topping_index = Math.floor( Math.random()* toppings_allowed.length );
    let topping_to_add = toppings_allowed[topping_index];


    // create and add faller
    let faller_to_add = new Faller( x_pos, y_pos, y_speed, topping_to_add );
    active_fallers.push(faller_to_add);

}

// runs fallers and displays the stack
function runFallingStack() {

    // skip every XX frames and then add new faller
    if( skip_frame_counter == 50 ) {
        addFaller();
        skip_frame_counter = 0
     } else {
        skip_frame_counter++;
     }


    // display current fallers
    for( const faller of active_fallers ) {
        faller.move();
        faller.display();
        faller.isColliding();
    }

    controlCatcher();
    displayStack();
}

// displays the faller stack
function displayStack() {
    fill(0);
    let catcher_size = 150;
    rectMode(CENTER);
    rect(catcher_x, windowHeight-bottom_border_factor/2, catcher_size, bottom_border_factor)
    for( let i = 0; i < burger_stack.length; i++ ) {
        burger_stack[i].x_pos = catcher_x;
        burger_stack[i].y_pos = windowHeight - faller_height*i/3 - bottom_border_factor;
        burger_stack[i].display();
    }
}

// control catcher at the bottom on the screen
// - listen for arrow keys
// - listen for mouse movement
// - wrap catcher around screen
function controlCatcher() {
    // control catcher with arrow keys
    if(keyIsDown(LEFT_ARROW))
        catcher_x -= 15
    else if (keyIsDown(RIGHT_ARROW))
        catcher_x += 15
    
    // allow catcher to wrap around the screen
    if( catcher_x - catcher_width/2 > windowWidth )
        catcher_x = -(catcher_width/2)
    else if( catcher_x < -(catcher_width/2) )
        catcher_x = windowWidth + catcher_width/2

    // listen for mouse movement
    onMouseMove(); 
}

// Allows catcher to be controlled by mouse when moved
// uses arrowkeys otherwise otherwise
function onMouseMove() {
    var moved = false
    window.onmousemove = function(){
      if(!moved){
          moved = true;
          catcher_x = mouseX;
      }
   }
}

