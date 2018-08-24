!function(I18n){"use strict";var slice=Array.prototype.slice,padding=function(number){return("0"+number.toString()).substr(-2)},DATE={day_names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbr_day_names:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],month_names:[null,"January","February","March","April","May","June","July","August","September","October","November","December"],abbr_month_names:[null,"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridian:["AM","PM"]},NUMBER_FORMAT={precision:3,separator:".",delimiter:",",strip_insignificant_zeros:!1},CURRENCY_FORMAT={unit:"$",precision:2,format:"%u%n",delimiter:",",separator:"."},PERCENTAGE_FORMAT={precision:3,separator:".",delimiter:""},SIZE_UNITS=[null,"kb","mb","gb","tb"],DEFAULT_OPTIONS={defaultLocale:"en",locale:"en",defaultSeparator:".",placeholder:/(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,fallbacks:!1,translations:{}};I18n.reset=function(){this.defaultLocale=DEFAULT_OPTIONS.defaultLocale,this.locale=DEFAULT_OPTIONS.locale,this.defaultSeparator=DEFAULT_OPTIONS.defaultSeparator,this.placeholder=DEFAULT_OPTIONS.placeholder,this.fallbacks=DEFAULT_OPTIONS.fallbacks,this.translations=DEFAULT_OPTIONS.translations},I18n.initializeOptions=function(){"undefined"==typeof this.defaultLocale&&null!==this.defaultLocale&&(this.defaultLocale=DEFAULT_OPTIONS.defaultLocale),"undefined"==typeof this.locale&&null!==this.locale&&(this.locale=DEFAULT_OPTIONS.locale),"undefined"==typeof this.defaultSeparator&&null!==this.defaultSeparator&&(this.defaultSeparator=DEFAULT_OPTIONS.defaultSeparator),"undefined"==typeof this.placeholder&&null!==this.placeholder&&(this.placeholder=DEFAULT_OPTIONS.placeholder),"undefined"==typeof this.fallbacks&&null!==this.fallbacks&&(this.fallbacks=DEFAULT_OPTIONS.fallbacks),"undefined"==typeof this.translations&&null!==this.translations&&(this.translations=DEFAULT_OPTIONS.translations)},I18n.initializeOptions(),I18n.locales={},I18n.locales.get=function(locale){var result=this[locale]||this[I18n.locale]||this["default"];return"function"==typeof result&&(result=result(locale)),result instanceof Array==!1&&(result=[result]),result},I18n.locales["default"]=function(locale){var countryCode,locales=[],list=[];return locale&&locales.push(locale),!locale&&I18n.locale&&locales.push(I18n.locale),I18n.fallbacks&&I18n.defaultLocale&&locales.push(I18n.defaultLocale),locales.forEach(function(locale){countryCode=locale.split("-")[0],~list.indexOf(locale)||list.push(locale),I18n.fallbacks&&countryCode&&countryCode!==locale&&!~list.indexOf(countryCode)&&list.push(countryCode)}),locales.length||locales.push("en"),list},I18n.pluralization={},I18n.pluralization.get=function(locale){return this[locale]||this[I18n.locale]||this["default"]},I18n.pluralization["default"]=function(count){switch(count){case 0:return["zero","other"];case 1:return["one"];default:return["other"]}},I18n.currentLocale=function(){return this.locale||this.defaultLocale},I18n.isSet=function(value){return void 0!==value&&null!==value},I18n.lookup=function(scope,options){options=this.prepareOptions(options);{var locale,scopes,translations,locales=this.locales.get(options.locale).slice();locales[0]}for(scope.constructor===Array&&(scope=scope.join(this.defaultSeparator)),options.scope&&(scope=[options.scope,scope].join(this.defaultSeparator));locales.length;)if(locale=locales.shift(),scopes=scope.split(this.defaultSeparator),translations=this.translations[locale]){for(;scopes.length&&(translations=translations[scopes.shift()],void 0!==translations&&null!==translations););if(void 0!==translations&&null!==translations)return translations}return this.isSet(options.defaultValue)?options.defaultValue:void 0},I18n.meridian=function(){var time=this.lookup("time"),date=this.lookup("date");return time&&time.am&&time.pm?[time.am,time.pm]:date&&date.meridian?date.meridian:DATE.meridian},I18n.prepareOptions=function(){for(var subject,args=slice.call(arguments),options={};args.length;)if(subject=args.shift(),"object"==typeof subject)for(var attr in subject)subject.hasOwnProperty(attr)&&(this.isSet(options[attr])||(options[attr]=subject[attr]));return options},I18n.createTranslationOptions=function(scope,options){var translationOptions=[{scope:scope}];return this.isSet(options.defaults)&&(translationOptions=translationOptions.concat(options.defaults)),this.isSet(options.defaultValue)&&(translationOptions.push({message:options.defaultValue}),delete options.defaultValue),translationOptions},I18n.translate=function(scope,options){options=this.prepareOptions(options);var translation,translationOptions=this.createTranslationOptions(scope,options),translationFound=translationOptions.some(function(translationOption){return this.isSet(translationOption.scope)?translation=this.lookup(translationOption.scope,options):this.isSet(translationOption.message)&&(translation=translationOption.message),void 0!==translation&&null!==translation?!0:void 0},this);return translationFound?("string"==typeof translation?translation=this.interpolate(translation,options):translation instanceof Object&&this.isSet(options.count)&&(translation=this.pluralize(options.count,translation,options)),translation):this.missingTranslation(scope)},I18n.interpolate=function(message,options){options=this.prepareOptions(options);var placeholder,value,name,regex,matches=message.match(this.placeholder);if(!matches)return message;for(var value;matches.length;)placeholder=matches.shift(),name=placeholder.replace(this.placeholder,"$1"),value=this.isSet(options[name])?options[name].toString().replace(/\$/gm,"_#$#_"):this.missingPlaceholder(placeholder,message),regex=new RegExp(placeholder.replace(/\{/gm,"\\{").replace(/\}/gm,"\\}")),message=message.replace(regex,value);return message.replace(/_#\$#_/g,"$")},I18n.pluralize=function(count,scope,options){options=this.prepareOptions(options);var translations,pluralizer,keys,key,message;if(translations=scope instanceof Object?scope:this.lookup(scope,options),!translations)return this.missingTranslation(scope);for(pluralizer=this.pluralization.get(options.locale),keys=pluralizer(Math.abs(count));keys.length;)if(key=keys.shift(),this.isSet(translations[key])){message=translations[key];break}return options.count=String(count),this.interpolate(message,options)},I18n.missingTranslation=function(){var message='[missing "';return message+=this.currentLocale()+".",message+=slice.call(arguments).join("."),message+='" translation]'},I18n.missingPlaceholder=function(placeholder){return"[missing "+placeholder+" value]"},I18n.toNumber=function(number,options){options=this.prepareOptions(options,this.lookup("number.format"),NUMBER_FORMAT);var precision,formattedNumber,negative=0>number,string=Math.abs(number).toFixed(options.precision).toString(),parts=string.split("."),buffer=[];for(number=parts[0],precision=parts[1];number.length>0;)buffer.unshift(number.substr(Math.max(0,number.length-3),3)),number=number.substr(0,number.length-3);return formattedNumber=buffer.join(options.delimiter),options.strip_insignificant_zeros&&precision&&(precision=precision.replace(/0+$/,"")),options.precision>0&&precision&&(formattedNumber+=options.separator+precision),negative&&(formattedNumber="-"+formattedNumber),formattedNumber},I18n.toCurrency=function(number,options){return options=this.prepareOptions(options,this.lookup("number.currency.format"),this.lookup("number.format"),CURRENCY_FORMAT),number=this.toNumber(number,options),number=options.format.replace("%u",options.unit).replace("%n",number)},I18n.localize=function(scope,value){switch(scope){case"currency":return this.toCurrency(value);case"number":return scope=this.lookup("number.format"),this.toNumber(value,scope);case"percentage":return this.toPercentage(value);default:return scope.match(/^(date|time)/)?this.toTime(scope,value):value.toString()}},I18n.parseDate=function(date){var matches,convertedDate,fraction;if("object"==typeof date)return date;if(matches=date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})([\.,]\d{1,3})?)?(Z|\+00:?00)?/)){for(var i=1;6>=i;i++)matches[i]=parseInt(matches[i],10)||0;matches[2]-=1,fraction=matches[7]?1e3*("0"+matches[7]):null,convertedDate=matches[8]?new Date(Date.UTC(matches[1],matches[2],matches[3],matches[4],matches[5],matches[6],fraction)):new Date(matches[1],matches[2],matches[3],matches[4],matches[5],matches[6],fraction)}else"number"==typeof date?(convertedDate=new Date,convertedDate.setTime(date)):date.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/)?(convertedDate=new Date,convertedDate.setTime(Date.parse([RegExp.$1,RegExp.$2,RegExp.$3,RegExp.$6,RegExp.$4,RegExp.$5].join(" ")))):date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)?(convertedDate=new Date,convertedDate.setTime(Date.parse(date))):(convertedDate=new Date,convertedDate.setTime(Date.parse(date)));return convertedDate},I18n.strftime=function(date,format){var options=this.lookup("date"),meridianOptions=I18n.meridian();options||(options={}),options=this.prepareOptions(options,DATE);var weekDay=date.getDay(),day=date.getDate(),year=date.getFullYear(),month=date.getMonth()+1,hour=date.getHours(),hour12=hour,meridian=hour>11?1:0,secs=date.getSeconds(),mins=date.getMinutes(),offset=date.getTimezoneOffset(),absOffsetHours=Math.floor(Math.abs(offset/60)),absOffsetMinutes=Math.abs(offset)-60*absOffsetHours,timezoneoffset=(offset>0?"-":"+")+(absOffsetHours.toString().length<2?"0"+absOffsetHours:absOffsetHours)+(absOffsetMinutes.toString().length<2?"0"+absOffsetMinutes:absOffsetMinutes);return hour12>12?hour12-=12:0===hour12&&(hour12=12),format=format.replace("%a",options.abbr_day_names[weekDay]),format=format.replace("%A",options.day_names[weekDay]),format=format.replace("%b",options.abbr_month_names[month]),format=format.replace("%B",options.month_names[month]),format=format.replace("%d",padding(day)),format=format.replace("%e",day),format=format.replace("%-d",day),format=format.replace("%H",padding(hour)),format=format.replace("%-H",hour),format=format.replace("%I",padding(hour12)),format=format.replace("%-I",hour12),format=format.replace("%m",padding(month)),format=format.replace("%-m",month),format=format.replace("%M",padding(mins)),format=format.replace("%-M",mins),format=format.replace("%p",meridianOptions[meridian]),format=format.replace("%S",padding(secs)),format=format.replace("%-S",secs),format=format.replace("%w",weekDay),format=format.replace("%y",padding(year)),format=format.replace("%-y",padding(year).replace(/^0+/,"")),format=format.replace("%Y",year),format=format.replace("%z",timezoneoffset)},I18n.toTime=function(scope,dateString){var date=this.parseDate(dateString),format=this.lookup(scope);return date.toString().match(/invalid/i)?date.toString():format?this.strftime(date,format):date.toString()},I18n.toPercentage=function(number,options){return options=this.prepareOptions(options,this.lookup("number.percentage.format"),this.lookup("number.format"),PERCENTAGE_FORMAT),number=this.toNumber(number,options),number+"%"},I18n.toHumanSize=function(number,options){for(var unit,precision,kb=1024,size=number,iterations=0;size>=kb&&4>iterations;)size/=kb,iterations+=1;return 0===iterations?(unit=this.t("number.human.storage_units.units.byte",{count:size}),precision=0):(unit=this.t("number.human.storage_units.units."+SIZE_UNITS[iterations]),precision=size-Math.floor(size)===0?0:1),options=this.prepareOptions(options,{precision:precision,format:"%n%u",delimiter:""}),number=this.toNumber(size,options),number=options.format.replace("%u",unit).replace("%n",number)},I18n.t=I18n.translate,I18n.l=I18n.localize,I18n.p=I18n.pluralize}("undefined"==typeof exports?this.I18n||(this.I18n={}):exports),I18n.translations={"zh-CN":{brand:"Peatio",submit:"提交",cancel:"取消",confirm:"确认",banks:{icbc:"工商银行",cbc:"建设银行",bc:"中国银行",bcm:"交通银行",abc:"农业银行",cmb:"招商银行",cmbc:"民生银行",cncb:"中信银行",hxb:"华夏银行",cib:"兴业银行",spdb:"浦东发展银行",bob:"北京银行",ceb:"光大银行",sdb:"深圳发展银行",pab:"平安银行",gdb:"广东发展银行",psbc:"中国邮政储蓄银行",bos:"上海银行"},fund_sources:{manage_bank_account:"银行帐号管理",manage_bank_account_desc:"通过增加提现银行帐号，以便每次提现时快速选择。",manage_coin_address:"提现地址管理",manage_coin_address_desc:"通过增加提现地址，以便每次提现时快速选择。",bank:"银行",account:"银行账号",label:"标签",address:"地址",action:"操作",add:"添加",remove:"移除","default":"默认"},funds:{deposit:"充值",withdraw:"提现",currency_name:{cny:"CNY",btc:"BTC"},deposit_cny:{title:"人民币充值",desc:"通过银行转账汇款的方式，经人工审核后充值人民币到您的交易账户中，流程如下：",desc_item_1:"1. 提交以下表单，获得转账识别码；",desc_item_2:"2. 银行转账汇款到云币交易所开户行，务必在备注栏填写识别码；",desc_item_3:"3. 人工审核汇款记录，确认后充值到您的云币账户。",attention:"特别提醒：充值银行账户姓名必须与您的实名认证姓名一致。",from:"汇款人",to:"收款人",deposit_name:"开户户名",deposit_account:"充值账号",add:"添加",manage:"管理",amount:"充值金额",min_amount:"最低金额100元",to_account:"收款账号",to_name:"收款账户",to_bank_name:"收款银行",opening_bank_name:"开户行"},deposit_btc:{title:"比特币充值"},deposit_coin:{address:"地址",new_address:"生成新地址",confirm_gen_new_address:"您确认要生成一个新的充值地址么？","open-wallet":"请使用您常用的钱包服务，本地钱包、在线钱包或移动端的钱包，选择付款或发送。",detail:"在您的钱包付款或发款中，复制以下专门为您充值准备的⽐特币地址，在金额中填入您希望充值到账的数量，同时别忘记支付⼀定的矿⼯费以保证交易尽快被全网确认。您也可以在移动端钱包中扫描二维码来进⾏行支付。 您可以重复使用此⽐特币地址和二维码进⾏行充值。","scan-qr":"在移动端钱包中扫描二维码来进行支付。",after_deposit:"完成以上操作后点击发送付款，此交易将被广播到全网，您便可以这⾥查看到此笔交易的状态，当交易达到全网1个确认 (⼤约10⾄至60分钟) 时，系统将自动充值到账。您可以到资产公开中查询。","generate-new":"生成新地址"},deposit_history:{title:"历史记录",identification:"转账识别码",time:"时间",txid:"交易哈希",confirmations:"确认数",from:"充值银行",amount:"充值金额",state_and_action:"状态/操作",cancel:"取消",no_data:"暂无历史数据",submitting:"已提交",cancelled:"已撤销",submitted:"受理中",accepted:"充值成功",rejected:"已驳回",checked:"充值成功",warning:"异常",suspect:"异常"},withdraw_cny:{title:"人民币提现",intro:"选择提现银行并输入帐号和提取金额，完成提交。",intro_2:"您提现的银行账户姓名必须和您实名认证的姓名一致。",attention:"提现服务时间：9:00 - 18:00 (18:00后的提现申请次日处理)",account_name:"账户名",withdraw_address:"提现账号",balance:"可用余额",withdraw_amount:"提取数量",manage_withdraw:"管理提现账号",fee_explain:"资费说明",min:"最低",withdraw_all:"全部提取"},withdraw_btc:{title:"比特币提现"},withdraw_coin:{intro:"指定要提现的地址，输入提取数量，提交即可，10分钟之内到账。",label:"标签",balance:"可用余额",amount:"提取数量",manage_withdraw:"管理提现地址",min:"最低",withdraw_all:"全部提取",fee_explain:"资费说明"},withdraw_history:{title:"提现历史",number:"编号",withdraw_time:"提现时间",withdraw_account:"提现账户",withdraw_address:"提现地址",withdraw_amount:"金额",actual_amount:"实际到账",fee:"手续费",miner_fee:"矿工费",state_and_action:"状态/操作",cancel:"取消",no_data:"暂无历史数据",submitting:"待确认",submitted:"待校验",rejected:"已驳回",accepted:"已提交",suspect:"异常",processing:"受理中",coin_ready:"准备中",coin_done:"完毕",done:"提现成功",almost_done:"发送中",canceled:"已撤销",failed:"提现出错"}},auth:{please_active_two_factor:"为了您的资金安全, 请先绑定手机或设置两步验证。",submit:"确认",otp_placeholder:"6位数字密码",google_app:"谷歌身份验证器",sms:"手机短信验证",send_code:"获取验证码",send_code_alt:"COUNT秒后重新发送",hints:{app:"谷歌验证器每三十秒会重新生成新密码，请及时输入。",sms:"请点击“获取验证码”按纽，我们将会把验证码以短信的方式发到您的手机上。"}},markets:{market_list:{all:"全部交易对",cny:"CNY交易对",btc:"BTC交易对"}}}},I18n.locale="zh-CN";