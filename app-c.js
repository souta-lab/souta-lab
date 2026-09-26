function secFlow(num,title,points,body,map,answers,exps,topics,multi=false){
 const items=answers.map((a,i)=>mkItem(`s${num}_${i}`,`（${i+1}）`,a,topics[i],exps[i],map));
 return {num,title,points,body,items,multi};
}
function makeExam(n){const seed=n+17;return {n,sections:[makeS1(seed),makeS2(seed),makeS3(seed),makeS4(seed),makeS5(seed),makeS6(seed),makeS7(seed)]}}

function renderItem(item,sec){
 const id=item.id;
 if(item.input==='number') return `<div class="answer-row"><b>${item.label}</b><input type="number" step="any" name="${id}" aria-label="${item.label}"></div>`;
 const answers=item.answer.length;
 const opts=item.options||{};
 const selects=Array.from({length:answers},(_,j)=>`<select name="${id}_${j}"><option value="">--</option>${Object.keys(opts).map(k=>`<option value="${k}">${k}</option>`).join('')}</select>`).join(' ');
 return `<div class="answer-row"><b>${item.label}${answers>1?` <span class="mut">${answers}個</span>`:''}</b><div>${selects}</div></div>`;
}
function renderSection(sec){
 let custom='';
 if(sec.num===1){custom=sec.items.map(x=>`<div class="question"><span class="n">${x.label}</span></div>`).join('')}
 else if(sec.num===3){custom=sec.items.slice(0,4).map(x=>`<div class="question"><div class="n">${x.label}</div><div class="choice-grid">${Object.entries(x.options).map(([k,v])=>`<label class="choice"><input type="radio" name="${x.id}_radio" value="${k}" onchange="document.querySelector('[name=${x.id}_0]').value=this.value"><b>${k}</b> ${esc(v)}</label>`).join('')}</div></div>`).join('')}
 const answerArea=sec.items.map(x=>renderItem(x,sec)).join('');
 return `<section class="paper sec" data-sec="${sec.num}"><div class="sectitle"><h2>【${sec.num}】 ${sec.title}</h2><div class="pts">${sec.points}点</div></div>${sec.body}${custom}<div class="shared"><div class="shared-title">解答欄</div>${answerArea}</div></section>`;
}
function startExam(n){current=makeExam(n);remain=3600;clearInterval(tick);$('#examTitle').textContent=`模擬試験 ${n}`;$('#examForm').innerHTML=current.sections.map(renderSection).join('');$('#result').innerHTML='';go('exam');renderTimer();tick=setInterval(()=>{remain--;renderTimer();if(remain<=0){clearInterval(tick);gradeExam(null,true)}},1000);window.scrollTo(0,0)}
function renderTimer(){const m=Math.floor(remain/60),s=remain%60;$('#timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function getAnswer(item){if(item.input==='number'){const v=document.querySelector(`[name=${item.id}]`).value;return [v]}return item.answer.map((_,j)=>document.querySelector(`[name=${item.id}_${j}]`)?.value||'')}
function equalAnswer(got,expected,input){if(input==='number'){if(got[0]==='')return false;return Math.abs(Number(got[0])-Number(expected[0]))<1e-9}return got.length===expected.length&&got.every((x,i)=>x===expected[i])}
function gradeExam(ev,auto=false){if(ev)ev.preventDefault();if(!current)return;clearInterval(tick);let score=0,total=0;const topic={};const reviews=[];current.sections.forEach(sec=>{const each=sec.points/sec.items.length;sec.items.forEach(item=>{const got=getAnswer(item),ok=equalAnswer(got,item.answer,item.input);total+=each;if(ok)score+=each;if(!topic[item.topic])topic[item.topic]=[0,0];topic[item.topic][1]++;if(ok)topic[item.topic][0]++;reviews.push({sec:sec.num,item,got,ok,each})})});score=Math.round(score*100)/100;saveResult(current.n,score,topic);const bySec={};reviews.forEach(r=>{if(!bySec[r.sec])bySec[r.sec]=[];bySec[r.sec].push(r)});$('#result').innerHTML=`<div class="card"><div class="resultbig">${score} / 100</div><div style="text-align:center;font-weight:900" class="${score>=70?'oktxt':'ngtxt'}">${score>=70?'70点到達':'70点まであと '+(70-score)+'点'}</div></div>${Object.entries(bySec).map(([sn,rs])=>`<div class="card"><h3>【${sn}】解説</h3>${rs.map(r=>`<div class="card review ${r.ok?'ok':'ng'}"><b>${r.item.label}</b> <span class="${r.ok?'oktxt':'ngtxt'}">${r.ok?'正解':'不正解'}</span><div>あなた：${r.got.filter(Boolean).join('・')||'未解答'} ／ 正解：${r.item.answer.join('・')}</div><div class="mut">${r.item.explanation}</div></div>`).join('')}</div>`).join('')}`;renderWeak();$('#result').scrollIntoView({behavior:'smooth'})}

function saveResult(n,score,topics){const db=JSON.parse(localStorage.getItem('zensho_prog_v2')||'{}');db[n]={score,topics,at:Date.now()};localStorage.setItem('zensho_prog_v2',JSON.stringify(db));renderSets()}
function renderSets(){const db=JSON.parse(localStorage.getItem('zensho_prog_v2')||'{}');$('#setList').innerHTML=Array.from({length:10},(_,i)=>i+1).map(n=>`<div class="card setrow"><div><b>模擬試験 ${n}</b><div class="mut">7大問・100点・60分</div></div><div style="text-align:right">${db[n]?`<div class="score">${db[n].score}</div>`:''}<button class="primary" onclick="startExam(${n})">${db[n]?'解き直す':'開始'}</button></div></div>`).join('')}
function renderWeak(){const db=JSON.parse(localStorage.getItem('zensho_prog_v2')||'{}');const agg={};Object.values(db).forEach(r=>Object.entries(r.topics||{}).forEach(([k,[a,b]])=>{if(!agg[k])agg[k]=[0,0];agg[k][0]+=a;agg[k][1]+=b}));const rows=Object.entries(agg).sort((a,b)=>(a[1][0]/a[1][1])-(b[1][0]/b[1][1]));$('#weakBox').innerHTML=rows.length?rows.map(([k,[a,b]])=>{const p=Math.round(a/b*100);return `<div class="barrow"><b>${k}</b><div class="bar"><i style="width:${p}%"></i></div><div>${p}%</div></div>`}).join(''):'まだ採点結果がありません。まず模試1を解いてください。'}
function renderPast(){const url='https://zensho.or.jp/examination/pastexams/information/';$('#pastList').innerHTML=Array.from({length:36},(_,i)=>74-i).map(n=>`<a class="card" href="${url}" target="_blank" rel="noopener"><b>第${n}回</b><div class="mut">全商公式 過去問題ページ</div></a>`).join('')}
function go(id){$$('.view').forEach(v=>v.classList.toggle('on',v.id===id));$$('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===id));if(id!=='exam')window.scrollTo(0,0)}
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>go(b.dataset.v)));
renderSets();renderWeak();renderPast();