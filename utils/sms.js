const axios = require("axios");

async function SMS(phone, message) {
    const data = {
        email: "axror.uzza@mail.ru",
        password: "J17vF2MlnfoJNHaehj46Gmic3cCS4brsyLhkInuv",
    };
    await axios({
        method: "POST",
        url: "http://notify.eskiz.uz/api/auth/login",
        data,
    }).then((response) => {
        const text = {
            mobile_phone: phone,
            message: message,
        };
        axios({
            method: "POST",
            url: "http://notify.eskiz.uz/api/message/sms/send",
            headers: {
                Authorization: `Bearer ${response.data.data.token}`,
            },
            data: text,
        })
            .then((resp) => {
            })
            .catch((e) => {
                throw e;
            });
    })
}
module.exports = SMS;