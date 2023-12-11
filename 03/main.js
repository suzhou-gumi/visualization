import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const svgroot = document.querySelector("svg");

const dataSource = {
  name: "中国",
  children: [
    {
      name: "浙江",
      children: [
        { name: "杭州" },
        { name: "宁波" },
        { name: "温州" },
        { name: "绍兴" },
      ],
    },
    {
      name: "广西",
      children: [{ name: "桂林" }, { name: "南宁" }],
    },
  ],
};

const regions = d3
  .hierarchy(dataSource)
  .sum((d) => 1)
  .sort((a, b) => b.value - a.value);

const pack = d3.pack().size([512, 512]).padding(3);

const root = pack(regions);

function draw(
  parent,
  node,
  { fillStyle = "rgba(0, 0, 0, 0.2)", textColor = "white" } = {}
) {
  const { x, y, r, children } = node;
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", fillStyle);
  circle.setAttribute("data-name", node.data.name);
  parent.appendChild(circle);

  if (children) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let i = 0; i < children.length; i++) {
      draw(group, children[i], { fillStyle, textColor });
    }
    parent.appendChild(group);
  } else {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("fill", textColor);
    text.setAttribute("font-family", "Arial");
    text.setAttribute("font-size", "1.5rem");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    const name = node.data.name;
    text.textContent = name;
    parent.appendChild(text);
  }
}

draw(svgroot, root);

const titleEl = document.getElementById("title");

function getTitle(target) {
  const name = target.getAttribute("data-name");
  if (target.parentNode && target.parentNode.nodeName === "g") {
    const parentName = target.parentNode.getAttribute("data-name");
    return `${parentName}-${name}`;
  }
  return name;
}

let activeTarget = null;
svgroot.addEventListener("mousemove", (evt) => {
  let target = evt.target;
  if (target.nodeName === "text") target = target.parentNode;
  if (activeTarget !== target) {
    if (activeTarget) activeTarget.setAttribute("fill", "rgba(0, 0, 0, 0.2)");
  }
  titleEl.textContent = getTitle(target);
  target.setAttribute("fill", "rgba(0, 128, 0, 0.1)");
  activeTarget = target;
});
