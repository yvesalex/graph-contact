**********************************************
            * App description *
**********************************************
Simple Contacts Manager

@Year: 2019

@Version: 1.0.0
**********************************************

# install dependencies, according to package.json:
`npm install express graphql graphiql express-graphql`

`npm install graphql-depth-limit graphql-iso-date graphql-validation-complexity` 

`npm install jsonwebtoken mongoose cors`

# If you're on windows, you will need to open Command Line under Administrator's role and execute these commands:
`npm install --global --production windows-build-tools`

`npm install bcrypt`

I use reference where I can create an object in real life in a seperate screen from the parent object. For instance, in an application where I can create product seperately from categories, I will add a'categoryId' field in product.

Here, I prefer to embed documents and give up on normalization, as i don't want to create email or phone seperately from user or contact. Here are the code for user and email, for instance:

`const UserSchema = new Schema({
    firstname: String,
    lastname: String, 
    address: String, 
    birthdate: Date, 
    username: String,
    password: String,
    emails: [Email], 
    phones: [Phone], 
    contacts: [Contact]
}, {
    timestamps: true
});`

`const EmailSchema = new Schema({
    address: String,
    isDefault: Boolean
});`

