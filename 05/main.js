// import at from "https://unpkg.com/roughjs@latest/bundled/rough.esm.js";

// const rc = at.canvas(document.querySelector("canvas"));
// const hillOpts = {
//   roughness: 2.8,
//   strokeWidth: 2,
//   fill: "blue",
// };
// rc.path("M76 256L176 156L276 256", hillOpts);
// rc.path("M236 256L336 156L436 256", hillOpts);
// rc.circle(256, 106, 105, {
//   stroke: "red",
//   strokeWidth: 4,
//   fill: "rgba(255,255,0,0.4)",
//   fillStyle: "solid",
// });

// const rc = at.canvas(document.querySelector("canvas"));
// const ctx = rc.ctx;
// ctx.translate(256, 256);
// ctx.scale(1, -1);

// const hillOpts = {
//   roughness: 2.8,
//   strokeWidth: 2,
//   fill: "blue",
// };

// rc.path("M-180 0L-80 100L20 0", hillOpts);
// rc.path("M-20 0L80 100L180 0", hillOpts);

// rc.circle(0, 150, 105, {
//   stroke: "red",
//   strokeWidth: 4,
//   fill: "rgba(255,255,0,0.4)",
//   fillStyle: "solid",
// });

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.translate(0, canvas.height);
ctx.scale(1, -1);
ctx.lineCap = "round";

function drawBranch(context, v0, length, thickness, dir, bias) {
  const v = new Vector2D().rotate(dir).scale(length);
  const v1 = v0.copy().add(v);

  context.lineWidth = thickness;
  context.beginPath();
  context.moveTo(...v0);
  context.lineTo(...v1);
  context.stroke();

  if (thickness > 2) {
    const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
    drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
    const right =
      Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
    drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
  }

  if (thickness < 5 && Math.random() < 0.3) {
    context.save();
    context.strokeStyle = "#c72c35";
    const th = Math.random() * 6 + 3;
    context.lineWidth = th;
    context.beginPath();
    context.moveTo(...v1);
    context.lineTo(v1.x, v1.y - 2);
    context.stroke();
    context.restore();
  }
}

class Vector2D extends Array {
  constructor(x = 1, y = 0) {
    super(x, y);
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }

  get dir() {
    return Math.atan2(this.y, this.x);
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(a) {
    this.x *= a;
    this.y *= a;
    return this;
  }

  cross(v) {
    return this.x * v.y - v.x * this.y;
  }

  dot(v) {
    return this.x * v.x + v.y * this.y;
  }

  normalize() {
    return this.scale(1 / this.length);
  }

  rotate(rad) {
    const c = Math.cos(rad),
      s = Math.sin(rad);
    const [x, y] = this;

    this.x = x * c + y * -s;
    this.y = x * s + y * c;

    return this;
  }
}

const v0 = new Vector2D(256, 0);
drawBranch(ctx, v0, 50, 10, 1, 3);
