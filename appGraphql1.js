const graphql = require('graphql');
const express = require('express');
const db = require('./db.js');

const app = express();

// 数据模型和查询接口模型
let schema = graphql.buildSchema(`
    type UserType {
        id: String
        username: String
        age: Int
    }
    type Query {
        user(id: String!): UserType
        now: String
        
    }
`);


// 所有字段的解析方法
let root = {
    user: (args, context, info) => {
        return db.findById(args.id);
    },
    now: (args, context, info) => {
        return new Date().toLocaleString();
    }
};


// 路由
app.use('/graphqlAPI', (req, res) => {
    let reqJson = '';
    req.on('data', (data) => reqJson += data);
    req.on('end', () => {
        reqJson = JSON.parse(reqJson);
        graphql.graphql(schema, reqJson.query, root).then((result) => {
            res.send(result);
        });
    })
});

app.listen(80, () => { console.log('listen on 80.'); });