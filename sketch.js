// movement variables
let active_fallers = [];
let burger_stack = [];
let toppings_allowed = [];
let lettuce_image, tomato_image, patty_image, onion_image, ketchup_image, mustard_image, pickles_image;
let skip_frame_counter = 0;
const faller_width = 100;
const faller_height = 70;
const catcher_width = 100;
let bottom_border_factor = 40;
let catcher_x;
let condiment_count = 0;

// game aspect variables
let score = 0;
let current_order = [];
let current_order_count = {};
let topping_image_access = {};
let min_order_toppings = 5;
let max_order_toppings = 10;
let lives_left = 3;

// toppings class to store height and width of each topping
class Topping {
    constructor(image, height, width, name) {
        this.image = image;
        this.height = height;
        this.width = width;
        this.name = name;
    }
}

// topping falling from top of the screen to the bottom    
// random topping, speed, and x cordinate assigned
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
            let stack_height = burger_stack.length * this.topping.height * 1/5 - condiment_count * 20;
            if( abs(this.y_pos - (windowHeight - bottom_border_factor - stack_height) ) < this.topping.height/2 ) {
                // grab index of faller colliding
                const index_of_faller = active_fallers.indexOf(this);

                // remove faller from list of actice_fallers
                active_fallers.splice(index_of_faller,1);

                // add topping to stack
                burger_stack.push(this);

                // check if topping is top_bun
                if(this.topping.name != "top_bun") {
                    // check if topping is in order
                    checkIfInOrder(this.topping)
                } else {
                    // topping is top bun
                    // execute end function
                    topBunHit();
                }
            }
        }
    }
}
// top bun has been found
// check if order matches burger_stack
// if yes add point
function topBunHit() {
    // copy burger_stack and sort
    let burger_stack_copy = [];
    for( let i = 0; i < burger_stack.length; i++ ) {
        burger_stack_copy[i] = burger_stack[i].topping.name;
    }
    burger_stack_copy.sort();
    // splice out top_bun to compare to order
    burger_stack_copy.splice( burger_stack_copy.indexOf("top_bun") )

    // copy order and sort
    let current_order_copy = [];
    for( let i = 0; i < current_order.length; i++ ) {
        current_order_copy[i] = current_order[i].name;
    }
    current_order_copy.sort();
    

    // make sure stack and order are same length as preliminary check and to safely access each eleemnt
    if( current_order_copy.length != burger_stack_copy.length )
        orderNotFilled();
    else {
        // make sure each element matches
        let order_filled = true;
        for( let i = 0; i < burger_stack_copy.length; i++ ) {
            if( burger_stack_copy[i] != current_order_copy[i]) {
                orderNotFilled();
                order_filled = false;
                i = burger_stack_copy.length;
            }
        }

        // if order is filled call orderFilled()
        if( order_filled == true )
            orderFilled()
    }
}

// called when top bun is hit but order is not completed
function orderNotFilled() {
    lives_left--;
    if(lives_left == 0) {
        alert("you are not a good fry cook");
        lives_left = 3;
    }
    burger_stack = [];
    getOrder();
}

// called when top is hit and order is completed
function orderFilled() {
    console.log("ORDER FILLED")
    burger_stack = [];
    getOrder();
    score++;
}

// check if a given faller.topping is needed to complete the order
// if so decrement the counter
function checkIfInOrder( topping ) {

    // check if topping is needed
    if( topping.name in current_order_count && current_order_count[topping.name] != 0) {
        current_order_count[topping.name]--;
    }
}

function preload() {

    // load burger images
    lettuce_image = loadImage("images/lettuce.png");
    tomato_image = loadImage("images/tomato_slice.png");
    patty_image = loadImage("images/burger_patty.png");
    onion_image = loadImage("images/onions.png");
    cheese_image = loadImage("images/cheese_slice.png");
    top_bun_image = loadImage("images/top_bun.png");
    bottom_bun_image = loadImage("images/bottom_bun.png");
    ketchup_image = loadImage("images/ketchup.png");
    mustard_image = loadImage("images/mustard.png");
    pickles_image = loadImage("images/pickles.png");

}

