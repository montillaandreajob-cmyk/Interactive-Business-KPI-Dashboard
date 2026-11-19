"use strict";
// Fabricated sample records, not employer information.
const opportunities = [
  {id:"Demo 001", channel:"Referral", stage:"won", value:22000},
  {id:"Demo 002", channel:"Web", stage:"proposal", value:35000},
  {id:"Demo 003", channel:"Email", stage:"qualified", value:18000},
  {id:"Demo 004", channel:"Referral", stage:"lost", value:24000},
  {id:"Demo 005", channel:"Social", stage:"new", value:12000},
  {id:"Demo 006", channel:"Web", stage:"won", value:46000},
  {id:"Demo 007", channel:"Social", stage:"proposal", value:7000},
  {id:"Demo 008", channel:"Email", stage:"won", value:18000},
  {id:"Demo 009", channel:"Referral", stage:"qualified", value:52000},
  {id:"Demo 010", channel:"Web", stage:"lost", value:19000},
  {id:"Demo 011", channel:"Email", stage:"proposal", value:27500},
  {id:"Demo 012", channel:"Social", stage:"won", value:33000}
];
const openStages = new Set(["new", "qualified", "proposal"]);
const stages = ["new", "qualified", "proposal", "won", "lost"];
const formatMoney = value => new Intl.NumberFormat("en-US", {style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const dropdown = document.getElementById("channel");

function textNode(tag, content) {const el = document.createElement(tag); el.textContent = String(content); return el;}

function render() {
  const channel = dropdown.value;
  const filtered = channel === "all" ? opportunities : opportunities.filter(item => item.channel === channel);
  const won = filtered.filter(item => item.stage === "won").length;
  const lost = filtered.filter(item => item.stage === "lost").length;
  const pipeline = filtered.filter(item => openStages.has(item.stage)).reduce((sum, item) => sum + item.value, 0);
  const winRate = won + lost ? 100 * won / (won + lost) : 0;
  document.getElementById("total").textContent = filtered.length;
  document.getElementById("won").textContent = won;
  document.getElementById("win-rate").textContent = `${winRate.toFixed(1)}%`;
  document.getElementById("pipeline").textContent = formatMoney(pipeline);
  const bars = document.getElementById("stage-bars");
  bars.replaceChildren();
  stages.forEach(stage => {
    const count = filtered.filter(item => item.stage === stage).length;
    const row = document.createElement("div"); row.className = "bar-row";
    row.appendChild(textNode("span", stage[0].toUpperCase() + stage.slice(1)));
    const track = document.createElement("div"); track.className = "track";
    const fill = document.createElement("div"); fill.className = "fill";
    fill.style.width = `${filtered.length ? (100 * count / filtered.length) : 0}%`;
    track.appendChild(fill); row.appendChild(track); row.appendChild(textNode("strong",count)); bars.appendChild(row);
  });
  const table = document.getElementById("records"); table.replaceChildren();
  filtered.forEach(item => {
    const tr = document.createElement("tr");
    [item.id,item.channel,item.stage,formatMoney(item.value)].forEach(value => tr.appendChild(textNode("td",value)));
    table.appendChild(tr);
  });
}
[...new Set(opportunities.map(item => item.channel))].sort().forEach(channel => {
  const option = document.createElement("option"); option.value = channel; option.textContent = channel; dropdown.appendChild(option);
});
dropdown.addEventListener("change",render);
document.getElementById("reset").addEventListener("click", () => {dropdown.value = "all"; render();});
render();
