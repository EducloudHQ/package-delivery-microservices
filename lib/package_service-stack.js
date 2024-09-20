"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const events = require("aws-cdk-lib/aws-events");
const _dynamodb = require("aws-cdk-lib/aws-dynamodb");
const _target = require("aws-cdk-lib/aws-events-targets");
const iam = require("aws-cdk-lib/aws-iam");
class PackageServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Create our dynamodb table
        const packageTable = new _dynamodb.Table(this, "PackageTable", {
            tableName: "packageTable",
            partitionKey: {
                name: "PK",
                type: _dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: "SK",
                type: _dynamodb.AttributeType.STRING,
            },
            billingMode: _dynamodb.BillingMode.PAY_PER_REQUEST,
            stream: _dynamodb.StreamViewType.NEW_IMAGE,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        //create our API
        const api = new appsync.GraphqlApi(this, "PackageAPI", {
            name: "PackageAPI",
            definition: appsync.Definition.fromFile("./schema/schema.graphql"),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: appsync.AuthorizationType.IAM, // Additional IAM authorization
                    },
                ],
            },
            logConfig: {
                fieldLogLevel: appsync.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        api.addEnvironmentVariable("TABLE_NAME", packageTable.tableName);
        const eventBus = new events.EventBus(this, "PackageEventBus", {
            eventBusName: "PackageEventBus",
        });
        const packageDatasource = api.addDynamoDbDataSource("PackageDatasource", packageTable);
        const eventBridgeDs = api.addEventBridgeDataSource('EventBridge', eventBus);
        const noneDatasource = api.addNoneDataSource('NoneDataSource');
        const putEvent = new appsync.AppsyncFunction(this, 'PutEvent', {
            api: api,
            name: 'PutEvent',
            dataSource: eventBridgeDs,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset('./resolvers/package/putEvent.js'),
        });
        const createPackageFunction = new appsync.AppsyncFunction(this, "createPackageFunction", {
            api,
            name: "createPackageFunction",
            dataSource: packageDatasource,
            code: appsync.Code.fromAsset("./resolvers/package/createPackage.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const updatePackageFunction = new appsync.AppsyncFunction(this, "updatePackageFunction", {
            api,
            name: "updatePackageFunction",
            dataSource: packageDatasource,
            code: appsync.Code.fromAsset("./resolvers/package/updatePackage.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const assignPackageToDeliveryAgentFunction = new appsync.AppsyncFunction(this, "assignPackageToDeliveryAgentFunction", {
            api,
            dataSource: packageDatasource,
            name: "assignPackageToDeliveryAgentFunction",
            code: appsync.Code.fromAsset("./resolvers/package/assignPackageToDeliveryAgent.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const packageTimelapseFunction = new appsync.AppsyncFunction(this, "packageTimelapseFunction", {
            api,
            dataSource: packageDatasource,
            name: "packageTimelapseFunction",
            code: appsync.Code.fromAsset("./resolvers/package/packageTimelapse.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const packageDeliveredFunction = new appsync.AppsyncFunction(this, "packageDeliveredFunction", {
            api,
            dataSource: packageDatasource,
            name: "packageDeliveredFunction",
            code: appsync.Code.fromAsset("./resolvers/package/packageDelivered.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const getPackageFunction = new appsync.AppsyncFunction(this, "getPackageFunction", {
            api,
            dataSource: packageDatasource,
            name: "getPackageFunction",
            code: appsync.Code.fromAsset("./resolvers/package/getPackage.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const getAllPackagesFunction = new appsync.AppsyncFunction(this, "getAllPackagesFunction", {
            api,
            dataSource: packageDatasource,
            name: "getAllPackagesFunction",
            code: appsync.Code.fromAsset("./resolvers/package/getAllPackages.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const getAllPackagesBaseOnStatusFunction = new appsync.AppsyncFunction(this, "getAllPackagesBaseOnStatusFunction", {
            api,
            dataSource: packageDatasource,
            name: "getAllPackagesBaseOnStatusFunction",
            code: appsync.Code.fromAsset("./resolvers/package/getAllPackagesBaseOnStatus.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        const getCurrentPackageMovementFunction = new appsync.AppsyncFunction(this, "getCurrentPackageMovementFunction", {
            api,
            dataSource: packageDatasource,
            name: "getCurrentPackageMovementFunction",
            code: appsync.Code.fromAsset("./resolvers/package/getCurrentPackageMovement.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
        });
        new appsync.Resolver(this, "createPackagePipelineResolver", {
            api,
            typeName: "Mutation",
            fieldName: "createPackage",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [createPackageFunction, putEvent],
        });
        new appsync.Resolver(this, "updatePackagePipelineResolver", {
            api,
            typeName: "Mutation",
            fieldName: "updatePackage",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [updatePackageFunction, putEvent],
        });
        new appsync.Resolver(this, "assignPackageToDeliveryPipelineResolver", {
            api,
            typeName: "Mutation",
            fieldName: "assignPackageToDeliveryAgent",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [assignPackageToDeliveryAgentFunction, putEvent],
        });
        new appsync.Resolver(this, "packageTimelapseResolver", {
            api,
            typeName: "Mutation",
            fieldName: "packageTimelapse",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [packageTimelapseFunction],
        });
        new appsync.Resolver(this, "packageDeliveredResolver", {
            api,
            typeName: "Mutation",
            fieldName: "packageDelivered",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [packageDeliveredFunction],
        });
        new appsync.Resolver(this, "getPackageResolver", {
            api,
            typeName: "Query",
            fieldName: "getPackage",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [getPackageFunction],
        });
        new appsync.Resolver(this, "getAllPackagesResolver", {
            api,
            typeName: "Query",
            fieldName: "getAllPackages",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [getAllPackagesFunction],
        });
        new appsync.Resolver(this, "getAllPackagesBaseOnStatusResolver", {
            api,
            typeName: "Query",
            fieldName: "getAllPackagesBaseOnStatus",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [getAllPackagesBaseOnStatusFunction],
        });
        new appsync.Resolver(this, "getCurrentPackageMovementResolver", {
            api,
            typeName: "Query",
            fieldName: "getCurrentPackageMovement",
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/pipeline/default.js"),
            pipelineConfig: [getCurrentPackageMovementFunction],
        });
        new appsync.Resolver(this, "onCreatePackageEvent", {
            api,
            typeName: "Subscription",
            fieldName: "onCreatePackageEventEnhanced",
            dataSource: noneDatasource,
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            code: appsync.Code.fromAsset("./resolvers/package/onCreatePackageEvent.js"),
        });
        /****************************************************************
         *      Event bridge rule
         */
        const rule = new events.Rule(this, "package-delivered", {
            eventBus: eventBus,
            eventPattern: {
                detailType: events.Match.exactString("package.delivered"),
                source: ["delivery.api"],
            },
        });
        /****************************************************************
         *      Event bridge rule target
         */
        rule.addTarget(new _target.AppSync(api, {
            graphQLOperation: 'mutation packageDelivered($packageId: String!){ packageDelivered(packageId: $packageId) }',
            variables: events.RuleTargetInput.fromObject({
                packageId: events.RuleTargetInput.fromEventPath('$.detailType'),
            }),
        }));
        const eventBridgeRole = new iam.Role(this, 'EventBridgeInvokeAppSyncRole', {
            assumedBy: new iam.ServicePrincipal('events.amazonaws.com'), // EventBridge will assume this role
        });
        eventBridgeRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [api.arn], // ARN of your AppSync API
        }));
        api.grantMutation(eventBridgeRole, 'packageDelivered');
        // const role = new iam.Role(this, 'AppSyncInvokerRole', {
        //   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        // });
        // api.grantMutation(role, 'packageDelivered');
        /****************************************************************
         *      Outputs
         */
        new cdk.CfnOutput(this, "appsync api key", {
            value: api.apiKey,
        });
        new cdk.CfnOutput(this, "appsync endpoint", {
            value: api.graphqlUrl,
        });
        new cdk.CfnOutput(this, "appsync apiId", {
            value: api.apiId,
        });
    }
}
exports.PackageServiceStack = PackageServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZV9zZXJ2aWNlLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFja2FnZV9zZXJ2aWNlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQyxtREFBbUQ7QUFDbkQsaURBQWlEO0FBQ2pELHNEQUFxRDtBQUVyRCwwREFBMEQ7QUFDMUQsMkNBQTJDO0FBRzNDLE1BQWEsbUJBQW9CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4Qiw0QkFBNEI7UUFFNUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDN0QsU0FBUyxFQUFFLGNBQWM7WUFDekIsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU07YUFDckM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNyQztZQUNELFdBQVcsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLGVBQWU7WUFDbEQsTUFBTSxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsU0FBUztZQUMxQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQUMsQ0FBQTtRQUVGLGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNyRCxJQUFJLEVBQUUsWUFBWTtZQUNsQixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUM7WUFDbEUs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Q0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO1lBQzVCLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSwwQkFBMEI7U0FDakQsQ0FBQyxDQUFDLENBQUM7UUFFSixHQUFHLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO1FBRXRELDBEQUEwRDtRQUMxRCxpRUFBaUU7UUFDakUsTUFBTTtRQUVOLCtDQUErQztRQUVuRDs7V0FFRztRQUNDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFPO1NBQ25CLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztTQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2VEQsa0RBdVRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWV2ZW50c1wiO1xuaW1wb3J0ICogYXMgX2R5bmFtb2RiIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIlxuaW1wb3J0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmltcG9ydCAqIGFzIF90YXJnZXQgZnJvbSBcImF3cy1jZGstbGliL2F3cy1ldmVudHMtdGFyZ2V0c1wiO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5cblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIENyZWF0ZSBvdXIgZHluYW1vZGIgdGFibGVcblxuICAgIGNvbnN0IHBhY2thZ2VUYWJsZSA9IG5ldyBfZHluYW1vZGIuVGFibGUodGhpcywgXCJQYWNrYWdlVGFibGVcIiwge1xuICAgICAgdGFibGVOYW1lOiBcInBhY2thZ2VUYWJsZVwiLFxuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6IFwiUEtcIixcbiAgICAgICAgdHlwZTogX2R5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICAgICAgfSxcbiAgICAgIHNvcnRLZXk6IHtcbiAgICAgICAgbmFtZTogXCJTS1wiLFxuICAgICAgICB0eXBlOiBfZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICB9LFxuICAgICAgYmlsbGluZ01vZGU6IF9keW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgICBzdHJlYW06IF9keW5hbW9kYi5TdHJlYW1WaWV3VHlwZS5ORVdfSU1BR0UsXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pXG5cbiAgICAvL2NyZWF0ZSBvdXIgQVBJXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCBcIlBhY2thZ2VBUElcIiwge1xuICAgICAgbmFtZTogXCJQYWNrYWdlQVBJXCIsXG4gICAgICBkZWZpbml0aW9uOiBhcHBzeW5jLkRlZmluaXRpb24uZnJvbUZpbGUoXCIuL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbFwiKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNLCAgICAvLyBBZGRpdGlvbmFsIElBTSBhdXRob3JpemF0aW9uXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBsb2dDb25maWc6IHtcbiAgICAgICAgZmllbGRMb2dMZXZlbDogYXBwc3luYy5GaWVsZExvZ0xldmVsLkFMTCxcbiAgICAgIH0sXG4gICAgICB4cmF5RW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGFwaS5hZGRFbnZpcm9ubWVudFZhcmlhYmxlKFwiVEFCTEVfTkFNRVwiLCBwYWNrYWdlVGFibGUudGFibGVOYW1lKTtcblxuICAgIGNvbnN0IGV2ZW50QnVzID0gbmV3IGV2ZW50cy5FdmVudEJ1cyh0aGlzLCBcIlBhY2thZ2VFdmVudEJ1c1wiLCB7XG4gICAgICBldmVudEJ1c05hbWU6IFwiUGFja2FnZUV2ZW50QnVzXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwYWNrYWdlRGF0YXNvdXJjZSA9IGFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoXCJQYWNrYWdlRGF0YXNvdXJjZVwiLCBwYWNrYWdlVGFibGUpXG4gICAgY29uc3QgZXZlbnRCcmlkZ2VEcyA9IGFwaS5hZGRFdmVudEJyaWRnZURhdGFTb3VyY2UoJ0V2ZW50QnJpZGdlJywgZXZlbnRCdXMpO1xuICAgIGNvbnN0IG5vbmVEYXRhc291cmNlID0gYXBpLmFkZE5vbmVEYXRhU291cmNlKCdOb25lRGF0YVNvdXJjZScpO1xuXG4gICAgY29uc3QgcHV0RXZlbnQgPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgJ1B1dEV2ZW50Jywge1xuICAgICAgYXBpOiBhcGksXG4gICAgICBuYW1lOiAnUHV0RXZlbnQnLFxuICAgICAgZGF0YVNvdXJjZTogZXZlbnRCcmlkZ2VEcyxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldCgnLi9yZXNvbHZlcnMvcGFja2FnZS9wdXRFdmVudC5qcycpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY3JlYXRlUGFja2FnZUZ1bmN0aW9uID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsIFwiY3JlYXRlUGFja2FnZUZ1bmN0aW9uXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIG5hbWU6IFwiY3JlYXRlUGFja2FnZUZ1bmN0aW9uXCIsXG4gICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL2NyZWF0ZVBhY2thZ2UuanNcIiksXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVwZGF0ZVBhY2thZ2VGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbih0aGlzLCBcInVwZGF0ZVBhY2thZ2VGdW5jdGlvblwiLCB7XG4gICAgICBhcGksXG4gICAgICBuYW1lOiBcInVwZGF0ZVBhY2thZ2VGdW5jdGlvblwiLFxuICAgICAgZGF0YVNvdXJjZTogcGFja2FnZURhdGFzb3VyY2UsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGFja2FnZS91cGRhdGVQYWNrYWdlLmpzXCIpLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgfSk7XG5cblxuICAgIGNvbnN0IGFzc2lnblBhY2thZ2VUb0RlbGl2ZXJ5QWdlbnRGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImFzc2lnblBhY2thZ2VUb0RlbGl2ZXJ5QWdlbnRGdW5jdGlvblwiLFxuICAgICAge1xuICAgICAgICBhcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IHBhY2thZ2VEYXRhc291cmNlLFxuICAgICAgICBuYW1lOiBcImFzc2lnblBhY2thZ2VUb0RlbGl2ZXJ5QWdlbnRGdW5jdGlvblwiLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFxuICAgICAgICAgIFwiLi9yZXNvbHZlcnMvcGFja2FnZS9hc3NpZ25QYWNrYWdlVG9EZWxpdmVyeUFnZW50LmpzXCJcbiAgICAgICAgKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IHBhY2thZ2VUaW1lbGFwc2VGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcInBhY2thZ2VUaW1lbGFwc2VGdW5jdGlvblwiLFxuICAgICAge1xuICAgICAgICBhcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IHBhY2thZ2VEYXRhc291cmNlLFxuICAgICAgICBuYW1lOiBcInBhY2thZ2VUaW1lbGFwc2VGdW5jdGlvblwiLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGFja2FnZS9wYWNrYWdlVGltZWxhcHNlLmpzXCIpLFxuICAgICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgcGFja2FnZURlbGl2ZXJlZEZ1bmN0aW9uID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwicGFja2FnZURlbGl2ZXJlZEZ1bmN0aW9uXCIsXG4gICAgICB7XG4gICAgICAgIGFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogcGFja2FnZURhdGFzb3VyY2UsXG4gICAgICAgIG5hbWU6IFwicGFja2FnZURlbGl2ZXJlZEZ1bmN0aW9uXCIsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL3BhY2thZ2VEZWxpdmVyZWQuanNcIiksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBnZXRQYWNrYWdlRnVuY3Rpb24gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJnZXRQYWNrYWdlRnVuY3Rpb25cIixcbiAgICAgIHtcbiAgICAgICAgYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgICAgbmFtZTogXCJnZXRQYWNrYWdlRnVuY3Rpb25cIixcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BhY2thZ2UvZ2V0UGFja2FnZS5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGdldEFsbFBhY2thZ2VzRnVuY3Rpb24gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJnZXRBbGxQYWNrYWdlc0Z1bmN0aW9uXCIsXG4gICAgICB7XG4gICAgICAgIGFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogcGFja2FnZURhdGFzb3VyY2UsXG4gICAgICAgIG5hbWU6IFwiZ2V0QWxsUGFja2FnZXNGdW5jdGlvblwiLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGFja2FnZS9nZXRBbGxQYWNrYWdlcy5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuXG4gICAgY29uc3QgZ2V0QWxsUGFja2FnZXNCYXNlT25TdGF0dXNGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImdldEFsbFBhY2thZ2VzQmFzZU9uU3RhdHVzRnVuY3Rpb25cIixcbiAgICAgIHtcbiAgICAgICAgYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgICAgbmFtZTogXCJnZXRBbGxQYWNrYWdlc0Jhc2VPblN0YXR1c0Z1bmN0aW9uXCIsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL2dldEFsbFBhY2thZ2VzQmFzZU9uU3RhdHVzLmpzXCIpLFxuICAgICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgZ2V0Q3VycmVudFBhY2thZ2VNb3ZlbWVudEZ1bmN0aW9uID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiZ2V0Q3VycmVudFBhY2thZ2VNb3ZlbWVudEZ1bmN0aW9uXCIsXG4gICAgICB7XG4gICAgICAgIGFwaSxcbiAgICAgICAgZGF0YVNvdXJjZTogcGFja2FnZURhdGFzb3VyY2UsXG4gICAgICAgIG5hbWU6IFwiZ2V0Q3VycmVudFBhY2thZ2VNb3ZlbWVudEZ1bmN0aW9uXCIsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL2dldEN1cnJlbnRQYWNrYWdlTW92ZW1lbnQuanNcIiksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cblxuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJjcmVhdGVQYWNrYWdlUGlwZWxpbmVSZXNvbHZlclwiLCB7XG4gICAgICBhcGksXG4gICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgZmllbGROYW1lOiBcImNyZWF0ZVBhY2thZ2VcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW2NyZWF0ZVBhY2thZ2VGdW5jdGlvbiwgcHV0RXZlbnRdLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJ1cGRhdGVQYWNrYWdlUGlwZWxpbmVSZXNvbHZlclwiLCB7XG4gICAgICBhcGksXG4gICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgZmllbGROYW1lOiBcInVwZGF0ZVBhY2thZ2VcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW3VwZGF0ZVBhY2thZ2VGdW5jdGlvbiwgcHV0RXZlbnRdLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJhc3NpZ25QYWNrYWdlVG9EZWxpdmVyeVBpcGVsaW5lUmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJhc3NpZ25QYWNrYWdlVG9EZWxpdmVyeUFnZW50XCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9waXBlbGluZS9kZWZhdWx0LmpzXCIpLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFthc3NpZ25QYWNrYWdlVG9EZWxpdmVyeUFnZW50RnVuY3Rpb24sIHB1dEV2ZW50XSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwicGFja2FnZVRpbWVsYXBzZVJlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwicGFja2FnZVRpbWVsYXBzZVwiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcGFja2FnZVRpbWVsYXBzZUZ1bmN0aW9uXSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwicGFja2FnZURlbGl2ZXJlZFJlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwicGFja2FnZURlbGl2ZXJlZFwiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbcGFja2FnZURlbGl2ZXJlZEZ1bmN0aW9uXSxcbiAgICB9KTtcblxuICAgIG5ldyBhcHBzeW5jLlJlc29sdmVyKHRoaXMsIFwiZ2V0UGFja2FnZVJlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZ2V0UGFja2FnZVwiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbZ2V0UGFja2FnZUZ1bmN0aW9uXSxcbiAgICB9KTtcblxuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJnZXRBbGxQYWNrYWdlc1Jlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZ2V0QWxsUGFja2FnZXNcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW2dldEFsbFBhY2thZ2VzRnVuY3Rpb25dLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJnZXRBbGxQYWNrYWdlc0Jhc2VPblN0YXR1c1Jlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZ2V0QWxsUGFja2FnZXNCYXNlT25TdGF0dXNcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW2dldEFsbFBhY2thZ2VzQmFzZU9uU3RhdHVzRnVuY3Rpb25dLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJnZXRDdXJyZW50UGFja2FnZU1vdmVtZW50UmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRDdXJyZW50UGFja2FnZU1vdmVtZW50XCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9waXBlbGluZS9kZWZhdWx0LmpzXCIpLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFtnZXRDdXJyZW50UGFja2FnZU1vdmVtZW50RnVuY3Rpb25dLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJvbkNyZWF0ZVBhY2thZ2VFdmVudFwiLCB7XG4gICAgICBhcGksXG4gICAgICB0eXBlTmFtZTogXCJTdWJzY3JpcHRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJvbkNyZWF0ZVBhY2thZ2VFdmVudEVuaGFuY2VkXCIsXG4gICAgICBkYXRhU291cmNlOiBub25lRGF0YXNvdXJjZSxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BhY2thZ2Uvb25DcmVhdGVQYWNrYWdlRXZlbnQuanNcIiksXG4gICAgfSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgICAgIEV2ZW50IGJyaWRnZSBydWxlXG4gKi9cbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHRoaXMsIFwicGFja2FnZS1kZWxpdmVyZWRcIiwge1xuICAgICAgZXZlbnRCdXM6IGV2ZW50QnVzLFxuICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgIGRldGFpbFR5cGU6IGV2ZW50cy5NYXRjaC5leGFjdFN0cmluZyhcInBhY2thZ2UuZGVsaXZlcmVkXCIpLFxuICAgICAgICBzb3VyY2U6IFtcImRlbGl2ZXJ5LmFwaVwiXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgICAgIEV2ZW50IGJyaWRnZSBydWxlIHRhcmdldFxuICovXG4gICAgcnVsZS5hZGRUYXJnZXQobmV3IF90YXJnZXQuQXBwU3luYyhhcGksIHtcbiAgICAgIGdyYXBoUUxPcGVyYXRpb246ICdtdXRhdGlvbiBwYWNrYWdlRGVsaXZlcmVkKCRwYWNrYWdlSWQ6IFN0cmluZyEpeyBwYWNrYWdlRGVsaXZlcmVkKHBhY2thZ2VJZDogJHBhY2thZ2VJZCkgfScsXG4gICAgICB2YXJpYWJsZXM6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICAgIHBhY2thZ2VJZDogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dC5mcm9tRXZlbnRQYXRoKCckLmRldGFpbFR5cGUnKSxcbiAgICAgIH0pLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IGV2ZW50QnJpZGdlUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnRXZlbnRCcmlkZ2VJbnZva2VBcHBTeW5jUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdldmVudHMuYW1hem9uYXdzLmNvbScpLCAvLyBFdmVudEJyaWRnZSB3aWxsIGFzc3VtZSB0aGlzIHJvbGVcbiAgICB9KTtcblxuICAgIGV2ZW50QnJpZGdlUm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbJ2FwcHN5bmM6R3JhcGhRTCddLFxuICAgICAgcmVzb3VyY2VzOiBbYXBpLmFybl0sIC8vIEFSTiBvZiB5b3VyIEFwcFN5bmMgQVBJXG4gICAgfSkpO1xuXG4gICAgYXBpLmdyYW50TXV0YXRpb24oZXZlbnRCcmlkZ2VSb2xlLCAncGFja2FnZURlbGl2ZXJlZCcpXG5cbiAgICAvLyBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBcHBTeW5jSW52b2tlclJvbGUnLCB7XG4gICAgLy8gICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAvLyB9KTtcbiAgICBcbiAgICAvLyBhcGkuZ3JhbnRNdXRhdGlvbihyb2xlLCAncGFja2FnZURlbGl2ZXJlZCcpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogICAgICBPdXRwdXRzXG4gKi9cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcImFwcHN5bmMgYXBpIGtleVwiLCB7XG4gICAgICB2YWx1ZTogYXBpLmFwaUtleSEsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcImFwcHN5bmMgZW5kcG9pbnRcIiwge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJhcHBzeW5jIGFwaUlkXCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpSWQsXG4gICAgfSk7XG4gIH1cbn0iXX0=