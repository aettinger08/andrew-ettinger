const verses = [
[1,"In the beginning God created the heaven and the earth."],
[2,"And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters."],
[3,"And God said, Let there be light: and there was light."],
[4,"And God saw the light, that it was good: and God divided the light from the darkness."],
[5,"And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."],
[6,"And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters."],
[7,"And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so."],
[8,"And God called the firmament Heaven. And the evening and the morning were the second day."],
[9,"And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so."],
[10,"And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good."],
[11,"And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so."],
[12,"And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good."],
[13,"And the evening and the morning were the third day."],
[14,"And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:"],
[15,"And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so."],
[16,"And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also."],
[17,"And God set them in the firmament of the heaven to give light upon the earth,"],
[18,"And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good."],
[19,"And the evening and the morning were the fourth day."],
[20,"And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven."],
[21,"And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good."],
[22,"And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth."],
[23,"And the evening and the morning were the fifth day."],
[24,"And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so."],
[25,"And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good."],
[26,"And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth."],
[27,"So God created man in his own image, in the image of God created he him; male and female created he them."],
[28,"And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth."],
[29,"And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat."],
[30,"And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so."],
[31,"And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day."]
];

const ldsFootnotes = {
  "1:beginning": {marker:"1a", html:"TG Time."},
  "1:God": {marker:"1b", html:"Mosiah 4:2; Mormon 9:11; Doctrine and Covenants 14:9; 76:24 (20–24); Moses 2:1; Abraham 4:1."},
  "1:created": {marker:"1c", html:"HEB shaped, fashioned, created; always divine activity; see Abraham 4:1, organized, formed. TG Creation; God, Creator."},
  "1:heaven": {marker:"1d", html:"Doctrine and Covenants 121:4; Moses 1:37 (36–38); 2:1; Abraham 4:1. TG Astronomy; Heaven."},
  "1:earth": {marker:"1e", html:"TG Nature, Earth."},
  "2:form": {marker:"2a", html:"Abraham 4:2."},
  "2:darkness": {marker:"2b", html:"TG Darkness, Physical."},
  "2:Spirit": {marker:"2c", html:"TG God, Spirit of."},
  "2:moved": {marker:"2d", html:"Moses 2:2; Abraham 4:2."},
  "26:us": {marker:"26a", html:"Abraham 4:27 (26–31); 5:7. TG Godhead; Jesus Christ, Creator."},
  "26:make": {marker:"26b", html:"TG Creation."},
  "26:man": {marker:"26c", html:"TG Adam; Man, Physical Creation of."},
  "26:image": {marker:"26d", html:"Mosiah 7:27; Ether 3:15 (14–17); Doctrine and Covenants 20:18 (17–18); Moses 1:6 (6, 13, 16); 2:26 (26–29); 6:9 (8–10); Abraham 4:26 (26–31)."},
  "26:likeness": {marker:"26e", html:"Genesis 5:3."},
  "26:dominion": {marker:"26f", html:"Proverbs 12:10; Doctrine and Covenants 49:19 (18–21); 76:111 (110–12); 121:37 (34–46); Moses 2:26 (26–28); Abraham 4:26 (26–28). TG Man, Potential to Become like Heavenly Father."}
};

const scripture = document.getElementById('scripture');
const studyPanel = document.getElementById('studyPanel');
const panelTitle = document.getElementById('panelTitle');
const panelEyebrow = document.getElementById('panelEyebrow');
const panelContent = document.getElementById('panelContent');
let current = {type:null, verse:null, word:null, key:null};
let selectedVerse = 1;
let store = JSON.parse(localStorage.getItem('study-library-data') || '{"notes":{},"highlights":{},"tags":{},"links":{}}');
const SUPABASE_URL='https://qgkexntrqccusjzxlmyg.supabase.co';
const SUPABASE_KEY='sb_publishable_fxGyeKwo2QfovWpKSfMiQw_w5N2yeYF';
const cloud = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
let cloudUser=null, realtimeChannel=null;
const clientId=localStorage.getItem('study-client-id') || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())+Math.random());
localStorage.setItem('study-client-id',clientId);

