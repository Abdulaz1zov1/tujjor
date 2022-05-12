module.exports = {
    TransportError: {
        code: -32300,
        message: "Transport Error",
        data: null,
    },
    AccessDeniet: {
        code: -32504,
        message: "AccessDeniet",
        data: null,
    },

    // ParseError: {
    //     code: -32700,
    //     message: "Parse Error",
    //     data: null,
    // },

    // MethodNotFound: {
    //     code: -32601,
    //     message: "Method not found",
    //     data: null,
    // },
    TransactionNotFound: {
        code: -31003,
        message: "Транзакция не найдена.",
        data: null,
    },
    UnexpectedTransactionState: {
        code: -31008,
        message: {
            ru: "Статус транзакции не позволяет выполнить операцию",
        },
        data: null,
    },
    YesTransaction: {
        code: -31099,
        message: {
            ru: "В ожидании оплаты",
            uz: "To'lov kutilmoqda",
            en: "Awaiting payment",
        },
    },
    IncorrectAmount: {
        code: -31001,
        message: {
            ru: "Неверная сумма заказа",
            uz: "Buyurtma summasi noto`g`ri",
            en: "Incorrect order price",
        },
        data: null,
    },
    OrderNotFound: {
        code: -31050,
        message: {
            ru: "Заказ не найден",
            uz: "Buyurtma topilmadi",
            en: "Order not found",
        },
        data: "order",
    },
    OrderAvailable: {
        code: -31051,
        message: {
            ru: "Не возможно выполнить операцию. Заказ ожидает оплаты или оплачен.",
        },
        data: "order",
    },
    OrderNotСanceled: {
        code: -31007,
        message: {
            ru: "Заказ выполнен. Невозможно отменить транзакцию. Товар или услуга предоставлена покупателю в полном объеме.",
        },
        data: null,
    },
};
