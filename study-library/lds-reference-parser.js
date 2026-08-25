// Study Companion LDS Standard Works reference parser
// Supports Bible, Book of Mormon, Doctrine and Covenants, and Pearl of Great Price.
const LDS_BOOKS = [
'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalm','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation',
'1 Nephi','2 Nephi','Jacob','Enos','Jarom','Omni','Words of Mormon','Mosiah','Alma','Helaman','3 Nephi','4 Nephi','Mormon','Ether','Moroni',
'Doctrine and Covenants','Doctrine & Covenants','D&C','DC','Moses','Abraham','Joseph Smith—Matthew','Joseph Smith-Matthew','Joseph Smith—History','Joseph Smith-History','JS—M','JS-M','JS—H','JS-H','Articles of Faith'
];
const BIBLE_BOOKS = new Set(LDS_BOOKS.slice(0,67).map(x=>x.toLowerCase()));
const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const LDS_REF_RE=new RegExp('\\b('+LDS_BOOKS.sort((a,b)=>b.length-a.length).map(escRe).join('|')+')\\s+(\\d+):(\\d+)','i');
const SLUGS={
'1-ne':['1 Nephi','bofm'],'2-ne':['2 Nephi','bofm'],jacob:['Jacob','bofm'],enos:['Enos','bofm'],jarom:['Jarom','bofm'],omni:['Omni','bofm'],'w-of-m':['Words of Mormon','bofm'],mosiah:['Mosiah','bofm'],alma:['Alma','bofm'],hel:['Helaman','bofm'],'3-ne':['3 Nephi','bofm'],'4-ne':['4 Nephi','bofm'],morm:['Mormon','bofm'],ether:['Ether','bofm'],moro:['Moroni','bofm'],dc:['Doctrine and Covenants','dc-testament'],moses:['Moses','pgp'],abr:['Abraham','pgp'],'js-m':['Joseph Smith—Matthew','pgp'],'js-h':['Joseph Smith—History','pgp'],'a-of-f':['Articles of Faith','pgp'],
gen:['Genesis','ot'],ex:['Exodus','ot'],lev:['Leviticus','ot'],num:['Numbers','ot'],deut:['Deuteronomy','ot'],josh:['Joshua','ot'],judg:['Judges','ot'],ruth:['Ruth','ot'],ps:['Psalms','ot'],prov:['Proverbs','ot'],isa:['Isaiah','ot'],jer:['Jeremiah','ot'],matt:['Matthew','nt'],mark:['Mark','nt'],luke:['Luke','nt'],john:['John','nt'],acts:['Acts','nt'],rom:['Romans','nt'],heb:['Hebrews','nt'],rev:['Revelation','nt']};
function canonicalBook(s){return s.replace(/^Doctrine\s*&\s*Covenants$/i,'Doctrine and Covenants').replace(/^D&C$|^DC$/i,'Doctrine and Covenants').replace(/^Joseph Smith[-—]History$/i,'Joseph Smith—History').replace(/^JS[-—]H$/i,'Joseph Smith—History').replace(/^Joseph Smith[-—]Matthew$/i,'Joseph Smith—Matthew').replace(/^JS[-—]M$/i,'Joseph Smith—Matthew')}
export function isBibleReference(ref=''){const m=ref.match(/^(.+?)\s+\d+:\d+$/);return !!m && BIBLE_BOOKS.has(canonicalBook(m[1]).toLowerCase())}
function applyTabVisibility(ref){
 const bible=isBibleReference(ref);
 const sync=()=>{document.querySelectorAll('.tab[data-id="translations"]').forEach(el=>{el.style.display=bible?'':'none'})};
 sync();
 if(typeof MutationObserver!=='undefined')new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true});
}
export function parseLDSShare(input,explicitRef=''){
 let s=(input||'').replace(/\u00a0/g,' ').trim(),url='';const ui=s.search(/https?:\/\//i);if(ui>=0){url=s.slice(ui).trim();s=s.slice(0,ui).trim()}
 let book='',chapter='',verse='',ref=explicitRef;
 const m=(ref||s).match(LDS_REF_RE);if(m){book=canonicalBook(m[1]);chapter=m[2];verse=m[3];ref=`${book} ${chapter}:${verse}`;s=s.replace(m[0],' ').trim()}
 if(!ref&&url){const u=url.match(/\/scriptures\/(ot|nt|bofm|dc-testament|pgp)\/([^/]+)\/(\d+).*?(?:id=p(\d+)|#p(\d+))/i);if(u){const x=SLUGS[u[2].toLowerCase()];book=x?.[0]||u[2];chapter=u[3];verse=u[4]||u[5]||'';ref=`${book} ${chapter}${verse?':'+verse:''}`}}
 if(ref&&s&&book)s=s.replace(new RegExp('^'+escRe(book).replace(/\\ /g,'\\s+')+'\\s+'+chapter+'\\s*[:.]?\\s*'+verse+'\\s*','i'),'').trim();
 if(typeof document!=='undefined')applyTabVisibility(ref);
 return{text:s.replace(/^[-–—:;,.\s]+|[-–—:;,.\s]+$/g,'').replace(/\s+/g,' '),url,ref};
}
