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
                let resp = scryUtil.respDataDeserialization(json_data.data)
                alert('用户认证成功')
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
        let requestdata = {tel: tel, address: address, credit_card: credit_card}
        console.log("commit info is:", requestdata)
        //这个地方还是需要写回调函数处理提交数据的结果
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
            url: host + 'submitOrder',
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

    $('#cart-submit').click(function () {

        let requestdata = {id: "SN23354"};
        let json_str = JSON.stringify(requestdata)
        console.log("cart-submit,requestdata:", json_str)
        let encryptdata = scryUtil.reqDataSerialization(json_str)
        let json_encryptdata = JSON.stringify(encryptdata)

        let func = function(token){
            $.ajax({
                url: host + 'submitOrder',
                data: {
                    AccessToken:token,
                    OrderDetail: json_encryptdata
                },
                type: "POST",
                dataType: "json",
                success: function (data) {
                    alert('订单提交成功')
                },
                error:function (data) {
                    alert(data.msg)
                }
            })
        }

        $.ajax({
            url: host + 'isAuthorAccess',
            data: {
                data: 'submitOrder'
            },
            type: "POST",
            dataType: "json",
            success: function (data) {
                if (data.result) {
                    //需要获取访问token
                    let author_data = {"public_key": data.public_key, "datatype": data.datatype}
                    let req_token_data = JSON.stringify(author_data)
                    console.log("req token data:", req_token_data)
                    let token = scryUtil.getAccessToken(req_token_data,func)
                } else {
                }
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

