import moongose from "mongoose"
import paginate from "mongoose-paginate-v2"



const productsCollection = 'products'

const strTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    require: true

}

const strTypeSchemaRequired = {
    type: String,
    require: true
}

const numberTypeSchemaRequired = {
    type: Number,
    require: true
}

const productsSchema = new moongose.Schema({
    title: strTypeSchemaRequired,
    description: strTypeSchemaRequired,
    code: strTypeSchemaUniqueRequired,
    status: Boolean,
    price: numberTypeSchemaRequired,
    stock: numberTypeSchemaRequired,
    category: strTypeSchemaRequired,
    thumbanail: strTypeSchemaRequired
})

productsSchema.plugin(paginate)

export const productsModel = moongose.model(productsCollection, productsSchema);