function saveStore(){localStorage.setItem('study-library-data',JSON.stringify(store));}
function mapKind(kind){return ({notes:'note',highlights:'highlight',tags:'tag',links:'link'})[kind]||kind;}
async function syncRecord(kind,key,value){
  saveStore(); if(!cloud||!cloudUser) return;
  const row={user_id:cloudUser.id,kind:mapKind(kind),target_key:key,payload:{value},client_id:clientId,client_updated_at:new Date().toISOString(),deleted_at:null};
  const {error}=await cloud.from('study_items').upsert(row,{onConflict:'user_id,kind,target_key'});
  if(error) console.warn('Cloud sync failed',error);
}
function applyCloudRow(row){
  const reverse={note:'notes',highlight:'highlights',tag:'tags',link:'links'}; const kind=reverse[row.kind]; if(!kind) return;
  if(row.deleted_at) delete store[kind][row.target_key]; else store[kind][row.target_key]=row.payload?.value;
  saveStore(); renderScripture(); if(current.type==='word'&&current.key===row.target_key) openWord(current.verse,current.word,null);
}
async function pullCloud(){
  if(!cloudUser) return; const {data,error}=await cloud.from('study_items').select('*').is('deleted_at',null).order('updated_at',{ascending:true});
  if(error){console.warn(error);return;} (data||[]).forEach(applyCloudRow); updateAuthUI();
}
async function startRealtime(){
  if(realtimeChannel) await cloud.removeChannel(realtimeChannel);
  realtimeChannel=cloud.channel('my-study-items').on('postgres_changes',{event:'*',schema:'public',table:'study_items',filter:`user_id=eq.${cloudUser.id}`},payload=>applyCloudRow(payload.new||payload.old)).subscribe();
}

function cleanWord(w){return w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g,'');}
function keyFor(v,w){return `${v}:${cleanWord(w)}`;}

function renderScripture(){
  scripture.innerHTML='';
  verses.forEach(([v,text])=>{
    const p=document.createElement('p'); p.className='verse'; p.dataset.verse=v;
    const num=document.createElement('span'); num.className='verse-num'; num.textContent=v; num.onclick=()=>openVerse(v);
    p.appendChild(num);
    text.split(/(\s+)/).forEach(token=>{
      if(/^\s+$/.test(token)){p.appendChild(document.createTextNode(token));return;}
      const s=document.createElement('span'); s.className='word'; s.textContent=token;
      const k=keyFor(v,token); if(ldsFootnotes[k]) s.classList.add('footnoted'); if(store.highlights[k]) s.classList.add('highlighted');
      s.onclick=(e)=>{e.stopPropagation(); openWord(v,token,s)}; p.appendChild(s);
    });
    scripture.appendChild(p);
  });
}

function panelOpen(){studyPanel.classList.add('open')}
function openVerse(v){
  selectedVerse=v; current={type:'verse',verse:v,key:`verse:${v}`}; panelEyebrow.textContent='VERSE'; panelTitle.textContent=`Genesis 1:${v}`;
  const text=verses.find(x=>x[0]===v)[1];
  panelContent.innerHTML=`<div class="action-grid"><button onclick="showCompare(${v})">⇄ Compare translations</button><button onclick="editNote('verse:${v}')">✎ Add note</button><button onclick="addTag('verse:${v}')"># Tag verse</button><button onclick="addLink('verse:${v}')">↗ Link passage</button></div><div class="card official"><div class="source-label official">Official LDS</div><h3>Verse tools</h3><p>${text}</p><p>Tap an underlined word in the reader to open its exact LDS footnote payload where available.</p></div><div class="card"><div class="source-label">Research</div><h3>Related resources</h3><div class="pillrow"><span class="mini-pill">Translations</span><span class="mini-pill">Commentaries</span><span class="mini-pill">Ancient texts</span><span class="mini-pill">Jewish sources</span></div></div>`;
  panelOpen();
}

