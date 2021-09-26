
const { prepare, request, getResult} = klipSDK
const canvas = document.getElementById('canvas')
const res = document.querySelector('.res')
const auth_btn = document.querySelector('.auth-btn')
const contract_btn = document.querySelector('.contract-btn')

let key;
let isStop = false


auth_btn.addEventListener('click', async () => {
    const bappName = 'test app'
    const successLink = ''
    const failLink = ''

    // request key 생성하기
    const response = await prepare.auth({ bappName, successLink, failLink })
    isStop = false
    // request key 생성 실패?
    if(response.err){
        alert('fail')
    } else {
        // request key 생성 성공시
        key = response.request_key
        // auth requset 요청, 모바일인지 아닌지 확인
        // 모바일이면 바로 klip 연결
        // pc라면 qr code 생성
        await request(key, () => prepare_qr(key))

    }
})

contract_btn.addEventListener('click', async () => {
    const bappName = 'test app'
    const from = ''
    // 호출 컨트랙트 주소
    const to = '0xAddress'
    // 호출시 value값 없으면 0으로 작성
    const value = '0'
     // token Transfer abi
    const abi = "{\"constant\": false,\"inputs\": [{\"name\": \"_to\",\"type\": \"address\"},{\"name\": \"_value\",\"type\": \"uint256\"}],\"name\": \"transfer\",\"outputs\": [{\"name\": \"success\",\"type\": \"bool\"}],\"payable\": false,\"stateMutability\": \"nonpayable\",\"type\": \"function\"}"
    const params = "[\"0xAddress\", 10000000000000000]"
    const successLink = ''
    const failLink = ''
    const response = await prepare.executeContract({ bappName, from, to, value, abi, params, successLink, failLink })
    isStop = false
    if(response.err){
        alert('fail')
    } else {

        // request key 생성 성공시
        key = response.request_key
        // auth requset 요청, 모바일인지 아닌지 확인
        // 모바일이면 바로 klip 연결
        // pc라면 qr code 생성
        await request(key, () => prepare_qr(key))

    }
})

const prepare_qr = (key) =>{
    QRCode.toCanvas(canvas, `https://klipwallet.com/?target=/a2a?request_key=${key}`, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
}

const get_res = async () =>{
    if(key != ''){
        const result = await getResult(key)
        if(result.status == "completed"){
            res.textContent = JSON.stringify(result)
            isStop = true
        }      
    }
}

const interval = setInterval(function() {
    if(!isStop){
        get_res()
    } 
},3000)
    
