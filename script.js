const ERR_MSG = '未入力項目または不正な文字入力があります'
const LINE = '======================='

const ITEM_LIST = [
  'period'                   // 第何期
  , 'ryudou_shisan'          // 流動資産
  , 'kotei_shisan'           // 固定資産
  , 'total_shisan'           // 資産合計(流動資産 + 固定資産)
  , 'ryudou_husai'           // 流動負債
  , 'kabunushi_shihon'       // 株主資本
  , 'shihon_kin'             // 資本金
  , 'shihon_yozyoukin'       // 資本余剰金
  , 'shihon_zyunbikin'       // 資本準備金
  , 'rieki_yozyoukin'        // 利益剰余金
  , 'sonohokarieki_yozyoukin'// その他利益余剰金
  , 'uti_touki_zyunrieki'    // (うち当期純利益)
  , 'total_husai_jyunshisan' // 純資産及び負債の合計()
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

const FIRLD_LIST = [ '科目','金額(千円)','金額(千円)' ]

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
    form.period.value
    , form.ryudou_shisan.value
    , form.kotei_shisan.value
    , form.total_shisan.value
    , form.ryudou_husai.value
    , form.kabunushi_shihon.value
    , form.shihon_kin.value
    , form.shihon_yozyoukin.value
    , form.shihon_zyunbikin.value
    , form.rieki_yozyoukin.value
    , form.sonohokarieki_yozyoukin.value
    , form.uti_touki_zyunrieki.value
, form.total_husai_jyunshisan.value
  ]

  value_list = value_list.map((v, index) => parseInt(v, 10))

  let input_check = 0
  // forEachではbreakできないためこの実装にしている。
  for (let index = 0; index < value_list.length; index++) {
    if (isNaN(value_list[index])) {
      input_check++
      alert(ERR_MSG)
      break;
    } else {
      document.getElementById(ITEM_LIST[index]).innerHTML = value_list[index]
    }
  }

  if (input_check === 0) {
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

    console.log('売上高:' + AMOUNT_OF_SALES)
    console.log('過去の平均的な年間利益:' + KEYAVG_ANNUAL_PROFIT_IN_THE_PAST)
    console.log('流動比率:' + CURRENT_RATIO)
    console.log('現金・預金:' + CASH_AND_DEPOSIT)
    console.log('売掛金:' + ACCOUNTS_RECEIVABLE)
    console.log('棚卸資産:' + INVENTORY)

    console.log(LINE)
    console.log('「過去の平均利益」')
    if (KEYAVG_ANNUAL_PROFIT_IN_THE_PAST < value_list.length - 2) {
      console.log('-> 当期は不調気味？')
    } else if ((value_list.length - 2 / value_list.length - 1) * 100 < 1){
      console.log('-> 「粉飾決算の可能性」もアタマに入れておくとよいでしょう。')
    }else {
      console.log('-> おおむね問題なし')
    }

    console.log(LINE)
    console.log('「流動比率」')
    /* 流動比率は200%以上が望ましく、100%未満はマズイ */
    if (CURRENT_RATIO >= 200) {
      console.log('-> Good')
    } else if (CURRENT_RATIO < 100) {
      console.log('-> Bad')
    } else {
      console.log('-> おおむね問題なし')
    }

    console.log(LINE)
    console.log('やばい会社かどうか')
    if ((CASH_AND_DEPOSIT + ACCOUNTS_RECEIVABLE + INVENTORY) < value_list[2]) {
      console.log('-> 流動資産のなかに架空資産や不良資産が混じっている可能性あり')
    } else {
      console.log('-> おおむね問題なし')
    }
  }
}
