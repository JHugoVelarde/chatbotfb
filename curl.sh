curl -k -X POST -H "Content-Type: application/json" -d '{
    "get_started": { "payload": "BOTON_INICIO" }
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBANXqoGV3amXV4h7rcnfHmqAaWBaTkznnhWN3ihO0yFZCGEw6nay3jEWEWIRwsNAKAJw9caaQMqSxAs7g8eU5tA5gzYR9otaHkDV3ZCRZACzUa49RcmZA4TgAJAi0YoNhc33KxHmXSeH0izrNpopofhTtGeHyymTcTAWlHg7r"


curl -k -X POST -H "Content-Type: application/json" -d '{
    "greeting": [
        {
            "locale": "default",
            "text": "Hola {{user_first_name}}, para mejorar tu experiencia tenemos un ChatBot, un menÃº y asistencia humana. Nuestro compromiso es la satisfacciÃ³n del cliente."
        },
        {
            "locale": "es_LA",
            "text": "Hola {{user_first_name}}, para mejorar tu experiencia tenemos un ChatBot, un menÃº y asistencia humana. Nuestro compromiso es la satisfacciÃ³n del cliente."
        }
    ]
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBANXqoGV3amXV4h7rcnfHmqAaWBaTkznnhWN3ihO0yFZCGEw6nay3jEWEWIRwsNAKAJw9caaQMqSxAs7g8eU5tA5gzYR9otaHkDV3ZCRZACzUa49RcmZA4TgAJAi0YoNhc33KxHmXSeH0izrNpopofhTtGeHyymTcTAWlHg7r"


curl -k -X POST -H "Content-Type: application/json" -d '{
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Inicio de Chat",
                    "payload": "HOME"
                },
                {
                    "type": "postback",
                    "title": "Comprar ahora",
                    "payload": "SHOP"
                },
                {
                    "type": "postback",
                    "title": "DÃ³nde estamos",
                    "payload": "CITIES"
                },
                {
                    "type": "postback",
                    "title": "Horas de atenciÃ³n",
                    "payload": "SCHEDULE"
                },
                {
                    "type": "web_url",
                    "title": "Sitio Web",
                    "url": "https://immunotec.com/",
                    "webview_height_ratio": "full"
                },
                {
                    "type": "postback",
                    "title": "Eventos",
                    "payload": "EVENTOS"
                },
                {
                    "type": "postback",
                    "title": "ContÃ¡ctenos",
                    "payload": "CONTACT"
                },
                {
                    "type": "postback",
                    "title": "Preguntas frecuentes",
                    "payload": "FAQS"
                }
            ]
        }
    ]
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBANXqoGV3amXV4h7rcnfHmqAaWBaTkznnhWN3ihO0yFZCGEw6nay3jEWEWIRwsNAKAJw9caaQMqSxAs7g8eU5tA5gzYR9otaHkDV3ZCRZACzUa49RcmZA4TgAJAi0YoNhc33KxHmXSeH0izrNpopofhTtGeHyymTcTAWlHg7r"



// Copia de código
curl -k -X POST -H "Content-Type: application/json" -d '{
    "greeting": [
        {
            "locale": "default",
            "text": "\u{1F44B} Hola {{user_first_name}}, para mejorar tu experiencia tenemos un \u{1F916} ChatBot, \u{2198} un menú y \u{1F64B} asistencia humana."
        },
        {
            "locale": "en_US",
            "text": "Hi {{user_first_name}}, to enhance your experience we have a \u{1F916} ChatBot, \u{2198} a menu and \u{1F64B} human assistance."
        }
    ]
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBANXqoGV3amXV4h7rcnfHmqAaWBaTkznnhWN3ihO0yFZCGEw6nay3jEWEWIRwsNAKAJw9caaQMqSxAs7g8eU5tA5gzYR9otaHkDV3ZCRZACzUa49RcmZA4TgAJAi0YoNhc33KxHmXSeH0izrNpopofhTtGeHyymTcTAWlHg7r"