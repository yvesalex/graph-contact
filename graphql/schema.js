const graphql = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const bcrypt = require('bcrypt');
const joiSchema = require('./joiSchema');
const authService = require('../services/auth');
const permissionService = require('../services/permissions');
const ERR = require('../utils/errors');
const { SALT_ROUNDS } = require('../.config');
const Company = require('../models/company');

const {
    SessionExpiredError,
    InvalidInputError,
    InvalidTokenError,
    UnauthorizedAccessError
} = ERR;

// define GraphQL types
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList
} = graphql;

// define Company type
const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: {
            type: GraphQLID,
            description: "Unique ID of each Company"
        },
        name: {
            type: GraphQLString,
            required: true
        },
        website: {
            type: GraphQLString
        },
        urlLogo: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString,
            unique: true,
            required: true
        },
        phone: {
            type: GraphQLString,
            unique: true,
            required: true
        },
        address: {
            type: GraphQLString,
            required: true
        },
        roles: {
            type: new GraphQLList(RoleType),
            resolve(parent, args) {
                return Role.find({
                    companyId: parent.id
                });
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find({
                    companyId: parent.id
                });
            }
        },
        taxes: {
            type: new GraphQLList(TaxType),
            resolve(parent, args) {
                return Tax.find({
                    companyId: parent.id
                });
            }
        },
        units: {
            type: new GraphQLList(UnitType),
            resolve(parent, args) {
                return Unit.find({
                    companyId: parent.id
                });
            }
        }
    })
});


// define Currency type
const CurrencyType = new GraphQLObjectType({
    name: "Currency",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        symbol: {
            type: GraphQLString,
            unique: true,
            required: true
        },
        shortname: {
            type: GraphQLString,
            unique: true,
            required: true
        },
        description: {
            type: GraphQLString,
            unique: true,
            required: true
        },
        company: {
            type: CompanyType,
            resolve(parent, args) {
                return Company.findById(parent.companyId);
            }
        }
    })
});

// define rootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        company: {
            type: CompanyType,
            args: {
                id: {
                    type: GraphQLID
                },
                name:{
                    type:GraphQLString
                },
                email:{
                    type:GraphQLString
                },
                phone:{
                    type:GraphQLString
                },
                website:{
                    type:GraphQLString
                }
            },
            resolve(parent, args) {
                if(args.id)
                    return Company.findById(args.id);
                return Company.findOne(args);
            }
        },
        currency: {
            type: CurrencyType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                if(args.id)
                    return Currency.findById(args.id);
                return Currency.findOne(args);
            }
        },
        role: {
            type: RoleType,
            args: {
                id: {
                    type: GraphQLID
                },
                name: {
                    type: GraphQLString
                },
                description:{
                    type:GraphQLString
                }
            },
            resolve(parent, args) {
                if(args.id)
                    return Role.findById(args.id);
                return Role.findOne(args);
            }
        },
        loginQuery: {
            type: LoginType,
            args: {
                username: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString,
                    required: true
                },
            },
            async resolve(parent, args) {
                return authService.login(args);
            }
        },
        resumeQuery:{
            type: LoginType,
            args: {
                pin: {
                    type: GraphQLString,
                    required: true
                }
            }, 
            resolve(parent, args) {
                return authService.pin(args);
            }
        },
        refreshTokenQuery:{
            type: LoginType,
            args: {
                token: {
                    type: GraphQLString,
                    required: true
                }
            }, 
            resolve(parent, args) {
                return authService.refreshToken(args);
            }
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                },
                firstname:{
                    type:GraphQLString
                },
                lastname:{
                    type:GraphQLString
                },
                username:{
                    type:GraphQLString
                },
                email:{
                    type:GraphQLString
                },
                phone:{
                    type:GraphQLString
                },
                address:{
                    type:GraphQLString
                },
            },
            resolve(parent, args) {
                if(args.id)
                    return User.findById(args.id);
                return User.findOne(args);
            }
        },
        client: {
            type: ClientType,
            args: {
                id: {
                    type: GraphQLID
                },
                firstname:{
                    type:GraphQLString
                },
                lastname:{
                    type:GraphQLString
                },
                email:{
                    type:GraphQLString
                },
                phone:{
                    type:GraphQLString
                }
            },
            resolve(parent, args) {
                if(args.id)
                    return Client.findById(args.id);
                return Client.findOne(args);
            }
        },
        tax: {
            type: TaxType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Tax.findById(args.id);
            }
        },
        unit: {
            type: UnitType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Unit.findById(args.id);
            }
        },
        product: {
            type: ProductType,
            args: {
                id: {
                    type: GraphQLID
                },
                name:{
                    type:GraphQLString
                },
                description:{
                    type:GraphQLString
                }
            },
            resolve(parent, args) {
                if(args.id)
                    return Product.findById(args.id);
                return Product.findOne(args)                  
            }
        },
        category: {
            type: CategoryType,
            args: {
                id: {
                    type: GraphQLID
                },
                name:{
                    type:GraphQLString
                }
            },
            resolve(parent, args) {
                if(args.id)
                    return Category.findById(args.id);
                return Category.findOne(args);
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve() {
               return Company.find({});
            }
        },
        roles: {
            type: new GraphQLList(RoleType),
            resolve() {
               return Role.find({});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve() {
               return User.find({});
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve() {
               return Client.find({});
            }
        },
        taxes: {
            type: new GraphQLList(TaxType),
            resolve() {
               return Tax.find({});
            }
        },
        units: {
            type: new GraphQLList(UnitType),
            resolve() {
               return Unit.find({});
            }
        },
        currencies: {
            type: new GraphQLList(CurrencyType),
            resolve() {
               return Currency.find({});
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args, context) {
                console.log('context: ' + context.headers)
               return Product.find({});
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve() {
                return Category.find({});
            }
        }
    }
});

/*********************
*
* define mutation
*
*********************/
const resume = {
    type: LoginType,
    args: {
        pin: {
            type: GraphQLString,
            required: true
        }
    }, 
    resolve(parent, args) {
        return authService.pin(args);
    }
};

const refreshToken = {
    type: LoginType,
    args: {
        token: {
            type: GraphQLString,
            required: true
        }
    }, 
    resolve(parent, args) {
        return authService.refreshToken(args);
    }
};

const login = {
    type: LoginType,
    args: {
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString,
            required: true
        },
    },
    async resolve(parent, args) {
        return authService.login(args);
    }
};

