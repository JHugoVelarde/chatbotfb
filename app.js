'use strict';  // Modo estricto

// Se importan los módulos necesarios para crear la aplicación
const express = require('express');  // Creamos una asignación para express
const bodyParser = require('body-parser');  // Creamos una asignación para body-parser
const axios = require('axios');  // Biblioteca para realizar solicitudes HTTP en Node.js y en el navegador
const request = require('request');   // Está obsoleto, en su lugar se usa 'axios'
const path = require('path');  // Para que pueda manejar directorios del proyecto
let currentReq;

// Identificador de acceso a la página para usar la API de Facebook
const access_token = "EAAhTFvtmZAZBsBANXqoGV3amXV4h7rcnfHmqAaWBaTkznnhWN3ihO0yFZCGEw6nay3jEWEWIRwsNAKAJw9caaQMqSxAs7g8eU5tA5gzYR9otaHkDV3ZCRZACzUa49RcmZA4TgAJAi0YoNhc33KxHmXSeH0izrNpopofhTtGeHyymTcTAWlHg7r";
const graphfb = "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${access_token}"

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


app.use('/resources', express.static('resources'));

// app.use(express.static(path.join(path.resolve(), "resources")));


// NO FUNCIONO!
// Configurar el mensaje de saludo y el botón de 'comenzar' al iniciar el servidor
// setupSaludoYBoton();


// Confirmamos si hemos recibido un mensaje y devolvemos respuesta a Facebook
app.post('/webhook', function(req, res) {
    const webhook_event = req.body.entry[0];
    if (webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            // console.log(event);
            // handleMessage(event); Se reemplaza por la siguiente línea
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);   // envía una respuesta de estado 200 al servidor de Facebook para confirmar la recepción del mensaje
});

// NO FUNCIONO!
// Configure el mensaje de bienvenida y el botón "empezar"
/* async function setupSaludoYBoton() {
    try {
        const response = await axios.post(
            "https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${access_token}",
            {
                "greeting": [
                    {
                        "locale": "default",
                        "text": "Hola {{user.first.name}}, usa el menú recurrente para ayudarte."
                    }, {
                        "locale":"en_US",
                        "text":"Timeless apparel for the masses."                  
                    }
                ],
                "get_started": {
                    "payload": "GET_STARTED"
                }
            }
        );
        console.log("Saludo inicial y botón empezar configurados");
    } catch(error) {
        console.error("Ocurrió un error al configurar saludo y botón");
    }
} */


// Función para manejar eventos
function handleEvent(senderId, event) {
    if (event.message) {
        // console.log("Es un mensaje");
        handleMessage(senderId, event.message);
    } else if (event.postback) {
        // console.log("Es un postback")
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

function handleMessage(senderId, event, currentReq) {
    if (event.text) {
        switch (event.text) {
            case "¿Dónde estamos?":
                dondeEstamos(senderId);
                break;
            case "Horas de atención":
                horasAtencion(senderId);
                break;
            case "Eventos":
                ultimosEventos(senderId);
                break;
            case "Comprar ahora":
                comprarAhora(senderId);
                break;
            case "La Paz":
                ciudadLpz(senderId);
                break;
            case "Cochabamba":
                ciudadCbba(senderId);
                break;
            case "Santa Cruz":
                ciudadScz(senderId);
                break;
            case "Tarija":
                ciudadTrj(senderId);            
        }
        // defaultMessage(senderId);
        // msgImage(senderId);
        // contacto(senderId);
        // ubicacion(senderId);
        // recibo(senderId);
        // obtenerUbicacion(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event);
    }
}

function handlePostback(senderId, payload) {
    console.log("Ultimo payload capturado: " + payload);
    senderActions(senderId);
    switch (payload) {
        case "BOTON_INICIO":
            // console.log(payload);
            defaultMessage(senderId);
            break;
        case "HOME":
        case "VOLVER":
            homeMessage(senderId);
            break;
        case "CITIES":
            dondeEstamos(senderId);
            break;
        case "SHOP":
            comprarAhora(senderId);
            break;
        case "SCHEDULE":
            horasAtencion(senderId);
            break;
        case "EVENTOS":
            ultimosEventos(senderId);
            break;
        case "CONTACT":
            contactar(senderId);
            break;
        case "FAQS":
            faqs(senderId);
            break;
        case "PRUEBA":
            prueba(senderId);
    }
}


function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "\u{1F916} Hola, recuerda que a tu derecha tienes el menú \u{2198},\npara navegar por muchas opciones.\n\n¿Qué puedo hacer por ti hoy?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Dónde estamos?",
                    "payload": "CITIES"
                },
                {
                    "content_type": "text",
                    "title": "Horas de atención",
                    "payload": "SCHEDULE"
                },
                {
                    "content_type": "text",
                    "title": "Eventos",
                    "payload": "EVENTOS"
                },
                {
                    "content_type": "text",
                    "title": "Comprar ahora",
                    "payload": "SHOP"
                }                
            ]
        }
    }
    // senderActions(senderId);
    callSendApi(messageData);
}

function homeMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "\u{1F916} Escoge una de las opciones de abajo ó puedes usar el menú de tu derecha \u{2198}",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Dónde estamos?",
                    "payload": "CITIES"
                },
                {
                    "content_type": "text",
                    "title": "Horas de atención",
                    "payload": "SCHEDULE"
                },
                {
                    "content_type": "text",
                    "title": "Eventos",
                    "payload": "EVENTOS"
                },
                {
                    "content_type": "text",
                    "title": "Comprar ahora",
                    "payload": "SHOP"
                }                
            ]
        }
    }
    callSendApi(messageData);
}


function dondeEstamos(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "\u{1F4CD} ¿En qué ciudad te encuentras?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "La Paz",
                    "payload": "LAPAZ"
                },
                {
                    "content_type": "text",
                    "title": "Cochabamba",
                    "payload": "CBBA"
                },
                {
                    "content_type": "text",
                    "title": "Santa Cruz",
                    "payload": "SCRUZ"
                },
                {
                    "content_type": "text",
                    "title": "Tarija",
                    "payload": "TARIJA"
                }                
            ]
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}


function ciudadLpz(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{1F3EC} En La Paz estamos ubicados en:\n\nZona Sur, Av. Calacoto\nCalle 15 No.777\n\n¿Qué deseas hacer ahora?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Google Maps",
                            "url": "https://www.google.com/maps"
                        },
                        {
                            "type": "web_url",
                            "title": "Whatsapp",
                            "url": "https://wa.me/59170616269"
                        },
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);    
}


function ciudadCbba(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{1F3EC} En Cochabamba estamos ubicados en:\n\nAv. Santa Cruz\nEdif. Vargas No.1451\n\n¿Qué deseas hacer ahora?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Google Maps",
                            "url": "https://www.google.com/maps"
                        },
                        {
                            "type": "web_url",
                            "title": "Whatsapp",
                            "url": "https://wa.me/59170616269"
                        },
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);    
}


function ciudadScz(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{1F3EC} En Santa Cruz estamos ubicados en:\n\nZona Barrio Lindo\nCalle Teniente Rivero No.225\n\n¿Qué deseas hacer ahora?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Google Maps",
                            "url": "https://www.google.com/maps"
                        },
                        {
                            "type": "web_url",
                            "title": "Whatsapp",
                            "url": "https://wa.me/59170616269"
                        },
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);    
}


function ciudadTrj(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{1F3EC} En Tarija estamos ubicados en:\n\nAv. Víctor Paz\nEsq. Méndez No.260\n\n¿Qué deseas hacer ahora?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Google Maps",
                            "url": "https://www.google.com/maps"
                        },
                        {
                            "type": "web_url",
                            "title": "Whatsapp",
                            "url": "https://wa.me/59170616269"
                        },
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);    
}


