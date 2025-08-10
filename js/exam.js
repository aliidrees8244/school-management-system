// exam.js - simple, clear, tested for the HTML above
const STORAGE_KEY = 'school_exams_v1';

function loadStorage(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');}
function saveStorage(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data));}
function el(q){ return document.querySelector(q); }
function elAll(q){ return Array.from(document.querySelectorAll(q)); }
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

let exams = loadStorage();
let editingIndex = null;

/* DOM refs */
const openAddBtn = el('#openAddBtn');
const formCard = el('#formCard');
const examForm = el('#examForm');
const cancelFormBtn = el('#cancelFormBtn');
const saveExamBtn = el('#saveExamBtn');

const examTitle = el('#examTitle');
const examType = el('#examType');
const examClassInput = el('#examClassInput');
const examSubjectInput = el('#examSubjectInput');
const examDateInput = el('#examDateInput');
const startTime = el('#startTime');
const endTime = el('#endTime');
const totalMarks = el('#totalMarks');
const passingMarks = el('#passingMarks');

const tableBody = el('#examTable tbody');
const globalSearch = el('#globalSearch');
const filterClass = el('#filterClass');

const statTotal = el('#statTotal');
const statUpcoming = el('#statUpcoming');
const statPast = el('#statPast');
const exportBtn = el('#exportBtn');

/* UI helpers */
function showForm(editIdx=null){
  formCard.style.display = 'block';
  if(editIdx===null){ editingIndex = null; examForm.reset(); el('#formTitle').textContent='Add New Exam'; saveExamBtn.textContent='Save Exam'; }
  else { editingIndex = editIdx; const ex = exams[editIdx]; el('#formTitle').textContent='Edit Exam'; 
    examTitle.value = ex.title; examType.value = ex.type; examClassInput.value = ex.class; examSubjectInput.value = ex.subject;
    examDateInput.value = ex.date; startTime.value = ex.startTime || ''; endTime.value = ex.endTime || '';
    totalMarks.value = ex.totalMarks || ''; passingMarks.value = ex.passingMarks || ''; saveExamBtn.textContent='Update Exam';
  }
  window.scrollTo({top:0, behavior:'smooth'});
}
function hideForm(){ formCard.style.display = 'none'; editingIndex = null; examForm.reset(); }

/* data -> UI */
function rebuildFilterOptions(){
  const classes = Array.from(new Set(exams.map(e=>e.class).filter(Boolean))).sort();
  filterClass.innerHTML = '<option value="">All Classes</option>'+classes.map(c=>`<option>${escapeHtml(c)}</option>`).join('');
}
function updateStats(){
  const today = new Date().toISOString().split('T')[0];
  statTotal.textContent = exams.length;
  statUpcoming.textContent = exams.filter(e=> e.date >= today ).length;
  statPast.textContent = exams.filter(e=> e.date < today ).length;
}
function renderTable(){
  const q = (globalSearch.value || '').trim().toLowerCase();
  const fClass = (filterClass.value || '').trim();
  const today = new Date().toISOString().split('T')[0];

  const rows = exams
    .map((e, i)=> ({...e, _i:i}))
    .filter(r=>{
      if(fClass && r.class !== fClass) return false;
      if(!q) return true;
      return Object.values(r).some(v => String(v||'').toLowerCase().includes(q));
    });

  if(rows.length===0){ tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No exams found</td></tr>'; updateStats(); return; }

  tableBody.innerHTML = rows.map(r => `
    <tr class="${r.date >= today ? '' : ''}">
      <td>${escapeHtml(r.title)}</td>
      <td>${escapeHtml(r.type)}</td>
      <td>${escapeHtml(r.class)}</td>
      <td>${escapeHtml(r.subject)}</td>
      <td>${escapeHtml(r.date)}</td>
      <td>
        <button class="action-btn edit" data-i="${r._i}">Edit</button>
        <button class="action-btn delete" data-i="${r._i}">Delete</button>
      </td>
    </tr>
  `).join('');
  updateStats();
}

/* events */
openAddBtn.addEventListener('click', ()=> showForm(null));
cancelFormBtn.addEventListener('click', hideForm);

examForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const title = examTitle.value.trim();
  const type = examType.value.trim();
  const cls = examClassInput.value.trim();
  const subj = examSubjectInput.value.trim();
  const date = examDateInput.value;
  if(!title || !type || !cls || !subj || !date){ alert('Please fill required fields'); return; }

  const payload = {
    title, type, class: cls, subject: subj, date,
    startTime: startTime.value, endTime: endTime.value, totalMarks: totalMarks.value, passingMarks: passingMarks.value
  };

  if(editingIndex===null){
    exams.push(payload);
  } else {
    exams[editingIndex] = payload;
  }
  saveStorage(exams);
  rebuildFilterOptions();
  renderTable();
  hideForm();
});

/* table action delegation */
tableBody.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const idx = Number(btn.dataset.i);
  if(btn.classList.contains('edit')){ showForm(idx); }
  else if(btn.classList.contains('delete')){
    if(confirm('Delete this exam?')) {
      exams.splice(idx,1);
      saveStorage(exams);
      rebuildFilterOptions(); renderTable();
    }
  }
});

/* search, filter, export */
globalSearch.addEventListener('input', ()=> renderTable());
filterClass.addEventListener('change', ()=> renderTable());
exportBtn.addEventListener('click', ()=>{
  if(exams.length===0){ alert('No data to export'); return; }
  const header = ['Title','Type','Class','Subject','Date','StartTime','EndTime','TotalMarks','PassingMarks'];
  const csv = [header, ...exams.map(e=>[e.title,e.type,e.class,e.subject,e.date,e.startTime||'',e.endTime||'',e.totalMarks||'',e.passingMarks||''])]
    .map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download='exams.csv'; a.click(); URL.revokeObjectURL(url);
});

/* init */
(function init(){
  rebuildFilterOptions();
  renderTable();
  // hide form initially
  hideForm();
})();
