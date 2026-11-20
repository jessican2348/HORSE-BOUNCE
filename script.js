const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composite = Matter.Composite;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Events = Matter.Events;
const Query = Matter.Query;

const horsePictures = [
    {
        picture: 'https://static.vecteezy.com/system/resources/thumbnails/048/050/905/small/a-horse-standing-on-transparent-background-png.png',
        scale: 1
    },
    {
        picture: 'https://static.vecteezy.com/system/resources/thumbnails/024/508/958/small/horse-isolated-on-background-with-generative-ai-png.png',
        scale: 1
    },
    {
        picture: 'https://th.bing.com/th/id/R.fcc8220cacb2a145d350b5b2a1827efb?rik=tv1wougKZZuNRA&pid=ImgRaw&r=0',
        scale: 1
    }
];

const width = window.innerWidth;
const height = window.innerHeight;

let horses = [];
let gravityOn = true;
const engine = Engine.create();

const render = Render.create({
    element: document.getElementById('canvas'),
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
    }
});

const wallOptions = {
    isStatic: true,
    render: {
        visible: false
    }
};

const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
const ceiling = Bodies.rectangle(width / 2, -50, width, 100, wallOptions);
const leftWall = Bodies.rectangle(-50, height / 2, 100, height, wallOptions);
const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions);

Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);
const mouse = Mouse.create(render.canvas);

const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(engine.world, mouseConstraint);
Render.run(render);
Runner.run(Runner.create(), engine);

for (let i = 0; i < 5; i++) {
    addHorse(random(80, width - 80), 80);
}
document.getElementById('add-horse').addEventListener('click', function () {
    addHorse(random(80, width - 80), 80);
});

document.getElementById('rain-button').addEventListener('click', function () {
    for (let i = 0; i < 15; i++) {
        addHorse(random(80, width - 80), random(60, 200));
    }
});

document.getElementById('shake-button').addEventListener('click', function () {
    for (let i = 0; i < horses.length; i++) {
        Body.setVelocity(horses[i], { x: random(-15, 15), y: random(-25, -10) });
    }
});

document.getElementById('gravity-toggle').addEventListener('click', function () {
    if (gravityOn == true) {
        gravityOn = false;
        engine.gravity.y = 0;
        this.textContent = 'Gravity: Off';

        for (let i = 0; i < horses.length; i++) {
            Body.setVelocity(horses[i], { x: random(-4, 4), y: random(-4, 4) });
        }
    } else {
        gravityOn = true;
        engine.gravity.y = 1;
        this.textContent = 'Gravity: On';
    }
});

document.getElementById('clear-button').addEventListener('click', function () {
    for (let i = 0; i < horses.length; i++) {
        Composite.remove(engine.world, horses[i]);
    }
    horses = [];
    updateCounter();
});
function addHorse(x, y) {
    let horseType = horsePictures[Math.floor(Math.random() * horsePictures.length)];

    const horse = Bodies.circle(x, y, 45, {
        restitution: 0.8,
        friction: 0.05,
        render: {
            sprite: {
                texture: horseType.picture,
                xScale: horseType.scale,
                yScale: horseType.scale
            }
        }
    });

    Composite.add(engine.world, horse);
    horses.push(horse);
}
updateCounter();
function updateCounter() {
    document.getElementById('counter').textContent = 'Horses in the paddock: ' + horses.length;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}