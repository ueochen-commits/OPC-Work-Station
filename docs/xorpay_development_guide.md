# XorPay 支付平台开发文档

> 文档抓取时间：2026-04-10
> 官网：https://xorpay.com

---

## XorPay 介绍 · XorPay 支付平台文档

XorPay 介绍
XorPay 作为支付宝系统服务商ISV和微信支付服务商，专业为开发者对接微信支付宝，支持当面付/NATIVE/JSAPI/收银台/条码支付/小程序等支付方式
为什么开发 XorPay
我们知道作为独立开发者产品需要收款是多么麻烦，注册公司维护成本太高，市面上各种收款工具要么手续费太高，要么到账很慢，体验很不好。于是我们开发了「XorPay 」用来解决这个问题，希望可以帮助到每个默默前行的独立开发者。
收费是对自己劳动成果最起码的尊重。
客服联系方式
客服电话: 95017
客服微信: xorpay_com
客服 QQ : 1701943006
客服邮箱: [email protected]

---

## FAQ 常见问题 · XorPay 支付平台文档

FAQ 常见问题
关于接入
常见问题
不用安装 APP，不需要手机监控，不用上传二维码
钱款直接到你的账户，不经过 XorPay 中转
微信 T+1 ，支付宝即时到账
支付的时候，微信支付名字可以自定义，支付宝显示自己的名字
审核时间多久？微信几分钟，支付宝几个小时
微信什么时候打电话？微信里面会有通知，一般是审核通过后第二天
微信电话漏接怎么办？没事，会再打
打电话会问什么问题？机器人拨打的，测试手机连通性，按1即可
"商户-XXX" 这个可以修改吗？不能，微信自动的
支付宝支付的时候显示什么名称？你签约支付宝的名字
支持个人接入吗？
当然，XorPay 支持个人、个体户、企业、其他组织接入
个人签约和个体户、公司签约有什么区别？
个人限额，个体户、公司不限额
已经在其它地方签约，还可以在 XorPay 签约吗？
可以
一个微信号可以开通多少个？
一个身份证、银行卡可以注册多个微信号，一个微信号可以开通一个 XorPay
申请的微信和支付宝不同同一个人的可以吗？
可以
为什么要收费￥100
为防止恶意提交资料，所以就设置了一个门槛，开通费￥100，成功开通不能退款（防止无理取闹，请谅解）；微信或支付宝任一渠道开通视为开通（成功开通的定义：微信或支付宝任一渠道资料进件成功，视为开通成功，不包含后续的用户扫码授权、实名认证）
多长时间不用微信支付宝官方会回收支付权限？
一般是 30 天没有交易记录即为交易停滞，微信和支付宝官方会回收交易权限。为防止交易停滞，可以每月定期创建一笔测试订单。如果支付权限被回收后想要继续使用，需要重新提交申请资料，重新开通需要收费 100。
是二清吗？
不是，我们使用的是支付宝或微信官方商户接口，资金由支付宝或微信（或者拥有支付牌照的机构）清算下发到个人同名银行卡
资金有风险吗？
没有，资金由微信官方 T+1 自动结算到 个人同名 银行卡，安全可靠无风险
什么是小微商户？
小微商户指依据法律法规和相关监管规定免于办理工商注册登记、无营业执照的实体特约商户
关于收费
XorPay 怎么收费？
收费包括三个部分：
微信/支付宝渠道，官⽅收 0.38% 固定⼿续费，从每笔收款中扣除
XorPay 平台手续费，体验版 1.2%、基础版 1%、标准版 0.8%、⾼高级版 0.6%，交易成功后从你的 XorPay 账号余额中扣除，需要预先充值到你的 XorPay 账号
Xorpay 平台套餐费，体验版 0¥/⽉、基础版 10¥/⽉、标准版 30¥/⽉、高级版 60¥/⽉
关于限额
微信支付特点？
微信单笔限额 2W, 单日限额 5W
每天早上十点前腾讯会将 0:00 之前的款项下发到绑定的个人银行卡中，打款人显示为：财付通支付有限公司
支持 native 扫码 和 jsapi (微信内置浏览器可直接拉起支付)
支付宝支付特点？
支付宝单笔限额 1k, 单日限额 5W
支付宝为及时到账，到签约个人支付宝账号余额
支持拉起H5(支付宝 app 支付)
关于结算
结算的金额和后台显示的收款金额怎么不一致？
后台显示的是支付宝和微信总和
后台显示的是实时收款金额，结算是隔天结算
可以用 签约微信账号 关注下方小程序查看微信结算情况
如何修改结算银行卡和支付名字？
微信的可以修改，支付宝不能修改；用签约微信打开上面👆 小程序，点击顶部“商户-XXX”，进入的页面有“结算银行账户”
自动提现失败后，如何发起手动提现？
进入 XorPay 应用管理后台 点击“修改商户信息”，点击“重新提现”，填写需要提现的日期，点击确定即可重新提现，一般过一两个小时，或者明天早上十点之前会到账
其他
可以修改客服手机号吗？
后台应用配置页面自己修改
很喜欢 XorPay，我推荐朋友使用有奖励吗？
当然！开通后后台会有专属邀请链接，你的朋友通过该链接成功入驻 XorPay 后，你和你的朋友都将立即获得 ￥50 代金券（不可提现）
如何获取一个永久的收款码？
签约微信号搜索 "微信收款商业版" 小程序（上面那张图片👆），里面可以下载店铺收款码

