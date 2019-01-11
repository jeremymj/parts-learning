const scryUtil = require('self-wlib')
const $ = require('jquery')

$(document).ready(function () {
    let host = 'http://127.0.0.1:9080/'
    $('#generate-code-but').click(function () {
        let initOver = function () {
            alert("初始化结束，可以进行安全交互");
        }
        scryUtil.startAuthorService('http://localhost:8080', initOver)
    });

    $('#userauthor').click(function () {
        //需要一个回调函数
        let login = function () {
            let signed_data = scryUtil.tokenSignPreaper()
            $.post(host + 'userLogin', {
                data: signed_data
            }, function (data, status) {
                let json_data = JSON.parse(data)
                alert('返回数据:' +  json_data.data)
                console.log("data result:", json_data.data)
                let resp = scryUtil.respDataDeserialization(json_data.data)
                alert('返回数据:' + resp)
            })
            console.log('prepare deal more action')
        }
        //执行是否初始化的检查
        scryUtil.startAuthorService('http://localhost:8080', login)
    })
    $('#add-user-info-but').click(function () {
        let tel = $('#user-info-tel-div input').val()
        let address = $('#user-info-address-div input').val()
        let credit_card = $('#user-info-credit_card input').val()
        let token = localStorage.getItem("token")
        let requestdata = {token: token, tel: tel, address: address, credit_card: credit_card}
        console.log("commit info is:",requestdata)
        scryUtil.addUserInfo('http://localhost:8080', requestdata)

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
            success: function (data) {
                console.log("data result:", data.data)
                let resp = scryUtil.respDataDeserialization(data.data)
                alert('返回数据:' + resp)
            }
        })
    })

   /* $('#submit').click(function () {
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
            success: function (data) {
                console.log("data result:", data.data)
                let resp = scryUtil.respDataDeserialization(data.data)
                alert('返回数据:' + resp)
            }
        })
    })*/
})