function openWord(v,token,el){
  const word=cleanWord(token), k=`${v}:${word}`; current={type:'word',verse:v,word,key:k}; selectedVerse=v; panelEyebrow.textContent='WORD STUDY'; panelTitle.textContent=word || token;
  const fn=ldsFootnotes[k];
  panelContent.innerHTML=`<div class="action-grid"><button onclick="toggleHighlight('${k}')">▰ Highlight</button><button onclick="editNote('${k}')">✎ Note</button><button onclick="addTag('${k}')"># Tag</button><button onclick="addLink('${k}')">↗ Link</button></div>
  ${fn?`<div class="card official"><div class="source-label official">Official LDS · Footnote ${fn.marker}</div><h3>${word}</h3><p>${fn.html}</p></div>`:`<div class="card official"><div class="source-label official">Official LDS</div><h3>${word}</h3><p>No LDS footnote is attached to this word in the prototype dataset. The production importer will verify this against the canonical source.</p></div>`}
  <div class="card"><div class="source-label">Original language</div><h3>Hebrew / Greek</h3><p>Connector reserved for lemma, transliteration, morphology, Strong's and approved lexicon datasets.</p></div>
  <div class="card"><div class="source-label">Dictionaries</div><h3>Definitions</h3><div class="pillrow"><span class="mini-pill">Webster 1828</span><span class="mini-pill">Oxford</span><span class="mini-pill">Bible dictionaries</span></div></div>
  <div class="card"><div class="source-label">Other published sources</div><h3>Cross references & notes</h3><div class="pillrow"><span class="mini-pill">BLB-type tools</span><span class="mini-pill">Published footnotes</span><span class="mini-pill">Commentaries</span></div></div>`;
  panelOpen();
}

window.toggleHighlight=(k)=>{store.highlights[k]=!store.highlights[k];syncRecord('highlights',k,store.highlights[k]);renderScripture(); if(current.type==='word')openWord(current.verse,current.word,null)};
window.editNote=(k)=>{const old=store.notes[k]||''; panelContent.innerHTML=`<div class="card"><div class="source-label">My Note</div><h3>${k}</h3><textarea class="note-area" id="noteInput">${old}</textarea><button class="save-btn" onclick="saveNote('${k}')">Save note</button></div>`;};
window.saveNote=(k)=>{store.notes[k]=document.getElementById('noteInput').value;syncRecord('notes',k,store.notes[k]);renderMyNotes(k)};
function renderMyNotes(k){panelEyebrow.textContent='MY NOTES';panelTitle.textContent=k;panelContent.innerHTML=`<div class="card"><p>${store.notes[k]||'No note yet.'}</p><button class="save-btn" onclick="editNote('${k}')">Edit</button></div>`}
window.addTag=(k)=>{const tag=prompt('Add tag');if(!tag)return;store.tags[k]=[...(store.tags[k]||[]),tag];syncRecord('tags',k,store.tags[k]);alert(cloudUser?'Tag saved and syncing.':'Tag saved on this device; sign in to sync.');}
window.addLink=(k)=>{const target=prompt('Link this selection to (example: Moses 2:1)');if(!target)return;store.links[k]=[...(store.links[k]||[]),target];syncRecord('links',k,store.links[k]);alert(cloudUser?'Link saved and syncing.':'Link saved on this device; sign in to sync.');}

