function makeS5(seed){
 const variant=seed%3;
 if(variant===0){
  const map={'ア':'Uji > Kubun(Soe)','イ':'Uji < Kubun(Soe)','ウ':'Skei(Soe) + 1 → Skei(Soe)','エ':'Gkei(1, f) + Skei(f) → Gkei(1, f)','オ':'Ihi → Hoz','カ':'Hoz → Ihi','キ':'Soe + 1 → Soe','ク':'1 → Soe','ケ':'Skei(f) → Gkei(1, f)','コ':'Gkei(0, f) + Skei(f) → Gkei(0, f)'};
  const body=`<p><b>処理内容：</b>就職イベントの参加記録（イベント日・企業番号・受付時刻）を読み、30分区分ごとの参加者数を日別・全体で集計する。入力はイベント日・企業番号の昇順。</p>
  <p>配列 Kubun(1)〜Kubun(14) に各時間区分の上限時刻、Skei に当日の区分別人数、Gkei(0,*) に全体合計を記憶する。</p>${flow([
   {html:'配列を初期化する'},{html:`最初のデータを読み ${mark(1)}`},{html:'データがある間',type:'loop'},{html:'1 → Soe'},{html:`ループ：${mark(2)} の間`},{html:`${mark(3)}`},{html:'Skei(Soe) + 1 → Skei(Soe)'},{html:'イベント日が変わったか？',type:'diamond'},{html:`${mark(4)}`},{html:`全体集計：${mark(5)}`}
  ])}${optGroup(map)}`;
  const ans=['オ','ク','キ','カ','コ']; const ex=['現在の日付を保存する。','区分探索は1から開始する。','上限時刻を超えている間、次の区分へ進む。','日付が変わったとき新しい日付を保存する。','当日値を全体の合計へ加算する。'];
  return secFlow(5,'コントロールブレイク＋区分集計',15,body,map,ans,ex,['コントロールブレイク','探索','探索','コントロールブレイク','多次元配列']);
 }
 if(variant===1){
  const map={'ア':'Nendai = Nen ÷ 10 - 1','イ':'Nendai = Nen ÷ 10','ウ':'Thyo(Nendai, Kai) + 1 → Thyo(Nendai, Kai)','エ':'Thyo(8, Kai) + 1 → Thyo(8, Kai)','オ':'k は 200 から 1 ずつ減らして k ≥ 1 の間','カ':'m は k - 1 から1ずつ減らして m ≥ 1 の間','キ':'Thyo(i,m) ≤ Thyo(i,0)','ク':'Jmei(m) → Temp(k)','ケ':'Temp(k) → Jmei(k)','コ':'Nen → Nendai'};
  const body=`<p><b>処理内容：</b>人物アンケート（年齢・回答番号）を読み、年代別と全年代の得票数を集計し、得票数の降順に表示する。</p><p>Jmei(1)〜Jmei(200)に人物名、Thyo(0..8,1..200)に年代別得票数を記憶する。</p>${flow([{html:`年代番号を求める：${mark(1)}`},{html:`年代別得票：${mark(2)}`},{html:`全年代得票：${mark(3)}`},{html:`並べ替え外側：${mark(4)}`,type:'loop'},{html:`候補探索：${mark(5)}`,type:'loop'}])}${optGroup(map)}`;
  const ans=['ア','ウ','エ','オ','カ'];const ex=['10代→0、20代→1…となる式。','該当年代の回答番号を1増やす。','全年代行も同時に1増やす。','末尾側から順位を確定させる。','未確定範囲の候補を探索する。'];
  return secFlow(5,'多次元配列＋順位表示',15,body,map,ans,ex,['多次元配列','多次元配列','多次元配列','アルゴリズム','アルゴリズム']);
 }
 const map={'ア':'Hi → Hoz','イ':'Hoz → Hi','ウ':'Nsu(1,Tco) + 1 → Nsu(1,Tco)','エ':'Nsu(0,Tco) + Ryokin → Nsu(0,Tco)','オ':'Ryokin = Hryo(Tco) × (1 + Kubun × 0.5)','カ':'Mr(0) < Mr(n)','キ':'Tcod(n + 1) → Tcod(0)','ク':'n は 1 から1ずつ増やして n ≤ 5 の間','ケ':'Nsu(1,0) + 1 → Nsu(1,0)','コ':'Mr(n) → Mr(0)'};
 const body=`<p><b>処理内容：</b>施設の入場データ（日付・休日区分・店舗コード・クーポン区分）を読み、日別および店舗別の入場者数・料金を集計する。日付の昇順。</p>${flow([{html:`最初の日付を保存：${mark(1)}`},{html:'データを読む'},{html:`入場料金を求める：${mark(2)}`},{html:`店舗人数を更新：${mark(3)}`},{html:`店舗料金を更新：${mark(4)}`},{html:'入力終了後、目標達成率で並べ替え'},{html:`比較条件：${mark(5)}`}])}${optGroup(map)}`;
 const ans=['ア','オ','ウ','エ','カ'];const ex=['日付のコントロールブレイク用。','休日区分に応じた料金式。','人数配列を1増やす。','料金配列へ加算する。','降順なら前の値が小さいと交換対象。'];
 return secFlow(5,'日別集計＋並べ替え',15,body,map,ans,ex,['コントロールブレイク','アルゴリズム','多次元配列','多次元配列','アルゴリズム']);
}

