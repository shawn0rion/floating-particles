// on window load (to get the height and width of the window)
window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const openMenuButton = document.querySelector("#open-menu");
  const closeMenuButton = document.querySelector("#close-menu");
  let particles = [];

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  // create a neon color picker
  const colors = [
    "#FF073A",
    "#FF7E00",
    "#FFFF00",
    "#39FF14",
    "#F4F6F8",
    "#A020F0",
    "#FF1493",
    "#A52A2A",
    "#FF69B4",
    "#00FFFF",
  ];

  const settings = {
    numParticles: 20,
    speed: { x: 1, y: 1 },
    size: 5,
    color: "#F4F6F8",
  };

  const colorPicker = document.querySelector(".color-picker");
  // create a button for each color

  const createButton = (color) => {
    const colorButton = document.createElement("button");
    colorButton.classList.add("color-button");
    colorButton.style.backgroundColor = color;
    colorButton.id = color;
    colorPicker.appendChild(colorButton);
  };

  colors.forEach(createButton);

  colorPicker.addEventListener("click", (event) => {
    // only runs if a button is clicked
    if (!event.target.classList.contains("color-button")) return;

    // remove selcted from all
    document.querySelectorAll(".color-button").forEach((button) => {
      button.classList.remove("selected");
    });

    // select each slider
    // add event
    // select each label and set the value to the value of slider
    // add selected to button

    // update settings .color using event.target.id
    settings.color = event.target.id;
    event.target.classList.add("selected");
    changeParticles();
  });

  // get a list of labels manually
  const countLabel = document.querySelector('label[for="numParticles"]');
  const xSpeedLabel = document.querySelector('label[for="x"]');
  const ySpeedLabel = document.querySelector('label[for="y"]');
  const sizeLabel = document.querySelector('label[for="size"]');
  // get a list of sliders manuallt
  const countSlider = document.querySelector("#numParticles");
  const xSpeedSlider = document.querySelector("#xSpeed");
  const ySpeedSlider = document.querySelector("#ySpeed");
  const sizeSlider = document.querySelector("#size");

  // listen to the menu events and update the settings

  countSlider.addEventListener("input", (e) => {
    // get setting, update using value
    settings.numParticles = e.target.value;
    countLabel.textContent = `Count: ${settings.numParticles}`;
    init();
  });

  xSpeedSlider.addEventListener("change", (e) => {
    settings.speed.x = e.target.value;
    xSpeedLabel.textContent = `x: ${settings.speed.x}`;
    init();
  });

  ySpeedSlider.addEventListener("change", (e) => {
    settings.speed.y = e.target.value;
    ySpeedLabel.textContent = `y: ${settings.speed.y}`;
    init();
  });

  sizeSlider.addEventListener("input", (e) => {
    settings.size = e.target.value;
    sizeLabel.textContent = `Size: ${settings.size}`;
    changeParticles();
  });

  // class of particle
  class Particle {
    constructor(x, y, dx, dy, size, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size; // radius
      this.color = color;
    }

    draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    };

    update = () => {
      // handle out of bounds

      if (this.x - this.size < 0 || this.x + this.size > canvas.width) {
        this.dx = -this.dx;
      } //
      if (this.y - this.size < 0 || this.y + this.size > canvas.width) {
        this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;

      // and draw
      this.draw();
    };

    newSettings = () => {
      this.dx = Math.random() * settings.speed.x * this.dx > 0 ? 1 : -1;
      this.dy = Math.random() * settings.speed.y * this.dy > 0 ? 1 : -1;
      this.color = settings.color;
      this.size = settings.size;
    };
  }

  // now create the particle array
  function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
    for (let num = 0; num < settings.numParticles; num++) {
      const x = Math.random() * (canvas.width - settings.size * 2);
      const y = Math.random() * (canvas.height - settings.size * 2);
      // experiment with fractioning the speed setting
      const dx =
        Math.random() * settings.speed.x * (Math.random() > 0.5 ? 1 : -1);
      const dy =
        Math.random() * settings.speed.y * (Math.random() > 0.5 ? 1 : -1);
      const color = settings.color;
      const size = settings.size;
      particles[num] = new Particle(x, y, dx, dy, size, color);
    }
  }

  function updateParticles() {
    for (let num = 0; num < particles.length; num++) {
      particles[num].update();
    }
  }

  function changeParticles() {
    for (let num = 0; num < particles.length; num++) {
      particles[num].newSettings();
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
  }

  init();
  animate();
  setInterval(() => {
    console.table(particles);
    console.table(settings);
  }, 5000);
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });
});
