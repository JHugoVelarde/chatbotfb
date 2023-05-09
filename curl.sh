curl -k -X POST -H "Content-Type: application/json" -d '{
    "get_started": { "payload":
        "GET_STARTED_CONSEJOS"
    }
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBAJfKZA6XXNNFe03EnqG1RGZBOYvJlDVuZA1pU0k2PmpNqyXZAve605KkU82thkDD68dGDfgiqkJCbxgo6WjZAAi1SrUD2jbGoM3p1NNoAmcuZCYq9lsf5pxwUbrbY0GlKolkRV8WcORso1vAMvAtZBTymp3twEjWMrulbQ1VhaX"


curl -k -X POST -H "Content-Type: application/json" -d '{
    "greeting": [
        {
            "locale": "default",
            "text": "Hola {{user_first_name}}, Soy Consejos de Salud y te ayudo a mejorar tu salud"
        },
        {
            "locale": "en_US",
            "text": "Hi {{user_first_name}}"
        }
    ]
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBAJfKZA6XXNNFe03EnqG1RGZBOYvJlDVuZA1pU0k2PmpNqyXZAve605KkU82thkDD68dGDfgiqkJCbxgo6WjZAAi1SrUD2jbGoM3p1NNoAmcuZCYq9lsf5pxwUbrbY0GlKolkRV8WcORso1vAMvAtZBTymp3twEjWMrulbQ1VhaX"


curl -k -X POST -H "Content-Type: application/json" -d '{
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Habla con el doctor",
                    "payload": "CARE_HELP"
                },
                {
                    "type": "postback",
                    "title": "Menu de Productos",
                    "payload": "PRODUCTS"
                },
                {
                    "type": "web_url",
                    "title": "Pagina Web",
                    "url": "https://platzi.com",
                    "webview_height_ratio": "full"
                }
            ]
        }
    ]
}' "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=EAAhTFvtmZAZBsBAJfKZA6XXNNFe03EnqG1RGZBOYvJlDVuZA1pU0k2PmpNqyXZAve605KkU82thkDD68dGDfgiqkJCbxgo6WjZAAi1SrUD2jbGoM3p1NNoAmcuZCYq9lsf5pxwUbrbY0GlKolkRV8WcORso1vAMvAtZBTymp3twEjWMrulbQ1VhaX"