function makeS6(seed){
 const variant=seed%3;
 if(variant===0){
  const map={'ア':'Rec(Yobi,g) → Rec(0,g)','イ':'Rec(0,g) → Rec(Yobi,g)','ウ':'k は 1 から1ずつ増やして k ≤ j の間','エ':'Rec(k,p) < Rec(0,p)','オ':'Rec(k,p) > Rec(0,p)','カ':'Su + 1 → Su','キ':'Yobi + 1 → Yobi','ク':'Cod(g) → Rec(0,g)','ケ':'Rec(0,g) = 99.99','コ':'k は 1 から1ずつ増やして k ≤ j - 1 の間'};
  const body=`<p><b>処理内容：</b>陸上部の1週間の100m記録（生徒コード・曜日番号・記録）を読み、生徒ごとの週間最速記録を求め、その昇順に表示する。</p><p>Rec(1..6,1..30)が曜日別記録、Rec(0,*)が週間最速。記録なしは99.99。</p>${flow([{html:'生徒コードを探索する'},{html:'曜日別記録を格納'},{html:`週間最速の初期化：${mark(1)}`},{html:`曜日を進める：${mark(2)}`},{html:`最速更新条件：${mark(3)}`,type:'diamond'},{html:`並べ替え内側ループ：${mark(4)}`,type:'loop'},{html:`出力件数を更新：${mark(5)}`}])}${optGroup(map)}`;
  const ans=['ア','キ','エ','コ','カ'];const ex=['曜日データを週間最速へ初期値として入れる。','次曜日へ進む。','より小さい記録なら最速を更新する。','比較範囲は確定位置の直前まで。','表示した人数を1増やす。'];
  return secFlow(6,'探索＋最小値＋ソート',15,body,map,ans,ex,['探索','ループ','アルゴリズム','アルゴリズム','アルゴリズム']);
 }
 if(variant===1){
  const map={'ア':'Ukei(0,Dso) + Kingaku → Ukei(0,Dso)','イ':'Ukei(1,Dso) + Tp × 70 → Ukei(1,Dso)','ウ':'Skei(0,Syu) + Kingaku → Skei(0,Syu)','エ':'Skei(1,Syu) + Waribiki → Skei(1,Syu)','オ':'Dcd ÷ 100 → Syu','カ':'Dcd Mod 100 → Ren','キ':'Work(k) → Work(0)','ク':'Ukei(0,Work(k)) < Ukei(0,Work(k+1))','ケ':'Ukei(0,Work(k)) > Ukei(0,Work(k+1))','コ':'Skei(0,0) + Kingaku → Skei(0,0)'};
  const body=`<p><b>処理内容：</b>カフェの売上コード・ドリンクコード・トッピング数・割引区分を読み、ドリンク別・種類別売上を集計し、売上額の降順に並べ替える。</p>${flow([{html:`ドリンクコードから種類番号：${mark(1)}`},{html:'商品を探索'},{html:`ドリンク別売上を更新：${mark(2)}`},{html:`種類別売上を更新：${mark(3)}`},{html:'Workにドリンク番号を記憶'},{html:`降順比較：${mark(4)}`,type:'diamond'},{html:`種類合計を更新：${mark(5)}`}])}${optGroup(map)}`;
  const ans=['オ','ア','ウ','ク','コ']; const ex=['上位桁を種類番号として使う。','ドリンク別売上額へ加算。','種類別売上額へ加算。','降順では前の値が小さいと交換。','0列を合計として更新する。'];
  return secFlow(6,'コード分解＋クロス集計',15,body,map,ans,ex,['数値表現','多次元配列','多次元配列','アルゴリズム','多次元配列']);
 }
 const map={'ア':'Jsyu(1,i) + Tsu → Jsyu(1,i)','イ':'Jsyu(2,i) + Fsu → Jsyu(2,i)','ウ':'Jsyu(0,i) = Jsyu(1,i) + Jsyu(2,i)','エ':'j は h - 1 から1ずつ減らして j ≥ 1 の間','オ':'Jsyu(0,k) < Jsyu(0,k + 1)','カ':'Emei(k + 1) → Emei(0)','キ':'Emei(0) → Emei(k)','ク':'n は 1 から1ずつ増やして n ≤ h の間','ケ':'Jsyu(1,n) × 100 ÷ Jsyu(0,n) → Hiritsu','コ':'Jsyu(2,n) × 100 ÷ Jsyu(0,n) → Hiritsu'};
 const body=`<p><b>処理内容：</b>路線別の定期・普通乗客数を駅コードごとに集計し、乗客数合計の降順に駅名と比率を表示する。</p>${flow([{html:'駅コードを探索する'},{html:`定期を集計：${mark(1)}`},{html:`普通を集計：${mark(2)}`},{html:`合計を作る：${mark(3)}`},{html:`挿入位置探索：${mark(4)}`,type:'loop'},{html:`定期比率：${mark(5)}`}])}${optGroup(map)}`;
 const ans=['ア','イ','ウ','エ','ケ'];const ex=['定期列へ加算。','普通列へ加算。','0行を合計として作る。','挿入ソートで左へ探索する。','定期÷合計×100。'];
 return secFlow(6,'集計＋挿入ソート',15,body,map,ans,ex,['多次元配列','多次元配列','多次元配列','アルゴリズム','計算']);
}

