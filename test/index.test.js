import { expect } from "chai"
import supertest from "supertest"

import { faker } from "@faker-js/faker"

const SPECIAL_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJsbCBsbCIsImVtYWlsIjoibGxAbGwuY2wiLCJhZ2UiOjEyMywicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxODQyMjYwMSwiZXhwIjoxNzQ5OTU4NjAxfQ.oFf6QAEumLaja7itcnk4RlNH7LDhCcHvLe0O6ltnZvs" // tiene duracion de un año
const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJiIGIiLCJlbWFpbCI6ImJAYi5jbCIsImFnZSI6MTIzLCJyb2xlIjoidXNlciJ9LCJpYXQiOjE3MTg1MDk2NTQsImV4cCI6MTc1MDA0NTY1NH0.Pn7_lJqoMVhyHlwViHHCvvAZ9SZFyJqY7dWqgmefvfY"

const expects = expect
const requester = supertest(`http://localhost:8080`)


describe(" Realizando pruebas al proyecto ", () => {



    // [[ PRODUCTOS ]]

    describe(" 1) Realizando las pruebas al api de PRODUCTS ", () => {

        let testProductID

        it("Crear producto en el metodo post de /api/products, este se debe de crear correctamnte", async () => {

            const postProdMock = {
                title: "Producto creado en Testing",
                description: "Descripcion del producto",
                price: "11495",
                stock: "55",
                category: "pruebas",
                thumbnail: "img/pruebas"
            }

            const { _body, statusCode } = await requester.post("/api/products").set('Authorization', `Bearer ${SPECIAL_TOKEN}`).send(postProdMock)



            expects(statusCode).is.eql(200)
            expects(_body).to.have.property('status').and.to.be.equal("success")
            expects(_body.payload).to.ok.and.to.have.property('_id')

            testProductID = _body.payload._id

        })

        it(" modificar el producto creado anteriormente, este debe de de indicar que se modifico correctamente ", async () => {

            const updateProdMock = {
                title: "Producto Modificado en Testing",
                description: "Descripcion del producto modificado",
                price: "13444",
                stock: "567",
                category: "modificado",
                thumbnail: "img/modificado"
            }

            const { text, statusCode } = await requester.put(`/api/products/${testProductID}`).set('Authorization', `Bearer ${SPECIAL_TOKEN}`).send(updateProdMock)

            expects(statusCode).is.eql(200)
            expects(text).to.be.eqls("producto modificado correctamente")

        })

        it("obtener usuario utilizando el id generado, tiene que retornar el listado del producto.", async () => {

            const { _body, statusCode } = await requester.get(`/api/products/${testProductID}`)


            expects(statusCode).is.eql(200)
            expects(_body).to.have.property('status').and.to.be.equal("success")
            expects(_body).to.have.property('payload')

            expects(_body.payload[0]).to.ok.and.to.have.property("_id").and.to.be.eql(testProductID)


        })


    })

    // [[ FIN PRODUCTOS ]]
    // -----
    // -----
    // [[ CARTS ]]

    describe(" 2) Realizando pruebas al api de CARTS ", () => {

        const cid = "65f89d8edd55cf2ff9ba4a5f"
        const pid = "6640438b2a9e8b573ea868f2"

        it(" buscar por _id un carrito ya creado, este debe de retornar el carrito  ", async () => {



            const { _body, statusCode } = await requester.get(`/api/carts/${cid}`)

            expects(statusCode).is.eql(200)
            expects(_body).to.have.property('status').and.to.be.equal("success")
            expects(_body).to.have.property('payload')
            expects(_body.payload[0]).to.ok.and.to.have.property("_id").and.to.be.eql(cid)

        })

        it("agregando productos al carrito, este debe de retornar que el producto fue agregado al carro ", async () => {

            const { _body, statusCode } = await requester.post(`/api/carts/${cid}/products/${pid}`).set('Authorization', `Bearer ${USER_TOKEN}`)

            expects(statusCode).is.eql(200)
            expects(_body).not.to.have.property('status')
            expects(_body).to.have.property("response")
            expects(_body.response).to.be.eql("producto agregado al carro")

        })

        it("aumentar la cantidad del producto +1, este debe de indicar que la cantidad fue actualizada", async () => {
            // el metodo post que que agrega un producto en el carro tambien actualiza la cantidad en el caso de que se intente agregar el mismo producto.
            // por lo que es probable que al revisar el carro se vea que se agregan + dos productos.

            const { text, statusCode } = await requester.put(`/api/carts/${cid}/products/${pid}`).set('Authorization', `Bearer ${USER_TOKEN}`)

            expects(statusCode).is.eql(200)
            expects(text).to.be.equal("cantidad actualizada")

        })


    })

    // [[ FIN CARTS ]]
    // -----
    // -----
    // [[ SESSIONS ]]

    describe(" 3) Realizando pruebas al api de SESSIONS ", () => {



        let testUserMock = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: "44",
            password: "passwordpruebas"
        }

        let uid = ""

        it("Creacion de un usuario de pruebas, debe de retornar que el usuario fue creado correctamente", async () => {

            // const result = await requester.post('/user/register').send(testUserMock)
            const { statusCode, _body, request } = await requester.post('/user/register').send(testUserMock)



            expects(statusCode).is.eql(200)
            expects(_body).to.have.property("status").and.to.be.equal("success")
            expects(_body).to.have.property("message").and.to.be.equal("usuario Creado")

            expects(request._data).to.have.property("first_name").and.not.to.equal("")
            expects(request._data).to.have.property("email").and.to.be.eqls(testUserMock.email)

        })

        it("inicio de sesion del usuario recien creado, debe de indicar que el inicio fue satisfactorio", async () => {

            let userLoginMock = {
                email: testUserMock.email,
                password: testUserMock.password
            }

            const { statusCode, _body, } = await requester.post('/user/login').send(userLoginMock)

            expects(statusCode).is.eqls(200)
            expects(_body).to.have.property("message").and.to.be.equal("inicio de sesion satisfactorio")
            expects(_body.token).not.to.be.empty
            expects(_body.token).not.to.be.NaN
            expects(_body.role).to.be.eqls("user")
            expects(_body.id).not.to.be.empty
            expects(_body.id).not.to.be.NaN

            uid = _body.id


        })

        it("Cambiar usuario con role de user a uno con rol premium", async () => {

            const { statusCode, _body } = await requester.get(`/api/user/premium/${uid}`)

            expects(statusCode).is.eqls(200)
            expects(_body).to.have.property("response").and.to.be.equal("Rol Cambiado satisfactoriamente")



        })

    })
})

