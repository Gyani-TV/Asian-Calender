/**
 * Description: This module implements the calculation of 
 * the data model of the perpetual calendar (Model)。
 * 
 * The algorithm mainly implements the following functions:
 * 
 * 1. Calculate the Gregorian calendar information of a certain month.
 * 2. Calculate the lunar calendar, zodiac signs, international festivals, 
 * domestic festivals, solar terms, holiday arrangements, and ephemeris information 
 * (daily taboos) and other information corresponding to each day of a month.
 * 
 * Author Aditya A Sen @ Radii Labs
 * date: 20200407
 */


// Self-executing anonymous functions
+function(){
	
	
	/**
	 * Perpetual calendar supports query year range
	 */
	var minYear = 1899;//Minimum age
	var maxYear = 2100;//Maximum age
	
	/**
	 * 1899 - 2100 Lunar data for the year
	 * 
	 * Data format: 0x04bd8 is 5 hexadecimal numbers, 
	 * 20bit numbers, representing the Gregorian calendar 
	 * date is January 31, 1900, and the lunar calendar date is January 01, 1900
	 * 
	 * Note: The big month in the lunar calendar is 30 days, and the small month is 29 days
	 * 
	 * The first 4 digits (ie 0): indicates the large and small month of the current year. 
	 * If it is 1, it will run the big moon, and if it is 0, it will run the small moon.
	 * 
	 * The middle 12 digits (ie 4bd): each represents one month, 1 is the big month, and 0 
	 * is the small month. 12 digits for 1 to 12 months
	 * 
	 * The last 4 digits (ie 8): represents the month of the month of the year, 0 means no. 
	 * The first 4 digits should be used with the last 4 digits
	*/
	var lunarInfo=[ 0x0ab50,//1899
					0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
					0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
					0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
					0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
					0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
					0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
					0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
					0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
					0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
					0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,//1990-1999
					0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
					0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,//2010-2019
					0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,//2020-2029
					0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,//2030-2039
					0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,//2040-2049
					0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,//2050-2059
					0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,//2060-2069
					0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,//2070-2079
					0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,//2080-2089
					0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,//2090-2099
					0x0d520];//2100
	
	// Twenty-four solar terms data, solar term time (unit is minutes) from 0 Xiaohan
	var termInfo=[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
	// Twenty four solar terms -- in Korean East Asian Astrological heritage UNESCO
	var solarTerm =['sohan','daehan','ipchun','usu','gyeongchip','chunbun','cheongmyeong','gogu','ipha','soman','mangjong','haji','soseo','daeseo','ipchu','cheoseo','baekro','chubun','hanlo','sanggang','ipdong','soseol','daeseol','dongji'];
	
	// Lunar month
	var monthCN=['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
	// Lunar day
	var dayCN=['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十','卅一'];
	
	// Heavenly
	var heavenlyStems=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
	// Earthly Branch
	var earthlyBranches=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
	// Earthly Branch Zodiac
	var chinaZodiac=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
	
	// week
	var weekend=['Mon','Tue','Wed','Thurs','Fri','Sat','Sun'];
	
	// Domestic traditional festival
	var domesticFestival={
		'd0101':'春节 ',
        'd0115':'元宵节',
        'd0202':'龙头节',
        'd0505':'端午节',
        'd0707':'七夕节',
        'd0715':'中元节',
        'd0815':'中秋节',
        'd0909':'重阳节',
        'd1001':'寒衣节',
        'd1015':'下元节',
        'd1208':'腊八节',
        'd1223':'小年'
	}
	
	// 国际节日
	var interFestival={
		'i0202':'湿地日,1996',
		'i0308':'妇女节,1975',
		'i0315':'消费者权益日,1983',
		'i0401':'愚人节,1564',
		'i0422':'地球日,1990',
		'i0501':'劳动节,1889',
		'i0512':'护士节,1912',
		'i0518':'博物馆日,1977',
		'i0605':'环境日,1972',
		'i0623':'奥林匹克日,1948',
		'i1020':'骨质疏松日,1998',
		'i1117':'学生日,1942',
		'i1201':'艾滋病日,1988',
		'i0101':'元旦',
		'i0312':'植树节,1979',
		'i0504':'五四青年节,1939',
		'i0601':'儿童节,1950',
		'i0701':'建党节,1941',
		'i0801':'建军节,1933',
		'i0903':'抗战胜利日,1945',
		'i0910':'教师节,1985',
		'i1001':'国庆节,1949',
		'i1224':'平安夜',
		'i1225':'圣诞节',
		'i0214':'情人节',
		'i0520':'母亲节,1913',
		'i0630':'父亲节',
		'i1144':'感恩节'
       }
     
	/**********************************************
	 * Variable declaration optimization (to be optimized)
	 * 1、Declare multiple variables through one var
	 * 2、Store data via string, Do not use arrays to store data
	 **********************************************/
	
	
		
	/**
	 * Return to the date view of the specified year and month
	 * 
	 * eg: var cal=getCalendar(2016,4);
	 * 
	 * 	28 29 30 31  1  2  3
	 * 	 4  5  6  7  8  9 10
	 * 	11 12 13 14 15 16 17
	 * 	18 19 20 21 22 23 24
	 * 	25 26 27 28 29 30 01
	 *  
	 *  Note: The example only shows the date of the Gregorian calendar,
	 *  the true return content should include
	 * 	Lunar calendar, sexagenary cycle, international 
	 * festivals, domestic festivals, solar terms, holiday arrangements, 
	 * yellow calendar information (daily taboos)
	 * 
	 * @param {Number} y
	 * @param {Number} m
	 */
	function getCalendar(y,m){
		 var view=[];
		 
		 y=parseInt(y,10);
		 m=parseInt(m,10);
		 
		 var pYear=m==1?y-1:y;
		 var pMonth=m==1?12:m-1;
		 var nYear=m==12?y+1:y;
		 var nMonth=m==12?1:m+1;
		 
		 // Day of the first day of the month
		 var w=getWeek(y,m,1);
		 
		 // Get the number of days in the month
		 var cDays=getMonthDays(y,m);
		 // Get the number of days in the previous month
		 var pDays=getMonthDays(pYear,pMonth);
		 
		 var pFill=w-1;				  // The number of days to be added forward
		 var nFill=7-((pFill+cDays)%7==0?7:(pFill+cDays)%7); // The number of days that need to be added back
		 
		 
		 // Fill in the Gregorian calendar date of the current month
		 for(var i=pDays-pFill+1;i<=pDays;i++){
		 	var week=getWeek(pYear,pMonth,i);
		 	view.push({solarCalendar:{year:pYear,month:pMonth,day:i,week:weekend[week-1],othermonth:true}});
		 }
		 for(var i=1;i<=cDays;i++){
		 	var week=getWeek(y,m,i);
		 	view.push({solarCalendar:{year:y,month:m,day:i,week:weekend[week-1],othermonth:false}});
		 }
		 for(var i=1;i<=nFill;i++){
		 	var week=getWeek(nYear,nMonth,i);
		 	view.push({solarCalendar:{year:nYear,month:nMonth,day:i,week:weekend[week-1],othermonth:true}});
		 }
		 
		 // Traverse every day of the month
		 for(var i=0;i<view.length;i++){
		 	var elem=view[i];
		 	
		 	// Get the Gregorian calendar date of a certain day
		 	var year=elem.solarCalendar.year;
		 	var month=elem.solarCalendar.month;
		 	var day=elem.solarCalendar.day;
		 	
		 	// Get the lunar date of a certain day
		 	elem.lunarCalendar=getLunarCalendar(year,month,day);
		 	// Get a certain day's zodiac
		 	elem.chinaEra=getChinaEra(year,month,day);
		 	// Get an international holiday on a certain day
		 	elem.interFestival=getInterFestival(year,month,day);
		 	// Get a domestic holiday on a certain day
		 	elem.domesticFestival=getDomesticFestival(elem.lunarCalendar.lunarYear,elem.lunarCalendar.lunarMonth,elem.lunarCalendar.lunarDay);
		 	// Get holiday arrangements for a certain day
		 	elem.legalHoliday=getLegalHoliday(year,month,day);
		 	// Get almanac information
		 	elem.almanac=getAlmanac(elem.lunarCalendar.lunarYear,elem.lunarCalendar.lunarMonth,elem.lunarCalendar.lunarDay);
		 	
		 }

		 return view;
		
	}
	
	/**
	 * 
	 * 根据日期获取某天的农历日期
	 * 
	 * 
	 * 说明：通过当前日期和1899年1月10日的日期所差的天数,分别计算出当前日期对应的农历的年月日
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getLunarCalendar(y,m,d){
		var res={};
		
		var baseDate=new Date(1899,1,10);
		var curDate=new Date(y,m-1,d);
		var offset=(curDate-baseDate)/86400000; // 计算出当前日期到1899年1月10日所差的天数,(农历1899年1月1日)
		
		// 用offset依次减去每一年的天数,直至不够减,此时i就表示当前农历年份
		for(var i=minYear;i<=maxYear;i++){
			var days=yearDays(i);
			if(offset-days<1){
				break;
			}else{
				offset-=days;
			}
		}
		// 查找对应的农历年
		res.year=i;
		res.lunarYear=i;
		// 此时offset为,当前日期到今年农历月份的天数,进而通过这个差值计算出对应的农历月份
		
		// 当年闰月的月份
		var leap=leapMonth(res.year);
		var isLeap=false;
        //设定当年是否有闰月
        if(leap>0){
            isLeap=true;
        }
        isLeapMonth=false;
        for(var i=1;i<=12;i++){
            var days=null;
            
            //如果有闰月则减去闰月对应的天数
            if (isLeap&&(i==leap+1)&&(isLeapMonth==false)){
                isLeapMonth=true;
                i--;
                days=leapDays(res.year); 
                
            // 如果没有闰月则减去正常月天数
            }else{
                isLeapMonth=false;
                days=monthDays(res.year,i);
            }
			// 如果offset-days小于0了说明,offset找到对应月份            
            if(offset-days<0) break;
            offset=offset-days;
        }
		i=i==13?1:i;
        res.month=(leap==i&&isLeapMonth?'润':'')+monthCN[i-1];
        res.day=dayCN[offset+1-1]; // 偏移量加1,得到对应的农历日期数. offset为当月1月1日的偏移量
		
		res.lunarMonth=i;
		res.lunarDay=offset+1;
		
		return res;
	}
	/**
	 * 
	 * 根据农历日期获取某天的阳历日期
	 * 
	 * 
	 * 说明：如果当年存在闰月的情况,会返回2个阳历日期
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getSolarCalendar(y,m,d){
	
		// 获取阳历y年01月01日对应的农历时间
		var lunarCalendar=getLunarCalendar(y,1,1);
		// 对应的农历日期
		var lunarYear=lunarCalendar.lunarYear;
		var lunarMonth=lunarCalendar.lunarMonth;
		var lunarDay=lunarCalendar.lunarDay;
		
		
		// 计算这个农历日期到y-m-d的天数
		
		var leaveDays=yearDays(lunarYear)-offsetDays(lunarYear,lunarMonth,lunarDay);
		var offset=offsetDays(y,m,d);
		
		for(var i in offset){
			offset[i]+=leaveDays;
		}
		
		
		// 用这个天数+对应的阳历日期(y-01-01)计算出当前的阳历日期
		var res=[];
		for(var i in offset){
		  	var dateDay=new Date(new Date(y,0,1).getTime()+offset[i]*86400000);
		  	
		  	var y=dateDay.getFullYear();
			var m=dateDay.getMonth()+1;
			var d=dateDay.getDate();
			
			res.push({
			  	year:y,
			  	month:m,
			  	day:d
			 });
		}
		
		/**
		 * 计算农历y年1月1日到农历y年m月d日的所差的天数
		 * @param {Number} y
		 * @param {Number} m
		 * @param {Number} d
		 */
		function offsetDays(y,m,d){
			
			// 当年闰月的月份
			var leap=leapMonth(y);
			 //设定当年是否有闰月
			var isLeap=false;
	        if(leap>0){
	            isLeap=true;
	        }
	        isLeapMonth=false;
	        var offset=0;
			for(var i=1;i<m;i++){
				
				//如果有闰月则减去闰月对应的天数
	            if (isLeap&&(i==leap+1)&&(isLeapMonth==false)){
	                isLeapMonth=true;
	                i--;
	                days=leapDays(y); 
	                
	            // 如果没有闰月则减去正常月天数
	            }else{
	                isLeapMonth=false;
	                days=monthDays(y,i);
	            }
				
				offset+=days;
			}
			offset+=d;
			
			var res=[];
			res.push(offset);
			// 如果当前月就是闰月,就会存在2个offset
			if(m==leap){
				res.push(offset+leapDays(y));
			}
			
			return res;
		}
		return res;
	}
	
	/*****************************************
	 * 解析农历数据0x04bd8的相关函数
	 *****************************************/
	
	/**
	 * 返回y年农历的中闰月,如果y年没有闰月返回0
	 * @param {Number} y 年
	 */
	function leapMonth(y) {
		return (lunarInfo[y-1899]&0x0000f);
	}
	
	/**
	 * 返回y年农历的中闰月的天数
	 * @param {Number} y 年
	 */
	function leapDays(y) {
		if (leapMonth(y)) {
			return ((lunarInfo[y-1899]&0x10000)?30:29);
		} else {
			return 0;
		}
	}
	
	/**
	 * 返回y年农历的指定月份的天数
	 * @param {Number} y 年
	 */
	function monthDays(y,m) {
		return ((lunarInfo[y-1899]&(0x10000>>m))?30:29);
	}
	/**
	 * 返回y年农历的总天数
	 * @param {Number} y 年
	 */
	function yearDays(y) {
		var i,sum = 0;
		for (i=0x08000;i>0x00008;i>>=1) {
			sum+=(lunarInfo[y-1899]&i)?30:29;
		}
		return (sum+leapDays(y)); // y年的天数再加上当年闰月的天数
	}
	
	
	/**
	 * 
	 * 根据日期获取某天的天干地支
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getChinaEra(y,m,d){
		var res={};
		
		var firstTerm=getTerm(y,(m-1)*2); //某月第一个节气开始日期
		var gzYear=(m>2||m==2&&d>=getTerm(y,2))?y+1:y;//干支所在年份
		var gzMonth=d>=firstTerm?m:m-1; //干支所在月份（以节气为界）
		
		
		res.year=getEraYear(gzYear);
		res.month=getEraMonth(y,gzMonth);
		res.day=getEraDay(y,m,d);
		
		res.zodiac=getYearZodiac(gzYear);
		res.term=getYearTerm(y,m,d);	
		
		
		
		
		/*****************************************
		 * 计算天干地支节气相关函数
		 *****************************************/
		/**
		 * num 60进制中的位置(把60个天干地支编码成60进制的数)
		 * @param {Number} num
		 */
		function calculate (num) {
            return heavenlyStems[num%10]+earthlyBranches[num%12]
        }
		/**
		 * 获取干支纪年
		 * @param {Number} y 年
		 */
        function getEraYear(y) {
            return calculate(y-1900+35);// 1900年前一年为乙亥年,60进制编码为35
        }
        /**
		 * 获取干支纪月
		 * @param {Number} y 年
		 * @param {Number} m 月
		 */
        function getEraMonth(y,m) {
            return calculate((y-1900)*12+m+12); // 1900年1月小寒以前为丙子月，在60进制中排12
        }
        /**
		 * 获取干支纪日
		 * @param {Number} y 年
		 * @param {Number} m 月
		 * @param {Number} d 日
		 */
        function getEraDay(y,m,d) {
            return calculate(Math.ceil((new Date(y,m-1,d)-new Date(1900,0,1))/86400000+10));// 甲戌
        }
        /**
		 * 获取生肖
		 * @param {Number} y 干支所在年(默认以立春前的公历年作为基数)
		 */
		function getYearZodiac(y){
			 var num=y-1900+35; //参考干支纪年的计算，生肖对应地支
			 return chinaZodiac[num%12];
		}
		/**
		 * 某年的第n个节气为几日
		 * 地球公转时间:31556925974.7 毫秒
		 * 由于农历24节气交节时刻采用近似算法,可能存在少量误差(30分钟内)
		 * 1900年的正小寒点：01-06 02:03:57,1900年为基准点
		 * 
		 * @param {Number} y 公历年
		 * @param {Number} n 第几个节气，从0小寒起算
		 * 
		 */
		function getTerm(y,n) {
			var offDate = new Date((31556925974.7*(y-1900)+termInfo[n]*60000)+Date.UTC(1900,0,6,2,3,57));
			return(offDate.getUTCDate());
		}
		/**
		 * 获取公历年一年的二十四节气
		 * 返回节气中文名
		 */
		function getYearTerm(y,m,d){
			var res=null;
			var month=0;
			for(var i=0;i<24;i++){
				var day=getTerm(y,i);
				if(i%2==0) month++
				if(month==m&&day==d){
					res=solarTerm[i];
				}
			}
			return res;
		}
		return res;
	}
	
	/**
	 * 
	 * 根据日期获取某天的国际节日
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getInterFestival(y,m,d){
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		
		var fes=interFestival['i'+m+d];
		if(fes){
			if(fes.split(',').length>1){
				var by=fes.split(',')[1];
				return y>=by?fes.split(',')[0]:null;
			}else{
				return fes;
			}
		}else{
			return null;
		}
		
	}
	/**
	 * 
	 * 根据日期获取某天的国内节日
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getDomesticFestival(y,m,d){
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		return domesticFestival['d'+m+d]?domesticFestival['d'+m+d]:null;
	}
	/**
	 * 
	 * 根据日期获取某天的放假安排
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getLegalHoliday(y,m,d){
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		
		var Calendar=window.Calendar;
		if(Calendar.Holiday&&Calendar.Holiday['y'+y]){ //该年已有黄历数据
			return Calendar.Holiday['y'+y]['d'+m+d]?Calendar.Holiday['y'+y]['d'+m+d]:null;
		}
		
	}
	/**
	 * 
	 * 根据日期获取某天的黄历信息
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getAlmanac(y,m,d){
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		
		var Calendar=window.Calendar;
		if(Calendar.HuangLi&&Calendar.HuangLi['y'+y]){ //该年已有黄历数据
			return Calendar.HuangLi['y'+y]['d'+m+d]?Calendar.HuangLi['y'+y]['d'+m+d]:null;
		}
	}
	/**
	 * 获取某月的天数
	 * @param {Number} y 年
	 * @param {Number} m 月
	 */
	function getMonthDays(y,m){
		 var monthDays=[31,isLeap(y)?29:28,31,30,31,30,31,31,30,31,30,31];
		 return monthDays[m-1];
	};
	/**
	 * 根据日期获取某天的星期数
	 * 
	 * eg: var w=getWeek(2016,4,7); // w=1; 返回值范围 1-7
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function getWeek(y,m,d){
		return new Date(y,m-1,d).getDay()==0?7:new Date(y,m-1,d).getDay();// 注意:JavaScript月份范围是0-11
	} 
	/**
	 * 判断一个年份是闰年还是平年
	 * 
	 * eg: var r=isLeapYear(2016); // r=true; 
	 * 
	 * @param {Number} y 年
	 */
	function isLeap(y){
		return ((y%4==0&&y%100 !=0)||(y%400==0));
	}
	/**
	 * 用于测试和调试使用,打印日历
	 * @param {Number} y
	 * @param {Number} m
	 */
	function debugCalendar(y,m){
		
		var view=getCalendar(y,m);
		var i=0;
		console.log('\t%c公历 ','color:red');
		console.log('\t%s\t%s\t%s\t%s\t%s\t%s\t%s','星期一','星期二','星期三','星期四','星期五','星期六','星期日');
		while(i<view.length){
			if(i%7==0){
				console.log('\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s',view[i++].solarCalendar.day,view[i++].solarCalendar.day,view[i++].solarCalendar.day,view[i++].solarCalendar.day,view[i++].solarCalendar.day,view[i++].solarCalendar.day,view[i++].solarCalendar.day);
			}
		}
		var i=0;
		console.log('\t%c农历','color:red');
		console.log('\t%s\t%s\t%s\t%s\t%s\t%s\t%s','星期一','星期二','星期三','星期四','星期五','星期六','星期日');
		while(i<view.length){
			if(i%7==0){
				console.log('\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s',view[i++].lunarCalendar.day,view[i++].lunarCalendar.day,view[i++].lunarCalendar.day,view[i++].lunarCalendar.day,view[i++].lunarCalendar.day,view[i++].lunarCalendar.day,view[i++].lunarCalendar.day);
			}
		}
		var i=0;
		console.log('\t%c天干地支','color:red');
		console.log('\t%s\t%s\t%s\t%s\t%s\t%s\t%s','星期一','星期二','星期三','星期四','星期五','星期六','星期日');
		while(i<view.length){
			if(i%7==0){
				console.log('\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s',view[i++].chinaEra.day,view[i++].chinaEra.day,view[i++].chinaEra.day,view[i++].chinaEra.day,view[i++].chinaEra.day,view[i++].chinaEra.day,view[i++].chinaEra.day);
			}
		}
	}
	// 加载依赖库文件
	function loadCalendarLib(y,callback){
		
		var today=new Date();
		var ty=today.getFullYear();
		
		var y=parseInt(y,10);
		var libs=[];
		
		for(var i=y-1;i<=y+1;i++){
			if(!Calendar.Holiday||!Calendar.Holiday['y'+i]){
				if(i<=ty){
					libs.push('lib/wt'+i+'.js');
				}
			}
			if(!Calendar.HuangLi||!Calendar.HuangLi['y'+i]){
				libs.push('lib/hl'+i+'.js');
			}
		}
		DOM.getScript(libs,callback);
	}
	
	// 定义全局命名空间Calendar
	window.Calendar=window.Calendar||{};
	
	Calendar.getCalendar=getCalendar;			// 根据传入的年月,返回对应的月份的视图
	Calendar.getSolarCalendar=getSolarCalendar; // 根据农历日期获取到公历日期
	Calendar.getLunarCalendar=getLunarCalendar; // 根据农历日期获取到公历日期
	Calendar.debugCalendar=debugCalendar;       // 根据公历历日期获取到农历日期
	Calendar.loadCalendarLib=loadCalendarLib;   // 加载lib文件(黄历和放假安排)
	
	
	
	// 支持AMD和CommonJS规范...
	
	
}();