---

## 各种产品如何接入 · XorPay 支付平台文档

接入指引
PC 网站接入
效果：用户点击支付后，页面展示微信或者支付宝二维码，用户用手机微信或支付宝扫码支付
接口：可以使用 JSAPI / Native / 收银台 / 支付宝当面付 支付接口
JSAPI 支付，通过构造二维码，用户微信扫码后在打开自己服务器的页面，再在这页面通过 JSAPI 拉起微信支付
收银台支付，效果和 JSAPI 一样，更简单，不用自己请求获取 openid，直接在 xorpay 的页面下发起支付
Native 支付，前端 ajax 请求自己后端的接口，后端接口请求 xorpay 支付接口，返回支付二维码，用户微信扫码后支付
支付宝当面付，方法同 Native 接口
PC 软件
效果：用户点击支付后，页面展示微信或者支付宝二维码，用户用手机微信或支付宝扫码支付
接口：可以使用 JSAPI / Native / 收银台 / 支付宝当面付 支付接口
JSAPI 支付，通过构造二维码，用户微信扫码后在打开自己服务器的页面，再在这页面通过 JSAPI 拉起微信支付
收银台支付，效果和 JSAPI 一样，更简单，不用自己请求获取 openid，直接在 xorpay 的页面下发起支付
Native 支付，前端 ajax 请求自己后端的接口，后端接口请求 xorpay 支付接口，返回支付二维码，用户微信扫码后支付
支付宝当面付，方法同 Native 接口
手机网站接入
效果：个人微信接口没有 h5 功能不能拉起微信 app（个人支付宝当面付可以 h5 拉起支付宝 app），在微信浏览器里面可以通过 jsapi 拉起微信支付
接口：可以使用 JSAPI / 收银台 / 支付宝当面付 支付接口
JSAPI 支付
通过构造二维码，用户微信扫码（或者截图相册识别）后在打开你的一个页面
你页面重定向 openid 接口获取 openid 后跳会跳回你的页面
然后你的这个页面后台带 openid 调用 JSAPI 接口获取支付参数，并返回到前端
前端再拉起微信支付
收银台支付，效果和 JSAPI 一样，更简单，不用自己请求获取 openid，直接在 xorpay 的页面下发起支付
支付宝当面付，后台请求接口，返回支付二维码，用户支付宝扫码（或者截图相册识别）后支付；也可以跳转 qr 地址，拉起支付宝 app 支付
小程序接入
效果：用户点击支付后，跳转 xorpay 收银台 小程序支付，支付完成后自动跳回你的小程序
接口：可以使用 小程序 支付接口
手机 app
效果：因为个人的微信接口没有 h5 功能（个人支付宝当面付可以 h5），所以只能扫码
接口：可以使用 JSAPI / 收银台 / 支付宝当面付 支付接口
JSAPI 支付
通过构造二维码，用户微信扫码（或者截图相册识别）后在打开你的一个页面
你页面重定向 openid 接口获取 openid 后跳会跳回你的页面
然后你的这个页面后台带 openid 调用 JSAPI 接口获取支付参数，并返回到前端
前端再拉起微信支付
收银台支付，效果和 JSAPI 一样，更简单，不用自己请求获取 openid，直接在 xorpay 的页面下发起支付
支付宝当面付，后台请求接口，返回支付二维码，用户支付宝扫码（或者截图相册识别）后支付；也可以跳转 qr 地址，拉起支付宝 app 支付

