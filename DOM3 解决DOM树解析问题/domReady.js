// JavaScript Document

/*
myReady(function(){
	alert("aa");
})//这会在html部分使用，而下面的fn就是 function(){alert("aa");} 这一段代码
*/
function myReady(fn){
	//1,对于现代浏览器（高版本浏览器），我们就用addEventListener（添加事件监听 DOMContentLoaded）
	if(document.addEventListener){//支持addEventListener的浏览器
		document.addEventListener("DOMContentLoaded",fn,false);
	}else{//低版本的浏览器ie
		//自己模拟一个判断事件加载完毕的函数
		IEContentLoaded(fn);
	}
}

//这是我们模拟的可以检测ie低版本浏览器的部分
function IEContentLoaded(fn){
	var isdone=false;//声明一个用来检测ainit是否已经运行的变量
	
	//保证fn只运行一次
	function ainit(){//此时不调用它则只是一段 并没有激活的 代码
		if(!isdone){//如果ainit运行，那么就会进入if（因为我们之前已经定义了isdone是false的）
			isdone=true;//在这里把isdone改为true，那么之后有另一个函数再调用ainit的时候，就进不来if部分
			fn();//此时就可以保证fn只执行一次	
		}
	}
	
	
	
	/*var ainit=function(){
		if(!isdone){
			isdone=true;
			fn();
		}
	}*/   //这个部分ie6会直接运行而不会经过底下的浏览器版本判断部分，应该是因为它用var声明了，而且放在 检测函数 的上面，ie6就把它当成一个变量直接运行了
	
	//函数的自调用
	(function(){
		try{
			//如果DOM没有加载完毕，调用doScroll就会报错，然后给catch捕获异常
			document.documentElement.doScroll("left");
			//doScroll：控制滚动条   向左滚动    这个地方只是用来验证DOM是否加载完毕，所以不需要纠结它怎么滚动，反正DOM没加载完，它就会报错
		}catch(e){
			//e是exception :异常    如果有异常，那么catch会执行
			//出错，意味着dom树没有加载完毕
			//延迟再试一次		调用延迟，直接跳过
			setTimeout(arguments.callee,10);
			//延迟10毫秒之后调用的是arguments.callee,而callee会回调上面的doScroll，然后再来一次try
			//如果DOM树在这10毫秒延迟内刚好加载完毕了，会往下运行return跳出异常捕获，这几率非常小，但是还是有的，所以需要建立一个双重保险
			return;//以防ie6不能跳出异常捕获代码
		}
		//跳出异常捕获阶段，代表doScroll没有报错了，DOM树加载完毕了
		ainit();//执行最后输出部分
	})();
	
	//建立双重保险
	//监听document的加载状态
	document.onreadystatechange=function(){
		if(document.readyState=="complete"){
			//说明DOM加载完毕
			ainit();//这是一个专门用来做 输出口 的函数
		}
	}
}