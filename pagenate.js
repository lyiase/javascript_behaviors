// 最大項目を入力して、現在のページや次のページを表示するか制御するクラス
var PaginateBehavior = function(){
	
	// ページ最初の項目番号
	this.start = 0;
	
	// 取得総件数
	this.count = 0;
	
	// 1ページの行数
	this.rows = 10;
	
	// ページ周辺の表示ページ
	this.viewPage = 2
	
	// ページを選択し開始項目番号を特定する
	this.setCurrentPage = function(page){
		var st = page * this.rows;
		var mx = this.getMax();
		this.start = st < count ? st : mx.start;
	};
	
	// 現在ページを取得
	this.getCurrentPage = function(){
		return this.getIndexInfo(this.start);
	};
	
	// ページ番号からページ情報を取得
	this.getPageInfo = function(page){
		// マイナスページになったらnull返却
		if(page <= 0){
			return null;
		}
		
		var pg = page;
		var st = (pg -1) * this.rows;
		if(st < this.count ){
			return { page: pg, start: st };
		}
		else{
			return null;
		}
	};
	
	// 項目番号からページ情報を取得
	this.getIndexInfo = function(idx){
		var pg = Math.floor(idx / this.rows);
		var st = pg * this.rows;
		if(this.count == 0 && st == 0){
			return { page: 1, start: 0 };
		}
		if(st < this.count){
			return { page: pg + 1, start: st };
		}
		else{
			return null;
		}
	};
	
	// 最大ページを取得
	this.getMaxPage = function(){
		return this.getIndexInfo(this.count);
	};
	
	// 開始ページを取得
	this.getMinPage = function(){
		return { page: 1, start: 0 };
	};
	
	// 取得ページリスト取得(開始ページと終了ページ)
	this.getPageList = function(){
		var cur = this.getCurrentPage();
		var max = this.getMaxPage();
		var min = this.getMinPage();
		
		// 現在ページ取得最初のページが選択されたと解釈する
		if(cur == null){
			cur = min;
		}
		
		//////// 表示ページ数計算 ////////
		var beforePageCount = this.viewPage;
		var afterPageCount = this.viewPage;
		
		// 下方ページ取得数を確定
		if(cur.page - min.page < this.viewPage){
			beforePageCount = cur.page - min.page;
			afterPageCount += this.viewPage - beforePageCount;
		}
		
		// 上方ページ取得数を確定
		if(max.page - cur.page < this.viewPage){
			afterPageCount = max.page - cur.page;
			beforePageCount += this.viewPage - afterPageCount;
		}
		
		// 下方を算出
		var list = [cur.page];
		for(var i=1; cur.page - i >= min.page && i <= beforePageCount; i++ ){
			list.push(cur.page - i);
		}
		
		// 上方を算出
		for(var i=1; cur.page + i <= max.page && i <= afterPageCount; i++ ){
			list.push(cur.page + i);
		}
		
		// ソート
		list.sort(function(a,b){
			if( a < b ) return -1;
			if( a > b ) return 1;
			return 0;
		});
		
		// オブジェクトに変換
		for(var i=0; i < list.length; i++){
			list[i] = this.getPageInfo(list[i]);
		}
		
		// nullを除外
		var tmp = [];
		for(var i=0; i < list.length; i++)
			if(list[i] != null){
				tmp.push(list[i]);
			}
		}
		
		return tmp;
	};
	
	// NEXT方向に「…」をつけるか
	this.isNextRange = function(){
		var cur = this.getCurrentPage();
		var max = this.getMaxPage();
		var min = this.getMinPage();
		
		// 現在ページ取得最初のページが選択されたと解釈する
		if(cur == null){
			cur = min;
		}
		
		return (cur.page + this.viewPage + 1 < max.page);
	};
	
	// PREV方向に「…」をつけるか
	this.isPrevRange = function(){
		var cur = this.getCurrentPage();
		var min = this.getMinPage();
		
		// 現在ページ取得最初のページが選択されたと解釈する
		if(cur == null){
			cur = min;
		}
		
		return (cur.page - this.viewPage - 1 > min.page);
	};
	
	// JSONでデータを取得
	this.getJSONParam = function(){
		
		var cur = this.getCurrentPage();
		var min = this.getMinPage();
		var max = this.getMaxPage();
		
		// 現在ページ取得最初のページが選択されたと解釈する
		if(cur == null){
			cur = min;
		}
		
		return {
			current: cur,
			min: min,
			max: max,
			view: this.getPageList(),
			next: this.getPageInfo(cur.page + 1),
			prev: this.getPageInfo(cur.page - 1),
			isNextRange: this.isNextRange(),
			isPrevRange: this.isPrevRange(),
			isNext: (cur.page != max.page),
			isPrev: (cur.page != min.page),
		};
	};
};