---

## DEMO 下载 · XorPay 支付平台文档

DEMO 下载
欢迎开发者提供 SDK或DEMO ，采纳者奖励 ￥200 代金券
HTML/JS / HTML/JS 收银台
Python
PHP / Laravel框架SDK / FastAdmin SDK / DedeCMS 插件
Java
Nodejs
.NET/C#
微信小程序模板

---

## API 接口 · XorPay 支付平台文档

API 接口
签名算法
支付宝 - 当面付
支付宝 - 条码支付
微信 - NATIVE 扫码支付
微信 - 收银台支付
微信 - 小程序支付
微信 - JSAPI 网页支付
微信 - 条码支付
微信 - 获取 OPENID
订单状态查询
回调通知
退款接口
支付方式对照表

---

## 签名算法 · XorPay 支付平台文档

签名算法
重要接口需要签名校验，签名前请先到 XorPay 账号后台 查看你的 app secret
Python 代码示例
import hashlib
def sign(*p):
return hashlib.md5(u''.join(p).encode('utf8')).hexdigest().lower()
sign(
u'内容订阅一年期',
'native',
'50.00',
'102',
'http://example.com/xorpay_notify',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' #app secret
)
JavaScript 代码示例
md5.js

---

## 支付宝 - 当面付 · XorPay 支付平台文档

支付宝当面付
说明
调用方法为 POST， content-type 为 application/x-www-form-urlencoded
请求该接口可以获取支付二维码链接，可以将该链接生成二维码给用户扫码，或者直接跳转该链接拉起支付宝 app（俗称H5）（如果你用的是「聚合A」支付通道的支付宝支付需要在该链接前加 alipays://platformapi/startapp?appId=20000067&url= 才能拉起支付宝）
用户用手机扫码可以支付
接口地址
https://xorpay.com/api/pay/aid
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
name
string
是
商品名称
pay_type
string
是
alipay
price
string
是
价格如: 50.00
order_id
string
是
你平台订单号，需要唯一
order_uid
string
否
订单用户如: [email protected]
notify_url
string
是
回调地址
more
string
否
订单其他信息，回调时原样传回
expire
int
否
订单过期秒数，默认 7200
sign
string
是
将参数按name + pay_type + price + order_id + notify_url + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
pay_type=alipay&name=XorPay+ %E8%B4%A6%E6%88%B7%E5%85%85%E5%80%BC&order_uid=a%40b.com&order_id=14&price=0.01&sign=23f 486d9bb15x6b11f753547558626d7¬ify_url=http%3A%2F%2Fexample.com%3A3094%2Fpay_callback
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
只有在 ok 的情况下才有后面的参数ok 成功no_contract 未签约no_alipay_contract 未签约支付宝missing_argument 缺少参数app_off 账号被冻结aid_not_exist aid不存在pay_type_error 支付类型错误sign_error 签名错误order_payed 订单已支付order_expire 订单过期alipay_api_error 并且 info 是 ACQ.ACCESS_FORBIDDEN 表示需要去支付宝发来的邮件里面点签约alipay_api_error 并且 info 是 aop.invalid-app-auth-token 联系客服处理fee_error 余额不足order_exist 同一订单，参数不同
aoid
string
否
XorPay 平台统一订单号
expire_in
int
否
订单过期秒数
info
dict
否
qr 支付二维码
举例:
{u'status': u'ok', u'info': {u'qr': u'https://qr.alipay.com/baxbe6067atdzqfdxjcq20ff'}, u'expires_in': 7200, u'aoid': u'dfa20e231xf64069a615ecfme0m27x26'}
最后
返回结果里面 qr 既是支付二维码，用支付宝扫码即可支付；在大部分手机上（有小部分可能无法拉起支付宝app支付），跳转 qr 这个地址参数，可以拉起支付宝 app 支付（h5）
或者 手机跳转这个地址(url schema) 也可以拉起支付宝 App
alipays://platformapi/startapp?appId=20000067&url=http%3A%2F%2Fxorpay.com
url 参数替换为 qr

