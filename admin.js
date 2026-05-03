 
var members = JSON.parse(localStorage.getItem('gym_members')) || [
  { id: 1, name: "Yacine Boudiaf",  email: "yacine@gmail.com",  phone: "0612111111", plan: "gold",   date: "2024-01-10" },
  { id: 2, name: "Sara Mekkaoui",   email: "sara@gmail.com",    phone: "0623222222", plan: "silver", date: "2024-02-15" },
  { id: 3, name: "Amine Khelifi",   email: "amine@gmail.com",   phone: "0634333333", plan: "bronze", date: "2024-03-01" },
  { id: 4, name: "Nadia Hamdi",     email: "nadia@gmail.com",   phone: "0645444444", plan: "silver", date: "2024-04-20" },
  { id: 5, name: "Khalil Zeroual",  email: "khalil@gmail.com",  phone: "0656555555", plan: "bronze", date: "2024-05-05" }
];

 
var classes = JSON.parse(localStorage.getItem('gym_classes')) || [
  { id: 1, name: "Yoga",        trainer: "Sara",   day: "Monday",    time: "08:00", duration: 60,  difficulty: "easy",   capacity: 15 },
  { id: 2, name: "Boxing",      trainer: "Karim",  day: "Wednesday", time: "10:00", duration: 90,  difficulty: "hard",   capacity: 10 },
  { id: 3, name: "Pilates",     trainer: "Nadia",  day: "Friday",    time: "09:00", duration: 45,  difficulty: "medium", capacity: 12 }
];
 
var nextMemberId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
var nextClassId  = classes.length  > 0 ? Math.max(...classes.map(c => c.id))  + 1 : 1;

 
var editingMemberId  = null;
var deletingMemberId = null;
var editingClassId   = null;
var deletingClassId  = null;


 
 

function saveMembers() {
  localStorage.setItem('gym_members', JSON.stringify(members));
}

function saveClasses() {
  localStorage.setItem('gym_classes', JSON.stringify(classes));
}


 
function showTab(tabName) {
  // Hide all tab contents
  var allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(function(tab) { tab.classList.remove('active'); });

  // Remove active from all tab buttons
  var allBtns = document.querySelectorAll('.tab-btn');
  allBtns.forEach(function(btn) { btn.classList.remove('active'); });

  // Show selected tab
  document.getElementById('tab-' + tabName).classList.add('active');

  // Mark selected button as active
  event.target.classList.add('active');

  // Refresh the dashboard when you open it
  if (tabName === 'dashboard') {
    updateDashboard();
  }
}


// ============================================================
//  FEATURE 1 — MEMBER MANAGEMENT
// ============================================================

// Render the members table (called after every change)
function renderMembers(list) {
  var tbody = document.getElementById('member-tbody');
  tbody.innerHTML = ''; // clear old rows

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#888;">No members found.</td></tr>';
    return;
  }

  list.forEach(function(member, index) {
    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + (index + 1) + '</td>' +
      '<td>' + member.name + '</td>' +
      '<td>' + member.email + '</td>' +
      '<td>' + member.phone + '</td>' +
      '<td><span class="badge badge-' + member.plan + '">' + member.plan + '</span></td>' +
      '<td>' + member.date + '</td>' +
      '<td>' +
        '<button class="btn-sm btn-edit"   onclick="openEditMember(' + member.id + ')">Edit</button>' +
        '<button class="btn-sm btn-delete" onclick="openDeleteMember(' + member.id + ')">Delete</button>' +
      '</td>';
    tbody.appendChild(row);
  });
}

// Filter members by search text and plan type
function filterMembers() {
  var searchText = document.getElementById('search-input').value.toLowerCase();
  var planFilter = document.getElementById('plan-filter').value;

  var filtered = members.filter(function(member) {
    // Check if name or email matches the search
    var matchSearch = member.name.toLowerCase().includes(searchText) ||
                      member.email.toLowerCase().includes(searchText);
    // Check if plan matches the filter
    var matchPlan = (planFilter === 'all') || (member.plan === planFilter);

    return matchSearch && matchPlan;
  });

  // Update the count text
  document.getElementById('member-count').textContent = 'Showing ' + filtered.length + ' member(s)';

  renderMembers(filtered);
}

