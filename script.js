const ERR_MSG = '未入力項目または不正な文字入力があります'
const LINE = '======================='
let MESSAGE
let CONDITION
let PROBLEM

const ITEM_LIST = [
  'period'                             // 第何期
  , 'current_assets'                   // 流動資産
  , 'fixed_asset'                      // 固定資産
  , 'total_assets'                     // 資産合計(流動資産 + 固定資産)
  , 'current_Liabilities'              // 流動負債
  , 'shareholders_equity'              // 株主資本
  , 'capital'                          // 資本金
  , 'capital_surplus'                  // 資本余剰金
  , 'capital_reserve'                  // 資本準備金
  , 'retained_earnings'                // 利益剰余金
  , 'other_retained_earnings'          // その他利益余剰金
  , 'net_income'                       // (うち当期純利益)
  , 'total_net_assets_and_liabilities' // 純資産及び負債の合計()
]

const ITEM_HASH = {
  '資産の部': [
    '流動資産'
    , '固定資産'
    , '合計'
  ]
  , '負債及び純資産の部': [
    '流動負債'
    , '株主資本'
    , '資本金'
    , '資本余剰金'
    , '資本準備金'
    , '利益剰余金'
    , 'その他利益余剰金'
    , '(うち当期純利益)'
    , '合計'
  ]
}
// console.log(ITEM_HASH['資産の部'][0]);
const FIRLD_LIST = [
  '科目'
  , '科目'
  , '金額(千円)'
]

window.onload = () => {
  let result = `<form name="form" action="main.html">`
      result += `<h1 id="${ITEM_LIST[0]}">第<input type="text" size="1" name="${ITEM_LIST[0]}">期決算公告</h1>`
      result += `<table border="1" width="450" >`
      result += `<tr>`
      FIRLD_LIST.forEach(element => result += `<th>${element}</th>`)
      result += `</tr>`

  let i = 1
  for (const KEY in ITEM_HASH) {
    if (KEY === '資産の部') {
      ITEM_HASH[KEY].forEach((element, index) => {
        if (index === 0) {
          result += `<tr>`
          result += `<td rowspan="${ITEM_HASH[KEY].length}"><b>${KEY}</b></td>`
        }
        result += `<td>${element}</td>`
        result += `<td id="${ITEM_LIST[i]}" width="100"><input type="text" name="${ITEM_LIST[i]}"></td>`
        result += `</tr>`
        i++
      })
    } else if (KEY === '負債及び純資産の部') {
      ITEM_HASH[KEY].forEach((element, index) => {
        if (index === 0) {
            result += `<tr>`
            result += `<td rowspan="${ITEM_HASH[KEY].length}"><b>${KEY}</b></td>`
        }
        result += `<td>${element}</td>`
        result += `<td id="${ITEM_LIST[i]}"width="100"><input type="text" name="${ITEM_LIST[i]}"></td>`
        result += `</tr>`
        i++
      })
    }
  }
  result += `</table>`
  result += `<input type="button" value="判定する" onclick="btn_click()">`
  result += `</form>`

  document.getElementById('render').innerHTML = result
}

