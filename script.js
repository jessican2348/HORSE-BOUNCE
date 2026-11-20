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
const goldenPicture = {
    picture: 'https://static.vecteezy.com/system/resources/thumbnails/058/324/912/small/gold-horse-isolated-on-transparent-background-png.png',
    scale: 1
};

const jokes = [
    'What do you call a horse that lives next door? A neigh-bour.',
    'What do you call a pony with a sore throat? A little hoarse.',
    'Why did the horse go to the doctor? It was feeling a little un-stable.',
    'Which side of a horse has the most hair? The outside.',
    'What did the horse say when it finished its food? That\'s the last straw!',
    'What kind of horse only comes out at night? A night-mare.',
    'What does a horse say when it falls? Help, I\'ve fallen and I can\'t giddy-up!'
];

const facts = [
    'Horses can sleep standing up. They lock their legs so they don\'t fall over!',
    'Horses can\'t breathe through their mouths, only through their noses.',
    'Horses have the biggest eyes of any land mammal.',
    'Horses can\'t throw up.',
    'A baby horse (a foal) can stand up and walk within a couple of hours of being born.',
    'Horse hooves are made of keratin, the same thing as your fingernails.',
    'A horse\'s height is measured in \'hands\'. One hand is 4 inches.',
    'Because their eyes are on the sides of their head, horses can see almost all the way around them.'
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
Events.on(mouseConstraint, 'mouseup', function () {
    const movedX = Math.abs(mouse.mouseupPosition.x - mouse.mousedownPosition.x);
    const movedY = Math.abs(mouse.mouseupPosition.y - mouse.mousedownPosition.y);

    if (movedX < 5 && movedY < 5) {
        const clickedHorses = Query.point(horses, mouse.mouseupPosition);

        if (clickedHorses.length > 0) {
            showJoke(clickedHorses[0]);
        }
    }
});
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
function showJoke(horse) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    const fact = facts[Math.floor(Math.random() * facts.length)];

        if (horse.isGolden == true) {
        document.getElementById('joke-label').textContent = '✨ You found the rare golden horse! ✨';
        document.getElementById('joke-text').innerHTML = joke + '<br><br>' + fact;
    } else if (Math.random() < 0.5) {
        document.getElementById('joke-label').textContent = 'Horse dad joke';
        document.getElementById('joke-text').textContent = joke;
    } else {
        document.getElementById('joke-label').textContent = 'Horse fact';
        document.getElementById('joke-text').textContent = fact;
    }

    document.getElementById('joke-image').src = horse.render.sprite.texture;

    $.featherlight($('#joke-box'));
}

function addHorse(x, y) {
    let horseType = horsePictures[Math.floor(Math.random() * horsePictures.length)];
    let isGolden = false;

   
    if (Math.random() < 0.08) {
        horseType = goldenPicture;
        isGolden = true;
    }
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
        horse.isGolden = isGolden;

    Composite.add(engine.world, horse);
    horses.push(horse);
    updateCounter();
}

function updateCounter() {
    document.getElementById('counter').textContent = 'Horses in the paddock: ' + horses.length;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}