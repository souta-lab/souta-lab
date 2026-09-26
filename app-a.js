const LETTERS=['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト'];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let current=null, remain=3600, tick=null;

function rng(seed){let x=(seed*1103515245+12345)>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}}
function shuffled(a,seed){const r=rng(seed),b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function optGroup(map){return `<div class="shared"><div class="shared-title">解答群</div><div class="shared-grid">${Object.entries(map).map(([k,v])=>`<div><b>${k}．</b>${esc(v)}</div>`).join('')}</div></div>`}
function flow(nodes){return `<div class="flow">${nodes.map((x,i)=>`${i?'<div class="arrow">↓</div>':''}<div class="node ${x.type||''}">${x.html}</div>`).join('')}</div>`}
function mkItem(id,label,answer,topic,explanation,options=null,input='select'){return {id,label,answer:Array.isArray(answer)?answer:[answer],topic,explanation,options,input}}
function mark(n){return `<span class="blank">（${n}）</span>`}

const termBank=[
['リエントラント','複数の処理から同時に呼び出されても互いに干渉せず正しく動作できるプログラムの性質。'],
['リロケータブル','主記憶上のどの位置に配置されても正しく実行できるプログラムの性質。'],
['リユーザブル','一度主記憶に読み込んだプログラムを再読込みせず繰り返し利用できる性質。'],
['リカーシブ','処理の途中で自分自身を呼び出すことができるプログラムの性質。'],
['スタック','最後に格納したデータを最初に取り出すLIFO方式のデータ構造。'],
['キュー','最初に格納したデータを最初に取り出すFIFO方式のデータ構造。'],
['リスト','データ部と次のデータ位置を示す情報を組み合わせて連結するデータ構造。'],
['ポインタ','データが置かれているメモリ上の位置を表すために用いる値や変数。'],
['結合テスト','複数のモジュールを組み合わせ、モジュール間のデータ受渡しなどを確認するテスト。'],
['リグレッションテスト','プログラム変更後に既存機能へ悪影響がないか確認するテスト。'],
['負荷テスト','大量アクセスなど意図的に大きな負荷を与えて動作を確認するテスト。'],
['性能テスト','応答時間や処理能力など、システムが要求された性能を満たすか確認するテスト。'],
['DHCP','IPアドレスなどの通信設定を端末へ自動的に割り当てるプロトコル。'],
['NAT','プライベートIPアドレスとグローバルIPアドレスを変換する技術。'],
['IPv6','128ビット長のIPアドレスを利用する通信規約。'],
['ルータ','異なるネットワーク間でIPパケットの経路選択を行う中継機器。'],
['RAID','複数の記憶装置を組み合わせて高速化や耐障害性向上を図る技術。'],
['完全性','情報が欠損・改ざんされず正確な状態に保たれている性質。'],
['可用性','必要なときにシステムや情報を利用できる性質。'],
['MIPS','1秒間に実行できる命令数を百万命令単位で表す性能指標。'],
['情報落ち','絶対値の大きく異なる数を加減算したとき、小さい側が結果に反映されなくなる誤差。'],
['桁落ち','ほぼ等しい数の差を取った際に有効数字が大きく失われる誤差。'],
['丸め誤差','表現可能な桁数に収めるための丸め処理によって生じる誤差。'],
['カプセル化','データと処理をまとめ、外部からの直接アクセスを制限する考え方。'],
['インスタンス','クラスをもとに生成された具体的なオブジェクト。']
];

function makeS1(seed){
  const pool=shuffled(termBank,seed); const qs=pool.slice(0,5); const terms=shuffled([...qs.map(x=>x[0]),...pool.slice(5,12).map(x=>x[0])],seed+77);
  const map={};terms.forEach((t,i)=>map[LETTERS[i]]=t);
  const items=qs.map((q,i)=>mkItem(`s1_${i}`,`${i+1}．${q[1]}`,LETTERS[terms.indexOf(q[0])],'関連知識',`${q[0]}：${q[1]}`,map));
  return {num:1,title:'説明文に最も適した語句',points:10,body:`<p>次の説明文に最も適した答えを解答群から選び、記号で答えなさい。</p>${optGroup(map)}`,items};
}
function makeS2(seed){
  const pool=shuffled(termBank,seed+101); const targets=pool.slice(0,5); const descs=shuffled([...targets.map(x=>x[1]),...pool.slice(5,10).map(x=>x[1])],seed+202);
  const map={};descs.forEach((d,i)=>map[LETTERS[i]]=d);
  const ag=targets.map((x,i)=>`${i+1}．${x[0]}`).join('　　');
  const items=targets.map((q,i)=>mkItem(`s2_${i}`,`${i+1}．${q[0]}`,LETTERS[descs.indexOf(q[1])],'関連知識',`${q[0]}は「${q[1]}」に対応する。`,map));
  return {num:2,title:'A群とB群の対応',points:10,body:`<p>次のA群の語句に最も関係の深い説明文をB群から選び、記号で答えなさい。</p><div class="shared"><b>＜A群＞</b><div>${ag}</div></div>${optGroup(map).replace('解答群','＜B群＞')}`,items};
}
function makeS3(seed){
 const n=seed;
 const dec=20+n; const bcd=(Math.floor(dec/10).toString(2).padStart(4,'0')+(dec%10).toString(2).padStart(4,'0'));
 const neg=20+n; const tw=((256-neg)&255).toString(2).padStart(8,'0');
 const raw=0b10110100 + (n%4); const shift=1+(n%2); const shifted=((raw<<shift)&255).toString(2).padStart(8,'0');
 const mips=40+n*5, sec=(2+(n%4))/10, inst=mips*sec;
 const rate=100+(n%3)*50, eff=0.8, secs=8+(n%5)*2, mb=rate*eff*secs/8;
 const items=[
 mkItem('s3_0',`1．10進数 ${dec} を2進化10進数（BCD）で表したもの。`,'イ','数値表現',`${dec} は10の位と1の位をそれぞれ4ビット化するので ${bcd}。`,{'ア':dec.toString(2).padStart(8,'0'),'イ':bcd,'ウ':(dec+1).toString(2).padStart(8,'0')}),
 mkItem('s3_1',`2．10進数 -${neg} を8ビットの2の補数で表したもの。`,'ウ','数値表現',`256-${neg}=${256-neg} を8ビット2進数にすると ${tw}。`,{'ア':neg.toString(2).padStart(8,'0'),'イ':((255-neg)&255).toString(2).padStart(8,'0'),'ウ':tw}),
 mkItem('s3_2',`3．8ビット値 ${raw.toString(2).padStart(8,'0')} を${shift}ビット論理左シフトした結果。`,'ア','シフト演算',`左へ${shift}ビット移し、右端を0で埋める。`,{'ア':shifted,'イ':(raw>>shift).toString(2).padStart(8,'0'),'ウ':raw.toString(2).padStart(8,'0')}),
 mkItem('s3_3',`4．${mips} MIPSのCPUが${sec}秒間動作した。実行命令数として正しいもの。`,'ウ','関連知識',`${mips}×${sec}=${inst} より ${inst}百万命令。`,{'ア':`${mips/sec}百万命令`,'イ':`${mips+inst}百万命令`,'ウ':`${inst}百万命令`}),
 mkItem('s3_4',`5．${rate}Mbpsの回線で${mb}MBを転送する。伝送効率80%、1MB=10^6Bとすると何秒か。`,String(secs),'関連知識',`${mb}×8 ÷ (${rate}×0.8) = ${secs} 秒。`,null,'number')
 ];
 return {num:3,title:'3択・計算',points:10,body:'<p>1〜4はア・イ・ウから選び、5は数値を答えなさい。</p>',items};
}

function progBubble(seed,offset=0){
 const asc=(seed+offset)%2===0; const comp=asc?'A(i) > A(i + 1)':'A(i) < A(i + 1)';
 const choices=['g = n To 2 Step -1','g = 1 To n','A(i) > A(i + 1)','A(i) < A(i + 1)','A(0) = A(i)'];
 const map=Object.fromEntries(choices.map((x,i)=>[LETTERS[i],x]));
 return {name:'交換法（バブルソート）',blanks:[
   {ans:'ア',exp:'外側のループは未確定範囲の末尾を n から2まで縮める。'},
   {ans:asc?'ウ':'エ',exp:`${asc?'昇順':'降順'}なので条件は ${comp}。`}
 ],map,code:`Sub Sort1(A() As Long, n As Long)\n  Dim g As Long\n  Dim i As Long\n  For ${mark(1)}\n    For i = 1 To g - 1\n      If ${mark(2)} Then\n        A(0) = A(i)\n        A(i) = A(i + 1)\n        A(i + 1) = A(0)\n      End If\n    Next i\n  Next g\nEnd Sub`};
}
function progSelection(seed){
 const choices=['s = m + 1 To n','r = s','r <> m','r = m','Dat(s) < Dat(r)','Dat(s) > Dat(r)'];
 const map=Object.fromEntries(choices.map((x,i)=>[LETTERS[i],x]));
 return {name:'選択法（セレクションソート）',blanks:[
  {ans:'ア',exp:'未確定範囲は m+1 から n まで調べる。'},
  {ans:'イ',exp:'より小さい値を見つけた位置 s を r に保持する。'},
  {ans:'ウ',exp:'最小位置が m と異なる場合だけ交換する。'}
 ],map,code:`Sub Sort2(Dat() As Long, n As Long)\n  Dim m As Long, r As Long, s As Long\n  For m = 1 To n - 1\n    r = m\n    For ${mark(1)}\n      If Dat(s) < Dat(r) Then\n        ${mark(2)}\n      End If\n    Next s\n    If ${mark(3)} Then\n      Dat(0) = Dat(m)\n      Dat(m) = Dat(r)\n      Dat(r) = Dat(0)\n    End If\n  Next m\nEnd Sub`};
}
function progInsertion(seed){
 const choices=['g = 2 To n','j = g - 1 To 1 Step -1','Dat(j) > Dat(0)','Dat(j + 1) = Dat(0)','Dat(j) < Dat(0)','g = 1 To n'];
 const map=Object.fromEntries(choices.map((x,i)=>[LETTERS[i],x]));
 return {name:'挿入法（インサーションソート）',blanks:[
  {ans:'ア',exp:'2番目の要素から順に整列済み部分へ挿入する。'},
  {ans:'ウ',exp:'昇順では作業値より大きい要素を右へずらす。'},
  {ans:'エ',exp:'空いた位置 j+1 に作業値を入れる。'}
 ],map,code:`Sub Sort3(Dat() As Long, n As Long)\n  Dim g As Long, j As Long\n  For ${mark(1)}\n    Dat(0) = Dat(g)\n    For j = g - 1 To 1 Step -1\n      If ${mark(2)} Then\n        Dat(j + 1) = Dat(j)\n      Else\n        Exit For\n      End If\n    Next j\n    ${mark(3)}\n  Next g\nEnd Sub`};
}
function progBinary(seed){
 const choices=['Jo = n','Jo = m - 1','Ka = m + 1','Code(m) > Key','Code(m) < Key','Ka = 1'];
 const map=Object.fromEntries(choices.map((x,i)=>[LETTERS[i],x]));
 return {name:'二分探索',blanks:[
  {ans:'ア',exp:'上限はデータ件数 n。'},
  {ans:'イ',exp:'中央値がキーより大きければ上限を m-1 にする。'}
 ],map,code:`Sub Search(Code() As Long, n As Long)\n  Dim Key As Long, Ka As Long, Jo As Long, m As Long\n  Key = Val(InputBox("検索値"))\n  Ka = 1\n  ${mark(1)}\n  m = Int((Ka + Jo) / 2)\n  Do While Ka <= Jo And Code(m) <> Key\n    If Code(m) > Key Then\n      ${mark(2)}\n    Else\n      Ka = m + 1\n    End If\n    m = Int((Ka + Jo) / 2)\n  Loop\nEnd Sub`};
}
function progRank(seed){
 const choices=['Jun(k) = Jun(k) + 1','Jun(i) = Jun(i) + 1','A(i) < A(k)','A(i) > A(k)','Jun(g) = 1','Jun(g) = 0'];
 const map=Object.fromEntries(choices.map((x,i)=>[LETTERS[i],x]));
 return {name:'順位付け',blanks:[
  {ans:'オ',exp:'順位は最初に1で初期化する。'},
  {ans:'ウ',exp:'A(i)が小さいならi側の順位を1つ下げるための分岐条件。'},
  {ans:'ア',exp:'A(i)>A(k) の場合は k 側の順位を1増やす。'}
 ],map,code:`Sub Ranking(A() As Long, Jun() As Long, n As Long)\n  Dim g As Long, i As Long, k As Long\n  For g = 1 To n\n    ${mark(1)}\n  Next g\n  For i = 1 To n - 1\n    For k = i + 1 To n\n      If ${mark(2)} Then\n        Jun(i) = Jun(i) + 1\n      ElseIf A(i) > A(k) Then\n        ${mark(3)}\n      End If\n    Next k\n  Next i\nEnd Sub`};
}
function makeS4(seed){
 const algs=[progBubble,progSelection,progInsertion,progBinary,progRank];
 let a=algs[seed%algs.length](seed), b=algs[(seed+2)%algs.length](seed+1);
 if(a.blanks.length+b.blanks.length!==5){b=(a.blanks.length===2?progSelection:progBinary)(seed+3)}
 const blocks=[]; const items=[]; let idx=1;
 [a,b].forEach((p,pi)=>{
   const code=p.code.replace(/（(\d+)）/g,(_,d)=>`（${Number(d)+idx-1}）`);
   blocks.push(`<h3>問${pi+1}．${p.name}</h3><div class="code">${code}</div>${optGroup(p.map)}`);
   p.blanks.forEach((bl,j)=>{items.push(mkItem(`s4_${idx}`,`（${idx}）`,bl.ans,'マクロ言語',bl.exp,p.map));idx++});
 });
 return {num:4,title:'マクロ言語プログラム穴埋め',points:15,body:`<p>プログラムの説明・処理を読み、⑴〜⑸にあてはまる答えをそれぞれの解答群から選びなさい。</p>${blocks.join('')}`,items};
}