const btn_click = () => {
  let value_list = [
    form.period.value                             // 第何期
    , form.current_assets.value                   // 流動資産
    , form.fixed_asset.value                      // 固定資産
    , form.total_assets.value                     // 資産合計(流動資産 + 固定資産)
    , form.current_Liabilities.value              // 流動負債
    , form.shareholders_equity.value              // 株主資本
    , form.capital.value                          // 資本金
    , form.capital_surplus.value                  // 資本余剰金
    , form.capital_reserve.value                  // 資本準備金
    , form.retained_earnings.value                // 利益剰余金
    , form.other_retained_earnings.value          // その他利益余剰金
    , form.net_income.value                       // (うち当期純利益)
    , form.total_net_assets_and_liabilities.value // 純資産及び負債の合計()
  ]

  for(let i = 0 ; i < value_list.length ; i ++){
          if (value_list[i].match(/[０-９]/)){
              value_list[i]= check(value_list[i])
            }
  }

  function check(elm) {
    return elm.replace(/[０-９]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
    });
}

  value_list = value_list.map(v => parseInt(v, 10))
  console.log(value_list.map(v => parseInt(v, 10)));
  let blank_num = 0
  // forEachではbreakできないためこの実装にしている。
  for (let index = 0; index < value_list.length; index++) {
    if (isNaN(value_list[index])) {
      blank_num++
      alert(ERR_MSG)
      break
    } else {
      document.getElementById(ITEM_LIST[index]).innerHTML = value_list[index]
    }
  }

  if (blank_num === 0) {
    /* 売上高 = 「総資産 × １倍」 */
    const AMOUNT_OF_SALES = (value_list[1] + value_list[2]) * 1
    /* 「過去の平均的な年間利益」=「（利益剰余金 − 当期純利益）÷（当期の期数 −１）」 */
    const KEYAVG_ANNUAL_PROFIT_IN_THE_PAST = (value_list[9] - value_list[11]) / (value_list[0] - 1)
    /* 流動比率 = 流動資産 ÷ 流動負債 */
    const CURRENT_RATIO = Math.floor((value_list[1] / value_list[4]) * 100)

    const parse_int_calc = num => parseInt((AMOUNT_OF_SALES / 12 * num), 10)
    /* 現金・預金 ＝ 売上高 ÷ 12ヶ月 × 1.5ヶ月 */
    const CASH_AND_DEPOSIT = parse_int_calc(1.5)
    /* 売掛金 ＝ 売上高 ÷ 12ヶ月 × ２ヶ月 */
    const ACCOUNTS_RECEIVABLE = parse_int_calc(2)
    /* 棚卸資産 ＝ 売上高 ÷ 12ヶ月 × １ヶ月 */
    const INVENTORY = parse_int_calc(1)

//ここから
    if (KEYAVG_ANNUAL_PROFIT_IN_THE_PAST < value_list.length - 2) {
      console.log('-> 当期は不調気味？')
      MESSAGE = '-> 当期は不調気味？'
    } else if ((value_list.length - 2 / value_list.length - 1) * 100 < 1){
      console.log('-> 「粉飾決算の可能性」もアタマに入れておくとよいでしょう。')
      MESSAGE = '-> 「粉飾決算の可能性」もアタマに入れておくとよいでしょう。'
    } else {
      console.log('-> おおむね問題なし')
      MESSAGE = '-> おおむね問題なし'
    }
    /* 流動比率は200%以上が望ましく、100%未満はマズイ */
    if (CURRENT_RATIO >= 200) {
      console.log('-> Good')
      CONDITION = '-> Good'
    } else if (CURRENT_RATIO < 100) {
      console.log('-> Bad')
      CONDITION = '-> Bad'
    } else {
      console.log('-> おおむね問題なし')
      CONDITION = '-> おおむね問題なし'
    }
    if ((CASH_AND_DEPOSIT + ACCOUNTS_RECEIVABLE + INVENTORY) < value_list[2]) {
      console.log('-> 流動資産のなかに架空資産や不良資産が混じっている可能性あり')
      PROBLEM = '-> 流動資産のなかに架空資産や不良資産が混じっている可能性あり'
    } else {
      console.log('-> おおむね問題なし')
      PROBLEM = '-> おおむね問題なし'
    }

    const RESULT_LIST = [
      `売上高:${AMOUNT_OF_SALES}`
      , `過去の平均的な年間利益:${KEYAVG_ANNUAL_PROFIT_IN_THE_PAST}`
      , `流動比率:${CURRENT_RATIO}`
      , `現金・預金:${CASH_AND_DEPOSIT}`
      , `売掛金:${ACCOUNTS_RECEIVABLE}`
      , `棚卸資産:${INVENTORY}`
      , LINE
      , '「過去の平均利益」'
      , MESSAGE
      , LINE
      , '「流動比率」'
      , CONDITION
      , LINE
      , 'やばい会社かどうか'
      , PROBLEM
    ]
    //ここまで

    let html = `<div></div>`
        html += `<ul type="disc">`
        RESULT_LIST.forEach(element => {
          html += `<li>${element}</li>`
        })
        html += `</ul>`
        console.log(html);
        document.getElementById('add').innerHTML = html
  }
}