// Add a new member from the form
function addMember() {
  var name  = document.getElementById('new-name').value.trim();
  var email = document.getElementById('new-email').value.trim();
  var phone = document.getElementById('new-phone').value.trim();
  var plan  = document.getElementById('new-plan').value;
  var date  = document.getElementById('new-date').value;

   
  if (!name || !email || !phone || !date) {
    showMsg('add-error', 'add-success');
    return;
  }
 
  var newMember = { id: nextMemberId, name: name, email: email, phone: phone, plan: plan, date: date };
  nextMemberId++;

  
  members.push(newMember);
  saveMembers();
 
  document.getElementById('new-name').value  = '';
  document.getElementById('new-email').value = '';
  document.getElementById('new-phone').value = '';
  document.getElementById('new-date').value  = '';

  showMsg('add-success', 'add-error');
  filterMembers();      // re-render table
  updateDashboard();    // update stats
}

// Open the Edit modal and fill it with the member's current data
function openEditMember(id) {
  var member = members.find(function(m) { return m.id === id; });
  if (!member) return;

  editingMemberId = id;

  document.getElementById('edit-name').value  = member.name;
  document.getElementById('edit-email').value = member.email;
  document.getElementById('edit-phone').value = member.phone;
  document.getElementById('edit-plan').value  = member.plan;

  document.getElementById('edit-modal').classList.add('open');
}

// Save changes from the Edit modal
function saveEditMember() {
  var member = members.find(function(m) { return m.id === editingMemberId; });
  if (!member) return;

  member.name  = document.getElementById('edit-name').value.trim();
  member.email = document.getElementById('edit-email').value.trim();
  member.phone = document.getElementById('edit-phone').value.trim();
  member.plan  = document.getElementById('edit-plan').value;

  saveMembers();
  closeModal('edit-modal');
  filterMembers();
  updateDashboard();
}

// Open the Delete confirmation modal
function openDeleteMember(id) {
  deletingMemberId = id;
  var member = members.find(function(m) { return m.id === id; });
  document.getElementById('delete-msg').textContent =
    'Are you sure you want to delete "' + member.name + '"?';
  document.getElementById('delete-modal').classList.add('open');
}

// Confirm and delete the member
function confirmDeleteMember() {
  members = members.filter(function(m) { return m.id !== deletingMemberId; });
  saveMembers();
  closeModal('delete-modal');
  filterMembers();
  updateDashboard();
}


 

 
function renderClasses() {
  var tbody = document.getElementById('class-tbody');
  tbody.innerHTML = '';

  if (classes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:24px; color:#888;">No classes yet. Add one below.</td></tr>';
    return;
  }

  classes.forEach(function(cls, index) {
    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + (index + 1) + '</td>' +
      '<td>' + cls.name + '</td>' +
      '<td>' + cls.trainer + '</td>' +
      '<td>' + cls.day + '</td>' +
      '<td>' + cls.time + '</td>' +
      '<td>' + cls.duration + ' min</td>' +
      '<td><span class="badge badge-' + cls.difficulty + '">' + cls.difficulty + '</span></td>' +
      '<td>' + cls.capacity + '</td>' +
      '<td>' +
        '<button class="btn-sm btn-edit"   onclick="openEditClass(' + cls.id + ')">Edit</button>' +
        '<button class="btn-sm btn-delete" onclick="openDeleteClass(' + cls.id + ')">Delete</button>' +
      '</td>';
    tbody.appendChild(row);
  });
}
 
function addClass() {
  var name       = document.getElementById('cls-name').value.trim();
  var trainer    = document.getElementById('cls-trainer').value.trim();
  var day        = document.getElementById('cls-day').value;
  var time       = document.getElementById('cls-time').value;
  var duration   = document.getElementById('cls-duration').value;
  var difficulty = document.getElementById('cls-diff').value;
  var capacity   = document.getElementById('cls-capacity').value;

  if (!name || !trainer || !time || !duration || !capacity) {
    showMsg('cls-error', 'cls-success');
    return;
  }

  // Duplicate check: same trainer, same day, same time
  var duplicate = classes.find(function(c) {
    return c.trainer.toLowerCase() === trainer.toLowerCase() &&
           c.day === day &&
           c.time === time;
  });

  if (duplicate) {
    var errorEl = document.getElementById('cls-error');
    errorEl.textContent = '⚠️ ' + trainer + ' already has a class on ' + day + ' at ' + time + '.';
    showMsg('cls-error', 'cls-success');
    return;
  }

  var newClass = {
    id: nextClassId,
    name: name,
    trainer: trainer,
    day: day,
    time: time,
    duration: parseInt(duration),
    difficulty: difficulty,
    capacity: parseInt(capacity)
  };
  nextClassId++;

  classes.push(newClass);
  saveClasses();

  // Clear form
  document.getElementById('cls-name').value     = '';
  document.getElementById('cls-trainer').value  = '';
  document.getElementById('cls-time').value     = '';
  document.getElementById('cls-duration').value = '';
  document.getElementById('cls-capacity').value = '';

  showMsg('cls-success', 'cls-error');
  renderClasses();
  updateDashboard();
}