function setup() {
    
    // set p5 canvas
    createCanvas(windowWidth, windowHeight);
    
    // adjust framerate
    frameRate(30);

    // place catcher in center of screen
    catcher_x = windowWidth / 2;

    // set up toppings array
    toppings_allowed.push( new Topping(lettuce_image, faller_height, faller_width, "lettuce") );
    topping_image_access["lettuce"] = lettuce_image;
    toppings_allowed.push( new Topping(tomato_image, faller_height, faller_width, "tomato") );
    topping_image_access["tomato"] = tomato_image;
    toppings_allowed.push( new Topping(patty_image, faller_height, faller_width, "patty") );
    topping_image_access["patty"] = patty_image;
    toppings_allowed.push( new Topping(onion_image, faller_height, faller_width, "onion") );
    topping_image_access["onion"] = onion_image;
    toppings_allowed.push( new Topping(cheese_image, faller_height, faller_width, "cheese") );
    topping_image_access["cheese"] = cheese_image;
    toppings_allowed.push( new Topping(top_bun_image, faller_height, faller_width, "top_bun") );
    topping_image_access["top_bun"] = top_bun_image;
    toppings_allowed.push( new Topping(ketchup_image, faller_height, faller_width, "ketchup") );
    topping_image_access["ketchup"] = ketchup_image;
    toppings_allowed.push( new Topping(mustard_image, faller_height, faller_width, "mustard") );
    topping_image_access["mustard"] = mustard_image;
    toppings_allowed.push( new Topping(pickles_image, faller_height, faller_width, "pickle") );
    topping_image_access["pickle"] = pickles_image;


    /* FUCK AROUND ZONE */

    getOrder();

    /* FUCK AROUND ZONE */

}

// call this function each new frame
function draw() {

    // clear canvas
    clear();

    // run fallers and catcher
    runFallingStack();

    // run and control game
    runGame();
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
    if( skip_frame_counter == 25 ) {
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
    let catcher_size = 100;
    imageMode(CENTER);
    image(bottom_bun_image, catcher_x, windowHeight-bottom_border_factor/2, catcher_size, bottom_border_factor)
    condiment_count = 0;

    for( let i = 0; i < burger_stack.length; i++ ) {
        burger_stack[i].x_pos = catcher_x;
        
        if(burger_stack[i].name == "ketchup" || burger_stack[i].name == "mustard" ) {
            burger_stack[i].y_pos = windowHeight - burger_stack[i].topping.height * i/5 - bottom_border_factor - 20;
            condiment_count++;
        } else {
            burger_stack[i].y_pos = windowHeight - burger_stack[i].topping.height * i/5 - bottom_border_factor;
        }
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
// uses arrowkeys otherwise
function onMouseMove() {
    var moved = false
    window.onmousemove = function(){
      if(!moved){
          moved = true;
          catcher_x = mouseX;
      }
   }
}

function runGame() {

    // display score
    text("Score: " + score, windowWidth  - 80, faller_height * 2 )

    // display current order to fill
    displayOrderToFill()
}

// fill current_order with new random order
// fill current_order_count with frequency counts of current_order

function getOrder() {

    // clear out old order
    current_order = [];

    // get random number of toppings between max_order_toppings and min_order_toppings
    let number_of_toppings = Math.floor(Math.random()*(max_order_toppings - min_order_toppings) + min_order_toppings);

    // fill order with random toppings
    for( let i = 0; i < number_of_toppings; i++ ) {

        // get random index of toppings_allowed
        let random_topping_index = Math.floor(Math.random()*(toppings_allowed.length));
        
        // make sure chosen topping is not a top bun
        // else add to current_order
        if( toppings_allowed[random_topping_index].name == "top_bun" )
            i--;
        else
            current_order.push(toppings_allowed[random_topping_index]);
    }

    // sort order by name
    current_order.sort( (a,b) => {
        if( a.name > b.name )
            return 1
        else 
            return -1
    });

    countOrderToppings()
}

function displayOrderToFill() {
    // store width of one order item
    let topping_order_width = windowWidth / Object.keys(current_order_count).length;

    // display each topping and topping count
    let i = 0;
    for( const topping in current_order_count ) {
        text(current_order_count[topping] + " x ", (topping_order_width * i) + topping_order_width/2 - faller_width/2 - 20, faller_height)
        image( topping_image_access[topping], (topping_order_width * i) + topping_order_width/2, faller_height, faller_width, faller_height );
        i++;
    }
}

// Reset burger stack and current_order_counts 
function keyPressed() {
    if( key == ' ' ) {
        burger_stack = [];
        // reset current_order_count to starting order
        countOrderToppings();
    }
}

// takes the current order stored in current_order
// and saves the frequencies of each to a property
// of current_order_count
function countOrderToppings() {

    // reset all values in current_order_count to 0
    current_order_count = {};


    // store current_order frequency in current_order_count
    for( let i = 0; i < current_order.length; i++ ) {
        if( current_order_count[current_order[i].name] )
            current_order_count[current_order[i].name] += 1;
        else
            current_order_count[current_order[i].name] = 1;
    }
}