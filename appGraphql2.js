const graphql = require('graphql');
const express = require('express');
const db = require('./db.js');

const app = express();

// 数据模型和查询接口模型
let UserType = new graphql.GraphQLObjectType({
    name: 'UserType',
    fields: {
        id: {
            type: graphql.GraphQLString,
            resolve: (source, args, context, info) => {
                return source.id;
            },
        },
        username: {
            type: graphql.GraphQLString,
            resolve: (source, args, context, info) => {
                return source.username;
            }
        },
        age: {
            type: graphql.GraphQLInt,
            resolve: (source, args, context, info) => {
                return source.age;
            }
        },
    }
});

let schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'queryType',
        fields: {
            user: {
                type: UserType,
                args: {
                    id: {
                        type: graphql.GraphQLString,
                        defaultValue: '1001'
                    },
                },
                resolve: (source, args, context, info) => {
                    console.log(source, args, context, info);
                    return db.findById(args.id);
                }
            },
            now: {
                type: graphql.GraphQLString,
                resolve: (source, args, context, info) => {

                    return new Date().toLocaleString();
                }
            }
        }
    }),
});


// 路由
app.use('/graphqlAPI', (req, res) => {
    let reqJson = '';
    req.on('data', (data) => reqJson += data);
    req.on('end', () => {
        reqJson = JSON.parse(reqJson);
        graphql.graphql(schema, reqJson.query).then((result) => {
            res.send(result);
        });
    })
});

app.listen(80, () => { console.log('listen on 80.'); });