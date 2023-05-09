'use strict';  // Modo estricto

// Se importan los módulos necesarios para crear la aplicación
const express = require('express');  // Creamos una asignación para express
const bodyParser = require('body-parser');  // Creamos una asignación para body-parser
const request = require('request');   // Creamos una asignación para request
const access_token = "EAAhTFvtmZAZBsBAJfKZA6XXNNFe03EnqG1RGZBOYvJlDVuZA1pU0k2PmpNqyXZAve605KkU82thkDD68dGDfgiqkJCbxgo6WjZAAi1SrUD2jbGoM3p1NNoAmcuZCYq9lsf5pxwUbrbY0GlKolkRV8WcORso1vAMvAtZBTymp3twEjWMrulbQ1VhaX";

const app = express(); // Crea una instancia de la aplicación Express

// Vamos a configurar un puerto a nuestro servidor
app.set('port', 5000);   // Establece el puerto en el que la aplicación se va a ejecutar.
app.use(bodyParser.json());   // Indica que se debe usar "body-parser" para procesar las 
                              // solicitudes HTTP en formato JSON.

// Crea una ruta para la raiz ('/') de la app y saber que está disponible
app.get('/', function(req, response) {
    response.send('Servidor activo!');
});

// Creamos el webhook con su token
app.get('/webhook', function(req, response) {
    if (req.query['hub.verify_token'] === 'chatbot_token') {
        response.send(req.query['hub.challenge']);
    } else {
        response.send('No tiene permiso')
    }
});

// Confirmamos si hemos recibido un mensaje y devolvemos respuesta a Facebook
app.post('/webhook', function(req, res) {
    const webhook_event = req.body.entry[0];
    if (webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            // console.log(event);
            // handleMessage(event); Ya no se usa handleMessage
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);   // envía una respuesta de estado 200 al servidor de Facebook para confirmar la recepción del mensaje
});

// Función para manejar eventos
function handleEvent(senderId, event) {
    if (event.message) {
        console.log("Es un message")
        handleMessage(senderId, event.message);
    } else if (event.postback) {
        console.log("Es un postback")
        handlePostback(senderId, event.postback.payload)  // Son acciones enviadas desde el menú
    }
}

/* function handleMessage(event) {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText
        }
    }
    callSendApi(messageData);
} */

function handleMessage(senderId, event) {
    if (event.text) {
        // defaultMessage(senderId);
        // msgImage(senderId);
        // contacto(senderId);
        // ubicacion(senderId);
        // recibo(senderId);
        obtenerUbicacion(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event);
    }
}

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de Messenger",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Quieres algo?",
                    "payload": "CONSEJOS_SALUD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de?",
                    "payload": "ABOUT_SALUD"
                }
            ]
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}

function handlePostback(senderId, payload) {
    console.log("Ultimo payload capturado: " + payload);
    switch (payload) {
        case "GET_STARTED_CONSEJOS":
            console.log(payload);
            break;
        case "PRODUCTS":
            showProductos(senderId);
            break;
        case "INMUNOCAL_AZUL":
            cantProducto(senderId);
    }
}

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"   // Otras opciones son: "mark_seen" y "typing_off"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
            break;
        case "video":
            console.log(attachment_type);
            break;
        case "audio":
            console.log(attachment_type);
            break;
        case "file":
            console.log(attachment_type);
            break;
        case "location":
            console.log(JSON.stringify(event));
            break;
        default:
            console.log(attachment_type);
    }
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/v16.0/me/messages/",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function(err) {
        if(err) {
            console.log('Ocurrió un error');
        } else {
            console.log('Mensaje enviado');
        }
    }
    )
}

function showProductos(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Inmunocal",
                            "subtitle": "Caja azul",
                            "image_url": "https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "INMUNOCAL_AZUL"
                                }
                            ]
                        },
                        {
                            "title": "Inmunocal",
                            "subtitle": "Platinum",
                            "image_url": "https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "INMUNOCAL_PLAT"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function msgImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/3NtY188QaxDdC/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}

function contacto(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Habla con ventas",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Centro de ventas",
                            "payload": "+59170616269"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function ubicacion(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Nos encontramos en:",
                    "buttons": [
                        {
                            "title": "Zona Norte",
                            "type": "web_url",
                            "url": "https://www.google.com/maps/?hl=es"
                        },
                        {
                            "title": "Zona Sur",
                            "type": "web_url",
                            "url": "https://www.google.com/maps/?hl=es"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function recibo(senderId) {
    console.log("Entró a recibo");
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Oscar Barajas",
                    "order_number": "123123",
                    "currency": "BOB",
                    "payment_method": "Efectivo",
                    "order_url": "https://www.google.com/maps/?hl=es",
                    "timestamp": "1428444852",
                    "address": {
                        "street_1": "Platzi HQ",
                        "street_2": "",
                        "city": "Bolivia",
                        "postal_code": "00000",
                        "state": "Mexico",
                        "country": "La Paz"
                    },
                    "summary": {
                        "subtotal": 12.00,
                        "shipping_cost": 2.00,
                        "total_tax": 1.00,
                        "total_cost": 15.00
                    },
                    "adjustments": [
                        {
                            "name": "Descuento frecuente",
                            "amount": 1
                        }
                    ],
                    "elements": [
                        {
                            "title": "Inmunocal Azul",
                            "subtitle": "1 Caja",
                            "quantity": 1,
                            "price": 10,
                            "currency": "USD",
                            "image_url": "https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg"
                        },
                        {
                            "title": "Inmunocal Platinum",
                            "subtitle": "1 Caja",
                            "quantity": 2,
                            "price": 20,
                            "currency": "USD",
                            "image_url": "https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg"
                        }
                    ]
                }
            }
        }
    }
    console.log(messageData.message.attachment.payload);
    callSendApi(messageData);
}

function cantProducto(senderId) {
    console.log("Función cantProducto");
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    // "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Caja suelta",
                            "image_url": "https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg",
                            "subtitle": "Una caja",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Comprar",
                                    "payload": "AZUL_SUELTO"
                                }
                            ]
                        },
                        {
                            "title": "3 Pack",
                            "image_url": "https://images.dog.ceo/breeds/dachshund/dog-495122_640.jpg",
                            "subtitle": "Pack con descuento",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Comprar",
                                    "payload": "AZUL_3PACK"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function obtenerUbicacion(senderId) {
    console.log("Entró a obtener ubicación")
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Danos tu ubicación",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Mandar ubicación",
                    "payload": "UBICACION",
                    "image_url":"https://cdn.icon-icons.com/icons2/3406/PNG/512/current_location_icon_216318.png"
                }
            ]
        }
    }
    callSendApi(messageData);
}


// Inicia la aplicación y la escucha en el puerto especificado.
app.listen(app.get('port'), function() {
    console.log('Servidor activo en ', app.get('port'));
})
