// Simple interactivity: job calculator and proposal storage in localStorage
document.addEventListener('DOMContentLoaded', ()=>{
  const calcForm = document.getElementById('calcForm');
  const resultEl = document.getElementById('result');
  const proposalsKey = 'sdg8_proposals_v1';

  calcForm.addEventListener('submit', e=>{
    e.preventDefault();
    const investment = Number(document.getElementById('investment').value) || 0;
    const costPerJob = Number(document.getElementById('costPerJob').value) || 1;
    const jobs = Math.floor(investment / costPerJob);
    const remainder = investment - jobs * costPerJob;
    resultEl.innerHTML = `<strong>Estimated jobs:</strong> ${jobs.toLocaleString()}<br><small>Remainder: $${remainder.toLocaleString()}</small>`;
  });

  // Proposals
  const proposalForm = document.getElementById('proposalForm');
  const proposalsList = document.getElementById('proposalsList');

  function loadProposals(){
    const raw = localStorage.getItem(proposalsKey);
    return raw ? JSON.parse(raw) : [];
  }

  function saveProposals(list){
    localStorage.setItem(proposalsKey, JSON.stringify(list));
  }

  function renderProposals(){
    const list = loadProposals();
    if(!list.length){
      proposalsList.innerHTML = '<em>No proposals yet — be the first.</em>';
      return;
    }
    proposalsList.innerHTML = '';
    list.slice().reverse().forEach(p=>{
      const el = document.createElement('div');
      el.className = 'proposal-item';
      el.innerHTML = `<strong>${escapeHtml(p.name||'Anonymous')}</strong> — <span>${escapeHtml(p.idea)}</span><br><small>Est. cost/job: $${Number(p.cost).toLocaleString()}</small>`;
      proposalsList.appendChild(el);
    });
  }

  proposalForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('propName').value.trim();
    const idea = document.getElementById('propIdea').value.trim();
    const cost = Number(document.getElementById('propCost').value) || 0;
    if(!idea) return;
    const list = loadProposals();
    list.push({name,idea,cost,ts:Date.now()});
    saveProposals(list);
    renderProposals();
    proposalForm.reset();
  });

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  // Initial render
  renderProposals();
});
