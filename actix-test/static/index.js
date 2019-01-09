const scryUtil = require('self-wlib')
const $ = require('jquery')

$(document).ready(function () {
    let host = 'http://127.0.0.1:9080/'
    $('#userauthor').click(function () {
        //需要一个回调函数
        let login = function () {
            let signed_data = scryUtil.tokenSignPreaper()
            $.post(host + 'userLogin', {
                data: signed_data
            }, function (data, status) {
                alert('返回数据:' + data + '\n 状态:' + status)
            })
            console.log('prepare deal more action')
        }
        //执行是否初始化的检查
        scryUtil.startAuthorService('http://localhost:8080', login)
    })

    $('#submit').click(function () {
        let tel = $('#tel-div input').val()
        let address = $('#address-div input').val()
        let requestdata = {tel: tel, address: address}
        console.log(requestdata)
        let json_str = JSON.stringify(requestdata)
        console.log(json_str)
        let encryptdata = scryUtil.reqDataSerialization(json_str)
        let json_encryptdata = JSON.stringify(encryptdata)
        console.log(json_encryptdata)

        $.ajax({
            url: host + 'addNoticeMethod',
            data: {
                data: json_encryptdata
            },
            type: "POST",
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                console.log("data result:", data.data)
               let resp =  scryUtil.respDataDeserialization(data.data)
                alert('返回数据:' + resp)
            }
        })

        /*   $.post(host + 'addNoticeMethod', {
             data: json_encryptdata
           }, function (data) {
            console.log("data result:",data.result)
             alert('返回数据:' + data.result)
           },"json")*/
    })
})

