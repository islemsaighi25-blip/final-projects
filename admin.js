  
let members = JSON.parse(localStorage.getItem("members")) || [
  { id: 1, name: "hamada",  email: "hamada@gym.com",  phone: "0551111111", plan: "Gold",   joinDate: "2024-06-01" },
  { id: 2, name: "salim",   email: "salim@gym.com",   phone: "0552222222", plan: "Silver", joinDate: "2024-06-02" },
  { id: 3, name: "yazid",   email: "yazid@gym.com",   phone: "0553333333", plan: "Bronze", joinDate: "2024-06-03" },
  { id: 4, name: "nabil",   email: "nabil@gym.com",   phone: "0554444444", plan: "Gold",   joinDate: "2024-06-04" },
  { id: 5, name: "farid",   email: "farid@gym.com",   phone: "0555555555", plan: "Silver", joinDate: "2024-06-05" },
];

 
function saveMembers() {
  localStorage.setItem("members", JSON.stringify(members));
}

   
function displayMembers(list = members) {
  const tbody = document.querySelector("#membersTable tbody");
  tbody.innerHTML = "";

  list.forEach((member) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.plan}</td>
      <td>${member.joinDate}</td>
      <td>
        <button onclick="editMember(${member.id})">تعديل</button>
        <button onclick="deleteMember(${member.id})">حذف</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("memberCount").textContent = list.length;
}

  
function addMember() {
  const name     = document.getElementById("newName").value.trim();
  const email    = document.getElementById("newEmail").value.trim();
  const phone    = document.getElementById("newPhone").value.trim();
  const plan     = document.getElementById("newPlan").value;
  const joinDate = document.getElementById("newJoinDate").value;

  if (!name || !email || !phone || !joinDate) {
    alert(" Veuillez remplir tous les champs ");
    return;
  }

  const newId = members.length > 0 ? members[members.length - 1].id + 1 : 1;
  members.push({ id: newId, name, email, phone, plan, joinDate });

  saveMembers();
  displayMembers();
  updateStats();

 
  ["newName","newEmail","newPhone","newJoinDate"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

 function deleteMember(id) {
  if (!confirm(" Voulez-vous supprimer ce membre؟")) return;
  members = members.filter((m) => m.id !== id);
  saveMembers();
  displayMembers();
  updateStats();
}

function editMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  const newName = prompt("nomا", member.name);
  if (newName === null) return;       

  const newPlan = prompt("الخطة (Gold / Silver / Bronze):", member.plan);
  if (newPlan === null) return;

  member.name = newName.trim() || member.name;
  member.plan = newPlan.trim() || member.plan;

  saveMembers();
  displayMembers();
  updateStats();
}

 function searchMembers() {
  const query       = document.getElementById("searchInput").value.toLowerCase();
  const filterPlan  = document.getElementById("filterPlan").value;

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(query) ||
                        m.email.toLowerCase().includes(query);
    const matchPlan   = filterPlan === "All" || m.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  displayMembers(filtered);
}


let classes = JSON.parse(localStorage.getItem("classes")) || [
  { id: 1, name: "Yoga",    trainer: "Ali",   day: "Monday",    time: "08:00", duration: 60, difficulty: "Easy",   capacity: 20 },
  { id: 2, name: "Boxing",  trainer: "Karim", day: "Wednesday", time: "10:00", duration: 45, difficulty: "Hard",   capacity: 15 },
  { id: 3, name: "Pilates", trainer: "Sara",  day: "Friday",    time: "09:00", duration: 50, difficulty: "Medium", capacity: 18 },
];

function saveClasses() {
  localStorage.setItem("classes", JSON.stringify(classes));
}

  
function displayClasses() {
  const tbody = document.querySelector("#classesTable tbody");
  tbody.innerHTML = "";

  classes.forEach((cls) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cls.id}</td>
      <td>${cls.name}</td>
      <td>${cls.trainer}</td>
      <td>${cls.day}</td>
      <td>${cls.time}</td>
      <td>${cls.duration} دقيقة</td>
      <td>${cls.difficulty}</td>
      <td>${cls.capacity}</td>
      <td>
        <button onclick="deleteClass(${cls.id})">حذف</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

 function addClass() {
  const name       = document.getElementById("className").value.trim();
  const trainer    = document.getElementById("classTrainer").value.trim();
  const day        = document.getElementById("classDay").value;
  const time       = document.getElementById("classTime").value;
  const duration   = document.getElementById("classDuration").value;
  const difficulty = document.getElementById("classDifficulty").value;
  const capacity   = document.getElementById("classCapacity").value;

  if (!name || !trainer || !time || !duration || !capacity) {
    alert(" Veuillez remplir tous les champs");
    return;
  }

  const duplicate = classes.find(
    (c) => c.trainer === trainer && c.day === day && c.time === time
  );
  if (duplicate) {
    alert(" Cet entraîneur a une séance le même jour et à la même heure!");
    return;
  }

  const newId = classes.length > 0 ? classes[classes.length - 1].id + 1 : 1;
  classes.push({ id: newId, name, trainer, day, time,
                  duration: +duration, difficulty, capacity: +capacity });

  saveClasses();
  displayClasses();
  updateStats();
}

function deleteClass(id) {
  if (!confirm("  Voulez-vous supprimer cette séance ؟")) return;
  classes = classes.filter((c) => c.id !== id);
  saveClasses();
  displayClasses();
  updateStats();
}

function updateStats() {
  const totalMembers        = members.length;
  const activeSubscriptions = members.filter((m) => m.plan !== "").length;
  const classesPerWeek      = classes.length;

  const planCount = { Gold: 0, Silver: 0, Bronze: 0 };
  members.forEach((m) => {
    if (planCount[m.plan] !== undefined) planCount[m.plan]++;
  });
  const mostPopularPlan = Object.keys(planCount).reduce(
    (a, b) => (planCount[a] >= planCount[b] ? a : b),
    "Gold"
  );
   
  document.getElementById("statTotalMembers").textContent        = totalMembers;
  document.getElementById("statActiveSubscriptions").textContent = activeSubscriptions;
  document.getElementById("statClassesPerWeek").textContent      = classesPerWeek;
  document.getElementById("statMostPopularPlan").textContent     = mostPopularPlan;

  drawChart(planCount);
}
  
function drawChart(planCount) {
  const canvas = document.getElementById("planChart");
  if (!canvas) return;

  const ctx    = canvas.getContext("2d");
  const data   = [
    { label: "Gold",   value: planCount.Gold,   color: "#FFD700" },
    { label: "Silver", value: planCount.Silver, color: "#C0C0C0" },
    { label: "Bronze", value: planCount.Bronze, color: "#CD7F32" },
  ];

  const maxVal    = Math.max(...data.map((d) => d.value), 1);
  const barWidth  = 60;
  const gap       = 40;
  const chartH    = 150;
  const startX    = 50;
  const baseY     = 180;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  data.forEach((item, i) => {
    const x      = startX + i * (barWidth + gap);
    const barH   = (item.value / maxVal) * chartH;
    const y      = baseY - barH;
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, barWidth, barH);

    ctx.fillStyle = "#333";
    ctx.font      = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(item.value, x + barWidth / 2, y - 5);

     ctx.fillText(item.label, x + barWidth / 2, baseY + 20);
  });

   ctx.fillStyle = "#555";
  ctx.font      = "13px Arial";
  ctx.textAlign = "center";
  ctx.fillText(" Répartition des membres selon le plan ", canvas.width / 2, 210);
}

window.addEventListener("DOMContentLoaded", () => {
  displayMembers();
  displayClasses();
  updateStats();
}); 
 

 