const addCompany = {
    type: CompanyType,
    args: {
        name: {
            type: GraphQLString
        },
        website: {
            type: GraphQLString
        },
        urlLogo: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        address: {
            type: GraphQLString
        }
    },
    resolve(parent, args) {
        let obj = new Company({
            name: args.name,
            website: args.website,
            urlLogo: args.urlLogo,
            email: args.email,
            phone: args.phone,
            address: args.address
        });
        return obj.save();
    }
};

const addRole = {
    type: RoleType,
    args: {
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        companyId: {
            type: GraphQLID
        }
    },
    resolve(parent, args) {
        let obj = new Role({
            name: args.name,
            description: args.description,
            companyId: args.companyId
        });
        return obj.save();
    }
};


const addUser = {
    type: UserType,
    args: {
        firstname: {
            type: GraphQLString,
            required: true
        },
        lastname: {
            type: GraphQLString,
            required: true
        },
        address: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        birthdate: {
            type: GraphQLDate
        },
        username: {
            type: GraphQLString
        },
        pin: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        roleId: {
            type: GraphQLID
        }
    },
    async resolve(parent, args) {
        let r = await authService.usernameAvailable(args.username);
        if(r == undefined){
            let obj = new User({
                firstname: args.firstname,
                lastname: args.lastname,
                address: args.address,
                email: args.email,
                phone: args.phone,
                birthdate: args.birthdate,
                username: args.username,
                pin: args.pin,
                password: bcrypt.hashSync(args.password, SALT_ROUNDS),
                roleId: args.roleId
            });
            return obj.save();
        }
        throw new InvalidInputError('Username alredy in use...');    
    }
};


const updateCompany = {
    type: CompanyType,
    args: {
        name: {
            type: GraphQLString
        },
        website: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        address: {
            type: GraphQLString
        },
        urlLogo: {
            type: GraphQLString
        },
        id: {
            type: GraphQLID
        }
    },
    async resolve(parent, args) {
        let objTemp = await Role.findById(args.id);
        if (args.name !== undefined) objTemp.name = args.name;
        if (args.description !== undefined) objTemp.description = args.description;
        if (args.website !== undefined) objTemp.website = args.website;
        if (args.email !== undefined) objTemp.email = args.email;
        if (args.address !== undefined) objTemp.address = args.address;
        if (args.phone !== undefined) objTemp.phone = args.phone;
        if (args.urlLogo !== undefined) objTemp.urlLogo = args.urlLogo;
        if (args.companyId !== undefined) objTemp.companyId = args.companyId;

        let obj = await Role.findByIdAndUpdate(args.id, objTemp, {
            new: true
        })
        return obj;    
    }
};

const updateUser = {
    type: UserType,
    args: {
        firstname: {
            type: GraphQLString
        },
        lastname: {
            type: GraphQLString
        },
        address: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        birthdate: {
            type: GraphQLDate
        },
        username: {
            type: GraphQLString
        },
        pin: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        id: {
            type: GraphQLID
        },
        roleId: {
            type: GraphQLID
        }
    },
    async resolve(parent, args) {
        await joiSchema.joiUser.validate(args);    
        let objTemp = await User.findById(args.id);
        let hasRight = permissionService.hasRight(objTemp.roleId, 'updateUser');
        if(hasRight){
            let r = await authService.usernameAvailable(args.username);
            if(r == undefined || r.userId == objTemp.id){
                if (args.firstname !== undefined) objTemp.firstname = args.firstname;
                if (args.lastname !== undefined) objTemp.lastname = args.lastname;
                if (args.username !== undefined) objTemp.username = args.username;
                if (args.password !== undefined) objTemp.password = bcrypt.hashSync(args.password, SALT_ROUNDS);
                if (args.pin !== undefined) objTemp.pin = args.pin;
                if (args.email !== undefined) objTemp.email = args.email;
                if (args.address !== undefined) objTemp.address = args.address;
                if (args.phone !== undefined) objTemp.phone = args.phone;
                if (args.birthdate !== undefined) objTemp.birthdate = args.birthdate;
                if (args.roleId !== undefined) objTemp.roleId = args.roleId;
        
                let obj = await User.findByIdAndUpdate(args.id, objTemp, { new: true })
                return obj;
            }
            throw new InvalidInputError('Username alredy in use...');
        }
        else throw new UnauthorizedAccessError('Access denied...');
    }
};


const deleteCompany = {
    type: CompanyType,
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args) {
        let obj = Company.findByIdAndDelete(args.id)
        return obj;
    }
};


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login, resume, refreshToken,
        addCompany, addRole, addUser, addClient, addCurrency, addTax, addUnit, addCategory, addProduct,
        updateCompany, updateRole, updateUser, updateClient, updateCurrency, updateTax, updateUnit, updateCategory, updateProduct,
        deleteCompany, deleteRole, deleteUser, deleteClient, deleteCurrency, deleteTax, deleteUnit, deleteCategory, deleteProduct
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
    subscription: Subscription
})