const modal=document.getElementById('compareModal'); document.getElementById('compareBtn').onclick=()=>modal.classList.remove('hidden');
document.querySelectorAll('[data-close-modal]').forEach(b=>b.onclick=()=>modal.classList.add('hidden'));
window.showCompare=(v)=>{selectedVerse=v;modal.classList.remove('hidden')};
document.getElementById('openCompare').onclick=()=>{modal.classList.add('hidden');const t=verses.find(x=>x[0]===selectedVerse)[1];document.getElementById('compareTitle').textContent=`Genesis 1:${selectedVerse}`;document.getElementById('ldsCompareText').textContent=t;const selected=[...modal.querySelectorAll('input[type=checkbox][value]:checked')].map(x=>x.value);document.getElementById('otherCompareText').innerHTML=selected.length?selected.map(x=>`<div class="translation-placeholder"><strong>${x}</strong><p>Licensed text connector pending. The comparison layout is ready and this translation will appear here without changing the KJV reading page.</p></div>`).join(''):'<p>Select one or more alternate translations to compare.</p>';document.getElementById('compareDrawer').classList.remove('hidden')};
document.getElementById('closeCompare').onclick=()=>document.getElementById('compareDrawer').classList.add('hidden');
document.getElementById('closePanel').onclick=()=>studyPanel.classList.remove('open');
document.getElementById('themeBtn').onclick=()=>document.body.classList.toggle('dark');
document.getElementById('libraryBtn').onclick=()=>document.getElementById('sidebar').classList.toggle('hidden');
document.getElementById('accountBtn').onclick=()=>document.getElementById('accountModal').classList.remove('hidden');
document.getElementById('searchBtn').onclick=()=>{const q=prompt('Search Genesis 1');if(!q)return;const hits=verses.filter(x=>x[1].toLowerCase().includes(q.toLowerCase())).map(x=>x[0]);alert(hits.length?`Found in verses: ${hits.join(', ')}`:'No matches in Genesis 1.');};
document.getElementById('studySetBtn').onclick=()=>alert('Study Sets scaffolded; cloud-sync data model comes next.');

document.querySelectorAll('.tab').forEach(tab=>tab.onclick=()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');if(tab.dataset.tab==='notes'){renderMyNotes(current.key||'Genesis 1')}else if(tab.dataset.tab==='links'){const k=current.key||'Genesis 1';panelContent.innerHTML=`<div class="card"><div class="source-label">My Links</div><p>${(store.links[k]||[]).join('<br>')||'No links yet.'}</p></div>`}else if(current.type==='verse')openVerse(current.verse);else if(current.type==='word')openWord(current.verse,current.word,null);});

const accountModal=document.getElementById('accountModal'), authStatus=document.getElementById('authStatus');
document.getElementById('closeAccount').onclick=()=>accountModal.classList.add('hidden');
function updateAuthUI(){
 const btn=document.getElementById('accountBtn'), out=document.getElementById('signOutBtn');
 if(cloudUser){btn.textContent='✓';btn.title=`Synced: ${cloudUser.email||'account'}`;authStatus.innerHTML=`<span class="cloud-dot online"></span>Signed in as <strong>${cloudUser.email||''}</strong> · cloud sync active`;out.classList.remove('hidden');}
 else{btn.textContent='↻';btn.title='Sign in to sync';authStatus.innerHTML='<span class="cloud-dot"></span>Not signed in · changes stay on this device';out.classList.add('hidden');}
}
async function bootstrapAuth(){
 if(!cloud) return; const {data}=await cloud.auth.getSession(); cloudUser=data.session?.user||null; updateAuthUI(); if(cloudUser){await pullCloud();await startRealtime();}
 cloud.auth.onAuthStateChange(async(_event,session)=>{cloudUser=session?.user||null;updateAuthUI();if(cloudUser){await pullCloud();await startRealtime();}});
}
document.getElementById('signInBtn').onclick=async()=>{const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||!password)return alert('Enter your email and password.');authStatus.textContent='Signing in…';const {error}=await cloud.auth.signInWithPassword({email,password});if(error)authStatus.textContent=error.message;};
document.getElementById('signUpBtn').onclick=async()=>{const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||password.length<6)return alert('Enter your email and a password of at least 6 characters.');authStatus.textContent='Creating account…';const {data,error}=await cloud.auth.signUp({email,password});if(error){authStatus.textContent=error.message;return;}authStatus.textContent=data.session?'Account created and signed in.':'Account created. Check your email once to confirm it, then sign in.';};
document.getElementById('signOutBtn').onclick=async()=>{await cloud.auth.signOut();cloudUser=null;updateAuthUI();};
bootstrapAuth();

if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
renderScripture();