function horasAtencion(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{1F551} Nuestros horarios de atención son:\n\nLunes a Viernes\nMañanas: 09:00 a 12:00\nTardes: 14:00 a 20:00" 
                    + "\n\nSábado\n09:00 a 14:00\n\n¿Qué deseas hacer ahora?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Whatsapp",
                            "url": "https://wa.me/59170616269"
                        },
                        {
                            "type": "postback",
                            "title": "Comprar ahora",
                            "payload": "SHOP"
                        },                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}


function ultimosEventos(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload":  {
                        "url": "https://67d3-181-188-160-138.ngrok-free.app/resources/charla.jpg"
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}


function comprarAhora(senderId) {
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
                            "title": "Inmunocal Regular",
                            "subtitle": "Bs 607",
                            "image_url": "https://immunotec.com/shopping/productimages/1845000.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "REGULAR"
                                }
                            ]
                        },
                        {
                            "title": "Inmunocal Platinum",
                            "subtitle": "Bs 861",
                            "image_url": "https://immunotec.com/shopping/productimages/1845100.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "PLATINUM"
                                }
                            ]
                        },
                        {
                            "title": "Optimizer",
                            "subtitle": "Bs 447",
                            "image_url": "https://immunotec.com/shopping/productimages/1845609-500.2.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "OPTIMIZER"
                                }
                            ]
                        },
                        {
                            "title": "Inmunocal Regular",
                            "subtitle": "Bs 607",
                            "image_url": "https://immunotec.com/shopping/productimages/1845000.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "REGULAR"
                                }
                            ]
                        },
                        {
                            "title": "Inmunocal Platinum",
                            "subtitle": "Bs 861",
                            "image_url": "https://immunotec.com/shopping/productimages/1845100.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "PLATINUM"
                                }
                            ]
                        },
                        {
                            "title": "Optimizer",
                            "subtitle": "Bs 447",
                            "image_url": "https://immunotec.com/shopping/productimages/1845609-500.2.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir producto",
                                    "payload": "OPTIMIZER"
                                }
                            ]
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);
}


function contactar(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{1F4F2} Nuestros teléfonos son:\n\n1234567 - 2468123\n\n70612345" 
                    + "\n\nEmail:\ncorreo@email.com\n\n¿Qué deseas hacer ahora?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": "Whatsapp",
                            "url": "https://wa.me/59170616269"
                        },
                        {
                            "type": "postback",
                            "title": "Comprar ahora",
                            "payload": "SHOP"
                        },                        
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    senderActions(senderId);
    callSendApi(messageData);    
}


function faqs(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{2753} Preguntas Frecuentes\n\n",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "¿Llevan a domicilio?",
                            "payload": "PRUEBA"
                        },
                        {
                            "type": "postback",
                            "title": "¿Dónde veo testimonios?",
                            "payload": "PRUEBA"
                        },
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    }
    /*     const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "\u{2753} Preguntas Frecuentes\n\n",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "¿Qué es el glutation?",
                            "payload": "PRUEBA1"
                        },
                        {
                            "type": "postback",
                            "title": "¿Llevan a domicilio?",
                            "payload": "PRUEBA2"
                        },
                        {
                            "type": "postback",
                            "title": "¿Dónde veo testimonios?",
                            "payload": "PRUEBA3"
                        },
                        {
                            "type": "postback",
                            "title": "Volver",
                            "payload": "VOLVER"
                        }                        
                    ]
                }
            }
        }
    } */
    senderActions(senderId);
    callSendApi(messageData);    
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
    axios.post('https://graph.facebook.com/v16.0/me/messages/', response, {
      params: {
        access_token: access_token
      }
    })
    .then(() => {
      console.log('Mensaje enviado');
    })
    .catch((error) => {
      console.error('Ocurrió un error', error);
    });
  }

/* function callSendApi(response) {
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
} */



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
