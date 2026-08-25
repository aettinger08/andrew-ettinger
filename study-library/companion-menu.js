const BASE='https://qgkexntrqccusjzxlmyg.supabase.co/functions/v1/';
const QUOTES=BASE+'quote-library-lookup';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function installStyles(){
 const style=document.createElement('style');
 style.textContent=`
 .menu-nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 18px;padding-bottom:16px;border-bottom:1px solid #e7e7e3}
 .menu-nav button{border:1px solid #e7e7e3;background:#fff;border-radius:9px;padding:10px 8px;font:600 13px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#444;cursor:pointer}
 .menu-nav button.active{background:#eaf2f8;border-color:#b9cfdf;color:#245d87}
 .menu-view[hidden]{display:none!important}
 .quote-tools{position:sticky;top:-18px;background:#fff;padding:2px 0 12px;z-index:2}
 .quote-search{display:grid;grid-template-columns:1fr auto;gap:7px;margin-bottom:8px}
 .quote-search input,.quote-filter{width:100%;border:1px solid #d8d8d3;border-radius:8px;background:#fff;padding:10px 11px;font:15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
 .quote-search button{border:0;border-radius:8px;background:#2f6f9f;color:#fff;padding:0 14px;font-weight:600;cursor:pointer}
 .quote-summary{font-size:12px;color:#777;margin:7px 0 12px}
 .quote-card{border-top:1px solid #eee;padding:15px 0}
 .quote-card:first-child{border-top:0}
 .quote-category{font:700 11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#777;margin-bottom:5px}
 .quote-topic{font:700 18px/1.3 Georgia,"Times New Roman",serif;margin:0 0 8px;color:#252525}
 .quote-text{white-space:pre-wrap;font:16px/1.5 Georgia,"Times New Roman",serif;color:#252525}
 .quote-source{font-size:12px;margin-top:9px}
 .quote-source a{color:#2f6f9f;text-decoration:none}
 .quote-meta{font-size:11px;color:#888;margin-top:7px}
 .quote-load{width:100%;border:1px solid #d8d8d3;background:#f7f7f5;border-radius:8px;padding:10px;margin:12px 0;cursor:pointer;font-weight:600}
 .menu-home{display:grid;gap:8px;margin-bottom:16px}
 .menu-home button{display:flex;justify-content:space-between;align-items:center;width:100%;border:0;border-bottom:1px solid #eee;background:#fff;padding:12px 2px;text-align:left;font:600 15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#252525;cursor:pointer}
 .menu-home button span:last-child{color:#2f6f9f}
 `;
 document.head.appendChild(style);
}

function setup(){
 const drawer=document.getElementById('drawer'),body=drawer?.querySelector('.drawerbody'),head=drawer?.querySelector('.drawerhead h2');
 const auth=document.getElementById('authBox'),study=document.getElementById('studyBox'),top=document.getElementById('studyBtn');
 if(!drawer||!body||!auth||!study||body.dataset.menuReady)return;
 body.dataset.menuReady='1';installStyles();
 if(head)head.textContent='Study Companion';
 if(top){const count=document.getElementById('studyCount');top.childNodes[0].nodeValue='Menu';if(count)count.title='Saved study items'}
 const nav=document.createElement('div');nav.className='menu-nav';nav.innerHTML='<button class="active" data-menu-view="study">My Study</button><button data-menu-view="quotes">Quotes</button>';
 const studyView=document.createElement('div');studyView.className='menu-view';studyView.id='menuStudyView';
 auth.parentNode.insertBefore(studyView,auth);studyView.append(auth,study);
 const quoteView=document.createElement('div');quoteView.className='menu-view';quoteView.id='menuQuoteView';quoteView.hidden=true;
 quoteView.innerHTML=`<div class="quote-tools"><div class="quote-search"><input id="quoteSearch" type="search" placeholder="Search all quotes…"><button id="quoteSearchBtn">Search</button></div><select class="quote-filter" id="quoteCategory"><option value="">All quote collections</option></select><div class="quote-summary" id="quoteSummary">Loading quote library…</div></div><div id="quoteResults"></div><button class="quote-load" id="quoteLoadMore" hidden>Load more</button>`;
 body.insertBefore(nav,studyView);body.appendChild(quoteView);
 let offset=0,total=0,lastQ='',lastSheet='',busy=false;
 const qInput=quoteView.querySelector('#quoteSearch'),qCat=quoteView.querySelector('#quoteCategory'),results=quoteView.querySelector('#quoteResults'),summary=quoteView.querySelector('#quoteSummary'),more=quoteView.querySelector('#quoteLoadMore');
 function switchView(id){nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.menuView===id));studyView.hidden=id!=='study';quoteView.hidden=id!=='quotes';if(id==='quotes'&&!qCat.dataset.loaded)loadQuotes(true)}
 nav.querySelectorAll('button').forEach(b=>b.onclick=()=>switchView(b.dataset.menuView));
 function renderRows(rows,append){const html=(rows||[]).map(r=>`<article class="quote-card"><div class="quote-category">${esc(r.sheet_category||r.sheet_name||'Quotes')}</div>${r.topic?`<div class="quote-topic">${esc(r.topic)}</div>`:''}<div class="quote-text">${esc(r.quote_text)}</div>${r.source_url?`<div class="quote-source"><a href="${esc(r.source_url)}" target="_blank">Open cited source →</a></div>`:''}<div class="quote-meta">${esc(r.sheet_name)} · row ${esc(r.row_number)}${r.cell_reference?' · '+esc(r.cell_reference):''}</div></article>`).join('');if(append)results.insertAdjacentHTML('beforeend',html);else results.innerHTML=html||'<div class="empty">No matching quotes found.</div>'}
 async function loadQuotes(reset=false){if(busy)return;busy=true;if(reset){offset=0;lastQ=qInput.value.trim();lastSheet=qCat.value;results.innerHTML='<div class="loading">Searching quotes…</div>'}const url=QUOTES+'?q='+encodeURIComponent(lastQ)+'&sheet='+encodeURIComponent(lastSheet)+'&limit=25&offset='+offset;try{const j=await fetch(url).then(r=>r.json());if(!qCat.dataset.loaded&&j.categories){const current=qCat.value;for(const c of j.categories){const o=document.createElement('option');o.value=c.sheet_name;o.textContent=(c.sheet_category||c.sheet_name)+' ('+c.quote_count+')';qCat.appendChild(o)}qCat.value=current;qCat.dataset.loaded='1'}total=j.total||0;renderRows(j.results||[],!reset);offset+=(j.results||[]).length;summary.textContent=total.toLocaleString()+' quote'+(total===1?'':'s')+(lastQ?' matching “'+lastQ+'”':'');more.hidden=offset>=total||!total}catch(e){results.innerHTML='<div class="empty">Quote library could not be reached.</div>';summary.textContent=''}finally{busy=false}}
 quoteView.querySelector('#quoteSearchBtn').onclick=()=>loadQuotes(true);qInput.addEventListener('keydown',e=>{if(e.key==='Enter')loadQuotes(true)});qCat.onchange=()=>loadQuotes(true);more.onclick=()=>loadQuotes(false);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
