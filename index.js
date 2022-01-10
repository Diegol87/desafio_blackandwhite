const yargs = require('yargs')
const http = require('http')
const fs = require('fs')
const Jimp = require('jimp')
const url = require('url')

const pass = 123

// Para poder levantar el servidor se debe colocar "node index.js serverOn -k=123"

const argv = yargs
    .command(
        'serverOn',
        'command to server up',
        {
            key: {
                describe: 'password to server up',
                demand: true,
                alias: 'k',
            },
        },

        ({key}) => {
            if(key === pass) {
                http
                    .createServer((req, res) => {
                       res.writeHead(200, { 'Content-Type' : 'text/html' })

                        if(req.url === '/') {
                            res.writeHead(200, { 'Content-Type' : 'text/html;charset'})
                            fs.readFile('index.html', 'utf8', (err, html) => {
                                res.end(html)
                            })
                        }

                        if(req.url === '/estilos') {
                            res.writeHead(200, { 'Content-Type' : 'text/css' })
                            fs.readFile('style.css', (err, css) => {
                                res.end(css)
                            })
                        }

                        //para hacer la prueba se puede ingresar las siguiente url en el formulario "https://image.freepik.com/foto-gratis/manos-escribiendo-teclado-portatil-moderno_488220-23531.jpg"

                        if(req.url.includes('blackandwhite')) {
                            const params = url.parse(req.url, true).query
                            const img = params.img

                            Jimp.read(img, (err, foto) => {

                                foto
                                    .greyscale()
                                    .quality(60)
                                    .resize(350, Jimp.AUTO)
                                    .writeAsync('newImg.jpg')
                                    .then(() => {
                                        fs.readFile('newImg.jpg', (err, imagen) => {
                                            res.writeHead(200, { 'Content-Type' : 'image/jpeg' })
                                            res.end(imagen)     
                                        })
                                    })
                            })
                        }
                    })
                    .listen(8080, () => {
                        console.log('server ON')
                    })
            } else {
                console.log('La clave es incorrecta')
            }
        }
    )
    .help().argv