// Open Edit modal for a class
function openEditClass(id) {
  var cls = classes.find(function(c) { return c.id === id; });
  if (!cls) return;

  editingClassId = id;

  document.getElementById('edit-cls-name').value       = cls.name;
  document.getElementById('edit-cls-trainer').value    = cls.trainer;
  document.getElementById('edit-cls-day').value        = cls.day;
  document.getElementById('edit-cls-time').value       = cls.time;
  document.getElementById('edit-cls-duration').value   = cls.duration;
  document.getElementById('edit-cls-diff').value       = cls.difficulty;
  document.getElementById('edit-cls-capacity').value   = cls.capacity;

  document.getElementById('edit-class-modal').classList.add('open');
}

// Save changes to a class
function saveEditClass() {
  var cls = classes.find(function(c) { return c.id === editingClassId; });
  if (!cls) return;

  cls.name       = document.getElementById('edit-cls-name').value.trim();
  cls.trainer    = document.getElementById('edit-cls-trainer').value.trim();
  cls.day        = document.getElementById('edit-cls-day').value;
  cls.time       = document.getElementById('edit-cls-time').value;
  cls.duration   = parseInt(document.getElementById('edit-cls-duration').value);
  cls.difficulty = document.getElementById('edit-cls-diff').value;
  cls.capacity   = parseInt(document.getElementById('edit-cls-capacity').value);

  saveClasses();
  closeModal('edit-class-modal');
  renderClasses();
  updateDashboard();
}

// Open delete confirmation for a class
function openDeleteClass(id) {
  deletingClassId = id;
  var cls = classes.find(function(c) { return c.id === id; });
  document.getElementById('delete-class-msg').textContent =
    'Delete the class "' + cls.name + '" with ' + cls.trainer + '?';
  document.getElementById('delete-class-modal').classList.add('open');
}

// Confirm delete class
function confirmDeleteClass() {
  classes = classes.filter(function(c) { return c.id !== deletingClassId; });
  saveClasses();
  closeModal('delete-class-modal');
  renderClasses();
  updateDashboard();
}


// ============================================================
//  FEATURE 3 — DASHBOARD STATS & CHART
// ============================================================

function updateDashboard() {
  var total = members.length;

  // Count members per plan
  var bronzeCount = members.filter(function(m) { return m.plan === 'bronze'; }).length;
  var silverCount = members.filter(function(m) { return m.plan === 'silver'; }).length;
  var goldCount   = members.filter(function(m) { return m.plan === 'gold';   }).length;

  // Find the most popular plan
  var popular = 'None';
  if (total > 0) {
    var counts = { bronze: bronzeCount, silver: silverCount, gold: goldCount };
    popular = Object.keys(counts).reduce(function(a, b) {
      return counts[a] >= counts[b] ? a : b;
    });
    popular = popular.charAt(0).toUpperCase() + popular.slice(1); // capitalize
  }

  // Update the stat cards
  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-active').textContent  = total; // all members have active plans
  document.getElementById('stat-classes').textContent = classes.length;
  document.getElementById('stat-popular').textContent = popular;

  // Update the bar chart
  // Each bar width = (count / total) * 100%
  if (total > 0) {
    var bPct = Math.round((bronzeCount / total) * 100);
    var sPct = Math.round((silverCount / total) * 100);
    var gPct = Math.round((goldCount   / total) * 100);

    document.getElementById('bar-bronze').style.width = bPct + '%';
    document.getElementById('bar-silver').style.width = sPct + '%';
    document.getElementById('bar-gold').style.width   = gPct + '%';

    document.getElementById('bar-bronze').textContent = bronzeCount;
    document.getElementById('bar-silver').textContent = silverCount;
    document.getElementById('bar-gold').textContent   = goldCount;
  } else {
    // Reset bars if no members
    ['bar-bronze','bar-silver','bar-gold'].forEach(function(id) {
      document.getElementById(id).style.width = '0%';
      document.getElementById(id).textContent = '0';
    });
  }
}



function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// Close any modal when clicking the dark overlay
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});


 =

function showMsg(showId, hideId) {
  var showEl = document.getElementById(showId);
  var hideEl = document.getElementById(hideId);

  if (hideEl) hideEl.classList.remove('show');
  showEl.classList.add('show');

  // Auto-hide after 3 seconds
  setTimeout(function() {
    showEl.classList.remove('show');
  }, 3000);
}
 

function init() {
  filterMembers();   // render members table
  renderClasses();   // render classes table
  updateDashboard(); // fill in stats
}
 
init();