function makeS7(seed){
 const variant=seed%3;
 if(variant===0){
  const map={'ア':'Tcd ÷ 10000 → Syo','イ':'Tcd Mod 100 → Syo','ウ':'Kkai(Jban,Syo) + 1 → Kkai(Jban,Syo)','エ':'Kkai(0,Syo) + 1 → Kkai(0,Syo)','オ':'Nkai(Tyu) = Tcd','カ':'Tyu + 1 → Ka','キ':'Tyu - 1 → Jo','ク':'Nkai(Wk(h)) > Nkai(Wk(h+1))','ケ':'Nkai(Wk(h)) < Nkai(Wk(h+1))','コ':'Sbi(Wk(h)) < Sbi(Wk(h+1))','サ':'Sbi(Wk(h)) > Sbi(Wk(h+1))','シ':'Wari','ス':'Jmei(Bun2)','セ':'Genre(Bun2)','ソ':'Kkai(Bun2,k) × 100 ÷ Kkai(Bun2,0) → Wari'};
  const body=`<p><b>処理内容：</b>移動図書館の貸出データ（貸出日・巡回場所番号・図書コード）を読み、図書ごと・巡回場所×ジャンルの貸出回数を集計する。入力終了後、図書を貸出回数の降順、同数なら出版日の降順、さらに同じなら図書コードの昇順で表示し、巡回場所別・ジャンル別分析を行う。</p><p>図書コードは「ジャンル番号＋ジャンル内番号」で構成される。Tcod()は図書コード昇順のマスタ、Nkai()は貸出回数、Kkai(場所,ジャンル)はクロス集計。</p>${flow([{html:'図書コードを二分探索'},{html:`探索一致条件：${mark(1)}`,type:'diamond'},{html:`ジャンル番号を求める：${mark(2)}`},{html:`クロス集計：${mark(3)}`},{html:'Workを貸出回数で並べ替える'},{html:`同数時の第2キー比較：${mark(4)}`,type:'diamond'},{html:`割合計算：${mark(5)}`}])}${optGroup(map)}`;
  const ans=[['オ'],['ア'],['ウ','エ'],['コ','サ'],['ソ']]; const ex=['中央の図書コードと検索コードの一致を見る。','上位桁をジャンル番号として取り出す。','場所×ジャンルとジャンル合計を両方更新する。','同貸出回数なら出版日の降順なので、古い側を後ろへ送る比較を使う。','選択した場所のジャンル回数÷場所合計×100。'];
  return secFlow(7,'総合：二分探索＋クロス集計＋複合キーソート',25,body,map,ans,ex,['探索','数値表現','多次元配列','アルゴリズム','計算'],true);
 }
 if(variant===1){
  const map={'ア':'Gban ÷ 1000 → Gaku','イ':'(Gban - Gaku × 1000) ÷ 100 → Kumi','ウ':'Gkei(g,Gaku) + 1 → Gkei(g,Gaku)','エ':'Gkei(g,4) + 1 → Gkei(g,4)','オ':'Kkei(k,n) < i','カ':'Kkei(k,n) > i','キ':'n → Tmp','ク':'Kkei(k,Tmp) × 100 ÷ Kkei(k,4) → Wari','ケ':'Kmei(Tmp)','コ':'Max → i','サ':'Kkei(k,n) → Max','シ':'Kkei(k,n) > Max','ス':'Kkei(k,n) < Max','セ':'Gaku × 6 + Kumi','ソ':'(Gaku - 1) × 6 + Kumi'};
  const body=`<p><b>処理内容：</b>学生食堂の販売データ（販売日・学籍番号）を読み、学年×組×学期で販売数を集計する。学籍番号は学年・組・出席番号から構成。入力終了後、各学期と年間の上位5組を販売数の降順に表示する。</p>${flow([{html:`学年抽出：${mark(1)}`},{html:`組を1〜18の連番に変換：${mark(2)}`},{html:`学年別販売数を更新：${mark(3)}`},{html:'上位5組の最大値探索'},{html:`最大値更新条件：${mark(4)}`,type:'diamond'},{html:`割合を求める：${mark(5)}`}])}${optGroup(map)}`;
  const ans=[['ア'],['ソ'],['ウ','エ'],['シ','サ'],['ク']];const ex=['千の位を学年として取り出す。','(学年-1)×6+組で1〜18の連番にする。','学年列と合計列を同時更新。','現在の最大値より大きければ最大値と位置を更新。','組の販売数÷学年合計×100。'];
  return secFlow(7,'総合：コード分解＋集計＋上位抽出',25,body,map,ans,ex,['数値表現','多次元配列','多次元配列','アルゴリズム','計算'],true);
 }
 const map={'ア':'Pid(Tyu) = Seni2','イ':'Pid(Tyu) > Seni2','ウ':'Tyu + 1 → Ka','エ':'Tyu - 1 → Jo','オ':'Skei(0,Tyu) + 1 → Skei(0,Tyu)','カ':'Skei(1,Tyu) + Pts → Skei(1,Tyu)','キ':'Skei(2,Tyu) + Rebo → Skei(2,Tyu)','ク':'Skei(3,Tyu) + Ass → Skei(3,Tyu)','ケ':'Work1(k) → Work1(0)','コ':'Skei(Bun1,Work1(k)) < Skei(Bun1,Work1(k+1))','サ':'Skei(Bun1,Work1(k)) > Skei(Bun1,Work1(k+1))','シ':'Skei(Bun1,m) ÷ Skei(0,m) → Work2(m)','ス':'Skei(Bun1,m) × Skei(0,m) → Work2(m)','セ':'Work2(k) < Work2(k+1)','ソ':'Work2(k) > Work2(k+1)'};
 const body=`<p><b>処理内容：</b>バスケットボール選手の出場データ（選手ID・ポイント・リバウンド・アシスト）を読み、選手別に集計する。選手IDマスタは昇順。入力後、分析区分（ポイント等）と分析方法（合計・1試合平均）を選び上位10名を表示する。</p>${flow([{html:`二分探索の一致条件：${mark(1)}`,type:'diamond'},{html:`出場数を更新：${mark(2)}`},{html:`ポイントを更新：${mark(3)}`},{html:'合計分析：Work1を降順ソート'},{html:`合計の比較条件：${mark(4)}`,type:'diamond'},{html:`1試合平均を求める：${mark(5)}`}])}${optGroup(map)}`;
 const ans=[['ア'],['オ'],['カ','キ','ク'],['コ'],['シ']];const ex=['中央IDが入力IDと一致したら探索成功。','出場数行を1増やす。','各統計値をそれぞれ対応行へ加算する。','降順なので前が小さいと交換。','分析値÷出場数で1試合平均。'];
 return secFlow(7,'総合：二分探索＋選手集計＋分析切替',25,body,map,ans,ex,['探索','多次元配列','多次元配列','アルゴリズム','計算'],true);
}