---

## 支付宝 - 条码支付 · XorPay 支付平台文档

条码支付
说明
扫码设备读取到用户支付条码，判断是支付宝条码还是微信条码，设置不同的 pay_type
微信条码为18位纯数字，以10、11、12、13、14、15开头，支付宝是 28 开头
调用方法为 POST， content-type 为 application/x-www-form-urlencoded
接口地址
https://xorpay.com/api/barcode_pay/aid
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
name
string
是
商品名称
pay_type
string
是
wechat_barcode 或 alipay_barcode
price
string
是
价格如: 50.00
order_id
string
是
你平台订单号，需要唯一
order_uid
string
否
订单用户如: [email protected]
notify_url
string
是
回调地址
barcode
string
是
支付条码
more
string
否
订单其他信息，回调时原样传回
sign
string
是
将参数按name + pay_type + price + order_id + notify_url + barcode + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
pay_type=wechat_barcode&name=XorPay+ %E8%B4%A6%E6%88%B7%E5%85%85%E5%80%BC&order_uid=a%40b.com&order_id=14&price=0.01&sign=23f 486d9bb15x6b11f753547558626d7¬ify_url=http%3A%2F%2Fexample.com%3A3094%2Fpay_callback&barcode=abcdefghi
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
missing_argument 缺少参数app_off 账号被冻结aid_not_exist aid不存在pay_type_error 支付类型错误sign_error 签名错误order_payed 订单已支付order_expire 订单过期wechat_api_error 可能账号被风控fee_error 余额不足order_exist 同一订单，参数不同new 等待回调通知 success 支付成功 除开以上状态，其他状态都需要用户刷新条码重新创建订单支付
aoid
string
否
XorPay 平台统一订单号，status 为 new 和 success 才有
detail
dict
否
支付信息详情，status 为 success 才有
举例:
支付成功，同步立即返回结果（用户开了小额免密支付，不用用户确认）
{u'status': u'success', u'detail': u'{"bank_type": "ALIPAYACCOUNT", "buyer": "[email protected]", "transaction_id": "2019101622000000000000000000"}', u'aoid': u'bbbbbbbbbbbbbbbbbbbxxxxxxxxxxxxxx}
请求成功，等待用户支付（等待用户输入密码等），用户支付后会异步回调通知
{u'status': u'new', u'aoid': u'bbbbbbbbbbbbbbbbbbbxxxxxxxxxxxxxx'}
支付失败，需要重新扫用户条码创建订单
{u'status': u'AUTH_CODE_INVALID'}
判断支付成功
可以等 xorpay 的回调通知
或者可以用 订单查询接口 查询订单状态

---

## 微信 - NATIVE 扫码支付 · XorPay 支付平台文档

NATIVE 扫码支付
说明
调用方法为 POST， content-type 为 application/x-www-form-urlencoded
请求该接口可以获取支付二维码
用户用手机扫码可以支付
该二维码不能相册识别和长按识别（如果你用的是「聚合A」支付通道，是可以长按识别的）
接口地址
https://xorpay.com/api/pay/aid
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
name
string
是
商品名称
pay_type
string
是
native
price
string
是
价格如: 50.00
order_id
string
是
你平台订单号，需要唯一
order_uid
string
否
订单用户如: [email protected]
notify_url
string
是
回调地址
more
string
否
订单其他信息，回调时原样传回
expire
int
否
订单过期秒数，默认 7200
sign
string
是
将参数按name + pay_type + price + order_id + notify_url + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
pay_type=native&name=XorPay+ %E8%B4%A6%E6%88%B7%E5%85%85%E5%80%BC&order_uid=a%40b.com&order_id=14&price=0.01&sign=23f 486d9bb15x6b11f753547558626d7¬ify_url=http%3A%2F%2Fexample.com%3A3094%2Fpay_callback
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
只有在 ok 的情况下才有后面的参数ok 成功missing_argument 缺少参数app_off 账号被冻结aid_not_exist aid不存在pay_type_error 支付类型错误sign_error 签名错误order_payed 订单已支付order_expire 订单过期wechat_api_error 可能账号被风控fee_error 余额不足order_exist 同一订单，参数不同
aoid
string
否
XorPay 平台统一订单号
expire_in
int
否
订单过期秒数
info
dict
否
qr 支付二维码
举例:
{u'status': u'ok', u'info': {u'qr': u'weixin://wxpay/bizpayurl?pr=jmmfbyN'}, u'expires_in': 7200, u'aoid': u'dfa20e231xf64069a615ecfee0527726'}

---

## 微信 - 收银台支付 · XorPay 支付平台文档

收银台支付
说明
调用方法为 GET 或 POST(content-type 为 application/x-www-form-urlencoded)
该接口自动获取用户 openid，然后调用 jsapi 接口发起支付
该接口在微信浏览器里面发起支付
该接口直接跳转网页支付页面，所以请构造好参数以后前端 GET/POST 到这个接口
接口地址
https://xorpay.com/api/cashier/aid
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
name
string
是
商品名称
pay_type
string
是
jsapi
price
string
是
价格如: 50.00
order_id
string
是
你平台订单号，需要唯一
order_uid
string
否
订单用户如: [email protected]
notify_url
string
是
回调地址
return_url
string
否
支付成功后前台跳转地址（需联系客服开通点金计划）
cancel_url
string
否
取消支付跳转的地址
more
string
否
订单其他信息，回调时原样传回
expire
int
否
订单过期秒数，默认 7200
sign
string
是
将参数按name + pay_type + price + order_id + notify_url + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
pay_type=jsapi&name=XorPay+ %E8%B4%A6%E6%88%B7%E5%85%85%E5%80%BC&order_uid=a%40b.com&order_id=14&price=0.01&sign=23f 486d9bb15x6b11f753547558626d7¬ify_url=http%3A%2F%2Fexample.com%3A3094%2Fpay_callback
返回参数
请求成功无返回内容，如果有返回表示出错。返回为 json 格式
名称
类型
必有
说明
status
string
否
ok 成功missing_argument 缺少参数app_off 账号被冻结aid_not_exist aid不存在pay_type_error 支付类型错误sign_error 签名错误order_payed 订单已支付order_expire 订单过期wechat_api_error 可能账号被风控fee_error 余额不足order_exist 同一订单，参数不同

---

## 微信 - 小程序支付 · XorPay 支付平台文档

小程序支付
小程序直接拉起支付(需要小程序主体为个体户或企业，个人不支持)
直接调用 JSAPI 接口 获取 jsapi 支付参数（接口需要额外传递小程序 appid/openid/is_mini 参数，如 /api/pay/aid?appid=xxxxxxx&openid=xxxxx&is_mini=true）
在你小程序直接调用微信支付方法（无需跳转 xorpay 小程序）微信官方文档
该方式可以自行决定是否支持 iOS 支付
wx.requestPayment({
timeStamp: '',
nonceStr: '',
package: '',
signType: 'MD5',
paySign: '',
success (res) {
//支付成功
},
fail (res) {
//支付失败
}
})

---

## 微信 - JSAPI 网页支付 · XorPay 支付平台文档

JSAPI 网页支付
说明
使用前先再 XorPay 后台 设置域名支付目录，最多设置5个支付授权目录, 且域名必须通过 ICP 备案
先通过 获取openid 接口获得用户 openid
然后请求接口，获得 jsapi 支付参数，再在网页用 WeixinJSBridge 调起支付
调用方法为 POST， content-type 为 application/x-www-form-urlencoded
接口地址
https://xorpay.com/api/pay/aid
其中 aid 为用户 aid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
name
string
是
商品名称
pay_type
string
是
jsapi
price
string
是
价格如: 50.00
order_id
string
是
你平台订单号，需要唯一
order_uid
string
否
订单用户如: [email protected]
notify_url
string
是
回调地址
return_url
string
否
支付成功后前台跳转地址（需联系客服开通点金计划）
openid
string
是
支付用户的openid
more
string
否
订单其他信息，回调时原样传回
expire
int
否
订单过期秒数，默认 7200
sign
string
是
将参数按name + pay_type + price + order_id + notify_url + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
pay_type=native&name=XorPay+ %E8%B4%A6%E6%88%B7%E5%85%85%E5%80%BC&order_uid=a%40b.com&order_id=14&price=0.01&sign=23f 486d9bb15x6b11f753547558626d7¬ify_url=http%3A%2F%2Fexample.com%3A3094%2Fpay_callback
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
只有在 ok 的情况下才有后面的参数ok 成功missing_argument 缺少参数app_off 账号被冻结aid_not_exist aid不存在pay_type_error 支付类型错误sign_error 签名错误order_payed 订单已支付order_expire 订单过期wechat_api_error 可能账号被风控fee_error 余额不足order_exist 同一订单，参数不同invalid_openid 请确保用我们提供的 openid 接口获取 openid，不能用自己公众号或小程序的 openid
aoid
string
否
XorPay 平台统一订单号
expire_in
int
否
订单过期秒数
info
dict
否
appId jsapi支付参数timeStamp jsapi支付参数nonceStr jsapi支付参数package jsapi支付参数signType jsapi支付参数paySign jsapi支付参数
前端页面调起支付 JS
function onBridgeReady(){
WeixinJSBridge.invoke(
'getBrandWCPayRequest', {
"appId" : "wxeeeeeeeeeeeeeeee", //公众号名称，由商户传入
"timeStamp":"0000000000", //时间戳，自1970年以来的秒数
"nonceStr" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", //随机串
"package" : "prepay_id=bbbbbbbbbbbbbbbbbbbbb",
"signType" : "MD5", //微信签名方式:
"paySign" : "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" //微信签名
},
function(res){
// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg 将在用户支付成功后返回 ok，但并不保证它绝对可靠。
if(res.err_msg == "get_brand_wcpay_request:ok" ) {}
}
);
}
if (typeof WeixinJSBridge == "undefined"){
if( document.addEventListener ){
document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
}else if (document.attachEvent){
document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
}
}else{
onBridgeReady();
}

---

## 微信 - 条码支付 · XorPay 支付平台文档

条码支付
说明
扫码设备读取到用户支付条码，判断是支付宝条码还是微信条码，设置不同的 pay_type
微信条码为18位纯数字，以10、11、12、13、14、15开头，支付宝是 28 开头
调用方法为 POST， content-type 为 application/x-www-form-urlencoded
接口地址
https://xorpay.com/api/barcode_pay/aid
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
name
string
是
商品名称
pay_type
string
是
wechat_barcode 或 alipay_barcode
price
string
是
价格如: 50.00
order_id
string
是
你平台订单号，需要唯一
order_uid
string
否
订单用户如: [email protected]
notify_url
string
是
回调地址
barcode
string
是
支付条码
more
string
否
订单其他信息，回调时原样传回
sign
string
是
将参数按name + pay_type + price + order_id + notify_url + barcode + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
pay_type=wechat_barcode&name=XorPay+ %E8%B4%A6%E6%88%B7%E5%85%85%E5%80%BC&order_uid=a%40b.com&order_id=14&price=0.01&sign=23f 486d9bb15x6b11f753547558626d7¬ify_url=http%3A%2F%2Fexample.com%3A3094%2Fpay_callback&barcode=abcdefghi
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
missing_argument 缺少参数app_off 账号被冻结aid_not_exist aid不存在pay_type_error 支付类型错误sign_error 签名错误order_payed 订单已支付order_expire 订单过期wechat_api_error 可能账号被风控fee_error 余额不足order_exist 同一订单，参数不同new 等待回调通知 success 支付成功 除开以上状态，其他状态都需要用户刷新条码重新创建订单支付
aoid
string
否
XorPay 平台统一订单号，status 为 new 和 success 才有
detail
dict
否
支付信息详情，status 为 success 才有
举例:
支付成功，同步立即返回结果（用户开了小额免密支付，不用用户确认）
{u'status': u'success', u'detail': u'{"bank_type": "ALIPAYACCOUNT", "buyer": "[email protected]", "transaction_id": "2019101622000000000000000000"}', u'aoid': u'bbbbbbbbbbbbbbbbbbbxxxxxxxxxxxxxx}
请求成功，等待用户支付（等待用户输入密码等），用户支付后会异步回调通知
{u'status': u'new', u'aoid': u'bbbbbbbbbbbbbbbbbbbxxxxxxxxxxxxxx'}
支付失败，需要重新扫用户条码创建订单
{u'status': u'AUTH_CODE_INVALID'}
判断支付成功
可以等 xorpay 的回调通知
或者可以用 订单查询接口 查询订单状态

---

## 微信 - 获取 OPENID · XorPay 支付平台文档

获取 OPENID
说明
GET 方式
浏览器请求该接口，XorPay 获取 openid 后会带 openid 参数重定向到你 callback 参数指定的的地址
接口地址
https://xorpay.com/api/openid/aid?callback=xxx
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
callback 参数记得 urlencode
举例说明
如果你 aid 为 999，callback 参数为
http://abc.com/pay
直接请求
https://xorpay.com/api/openid/999?callback=http%3A//abc.com/pay
那么 XorPay 获取 openid 参数后会跳转到
http://abc.com/pay&openid=xxxxxxxx 注意，这里连接符号是 & , 你可以根据实际情况在 callback 地址后面加个 /pay?a=1

---

## 生成二维码 · XorPay 支付平台文档

生成二维码
说明
GET 方式
接口地址
https://xorpay.com/qr?data=xxxxx
其中 xxxx 为 二维码内容
返回参数
返回为一张图片，可以作为 img 的 src

---

## 回调通知 · XorPay 支付平台文档

回调通知
说明
当订单支付成功后服务器会 立即 向你的服务器发起回调通知
POST 方式，content-type 为 application/x-www-form-urlencoded
接口地址
你传入的 notify_url 参数
请求参数
名称
类型
说明
aoid
string
XorPay 平台订单唯一标识
order_id
string
你传入的 order_id 参数
pay_price
float
例如: 50.00
pay_time
string
例如: 2019-01-01 00:00:00
more
string
订单传过来的其他信息
detail
string
json格式，订单支付详细信息transaction_id 渠道流水号bank_type 用户付款方式buyer 消费者
sign
string
签名, 参数 aoid + order_id + pay_price + pay_time + app secret 顺序拼接后 MD5
如何响应
当你收到回调请求后，如果响应HTTP 200(可以返回 ok/success 等字符)那么 XorPay 会认为通知成功，否则如果返回 HTTP 400/404/500 等其他状态码会认为通知失败， 会再次通知 6 次，间隔为 1/2/4/16/64/300 分钟。

---

## 支付方式对照表 · XorPay 支付平台文档

支付方式对照表
微信对照表链接
支付宝对照表链接

---

## 订单状态查询 · XorPay 支付平台文档

订单状态查询1
说明
GET 方式
接口地址
https://xorpay.com/api/query/aoid
其中 aoid 为 XorPay 平台订单号
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
not_exist 订单不存在new 订单未支付payed 订单已支付，未通知成功fee_error 手续费扣除失败success 订单已支付，通知成功expire 订单过期
订单状态查询2
说明
GET 方式
接口地址
https://xorpay.com/api/query2/aid?order_id=XXXXXXX&sign=XXXXXXXX
其中 aid 为用户 appid，请在 XorPay 后台 查看后替换
接口参数
名称
类型
必须
说明
order_id
string
是
你平台订单号
sign
string
是
将参数按order_id + app secret顺序拼接后MD5(纯 value 拼接，不要包含 + 号)
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
not_exist 订单不存在new 订单未支付payed 订单已支付，未通知成功fee_error 手续费扣除失败success 订单已支付，通知成功expire 订单过期

---

## 退款接口 · XorPay 支付平台文档

退款接口
说明
调用方法为 POST， content-type 为 application/x-www-form-urlencoded
每个支付订单的部分退款次数不能超过 50 次
接口地址
https://xorpay.com/api/refund/aoid
其中 aoid 为 XorPay 平台订单号
接口参数
名称
类型
必须
说明
price
string
是
退款金额如: 50.00
sign
string
是
将参数按price + app secret拼接后MD5(纯 value 拼接，不要包含 + 号)
POST body 举例:
price=0.01&sign=23f86d9bb15x6b11f753547558626d7
返回参数
返回为 json 格式
名称
类型
必有
说明
status
string
是
ok 成功order_error 订单状态不是success/或者订单不存在price_error 退款金额大于收款金额sign_error 签名错误alipay_api_error 支付宝接口错误
info
string
否
具体错误代码

---

## 关于风控 · XorPay 支付平台文档

关于风控
什么是风控
XorPay 基于微信和支付宝的风控，合法合规使用都没有任何问题。如果用为违法违规收款，微信和支付宝会基于自己的风控模型实时判断交易对账号进行
收款限额降低风控，第二天会恢复正常额度
结算周期延长风控，风控结束会恢复正常结算时间
冻结在途未结算资金风控，你的未结算资金被微信冻结了，如果你被冤枉了请在小程序提交申述
关闭支付权限风控，不能发起支付
处罚除退款外出资金权限风控，除了退款外，你的资金被微信冻结了，不能结算
关闭退款功能风控，不能退款
微信支付宝的风控模型属于内部机密逻辑，你不可能理解（不要问为什么第一笔交易就被风控了 或 一笔交易都没做就风控了 或 因为哪笔订单被风控）
目前还没有见到微信和支付宝冤枉一个好人，如果你被风控了，那么请先检查自己业务！
如何避免被风控
合法合规使用 XorPay
在商品页面 醒目位置 增加客服联系方式，解决好售后客服，消费者有疑问让其先和你沟通，避免产生纠纷投诉
关注后台订单中的投诉订单（在订单管理页面点击“投诉订单”按钮查看），及时主动和客户沟通
如何判断是否被风控
如果碰到无法发起支付、隔天未结算资金或者接口返回 wechat_api_error 或者 alipay_api_error 都有可能是账户被风控，如果被风控用于签约的微信账号或者支付宝账号都会有提示。对于微信，可以用 签约微信账号 关注下方小程序，然后点击商户名，进入“商户违规记录查询&申述”查看违规记录。
被风控后怎么办
联系消费者，协商处理，撤销投诉
联系微信 95017 提供订单信息，交易资料申述
用 签约微信账号 关注上方小程序，点击商户名，进入“商户违规记录查询&申述”查看违规记录，可以在这里提交申诉（成功率还是挺大的）注意：不管出没出现提示让你申诉你都可以提交申诉
做好客服，避免下次再产生纠纷
资金不是 XorPay 拦截的，XorPay 没办法帮你解封

---

