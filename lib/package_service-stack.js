"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const events = require("aws-cdk-lib/aws-events");
const _dynamodb = require("aws-cdk-lib/aws-dynamodb");
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
        // new appsync.Resolver(this, "onCreatePackageEvent", {
        //   api,
        //   typeName: "Subscription",
        //   fieldName: "onCreatePackageEvent",
        //   dataSource: new appsync.NoneDataSource(this, 'NoneDataSource', {
        //     api: api,
        //     name: 'onCreatePackageEvent',
        //   }),
        //   runtime: appsync.FunctionRuntime.JS_1_0_0,
        //   code: appsync.Code.fromAsset("./resolvers/package/onCreatePackageEvent.js"),
        // });
        //////////////////////////
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZV9zZXJ2aWNlLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFja2FnZV9zZXJ2aWNlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQyxtREFBbUQ7QUFDbkQsaURBQWlEO0FBQ2pELHNEQUFxRDtBQUlyRCxNQUFhLG1CQUFvQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsNEJBQTRCO1FBRTVCLE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU07YUFDckM7WUFDRCxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQ2xELE1BQU0sRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLFNBQVM7WUFDMUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUE7UUFFRixnQkFBZ0I7UUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDckQsSUFBSSxFQUFFLFlBQVk7WUFDbEIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDO1lBQ2xFLG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0Is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QUFHO1lBQ0gsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLDJCQUEyQjtZQUN0QyxPQUFPLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRO1lBQ3pDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQztZQUMvRCxjQUFjLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztTQUNwRCxDQUFDLENBQUM7UUFFSCx1REFBdUQ7UUFDdkQsU0FBUztRQUNULDhCQUE4QjtRQUM5Qix1Q0FBdUM7UUFDdkMscUVBQXFFO1FBQ3JFLGdCQUFnQjtRQUNoQixvQ0FBb0M7UUFDcEMsUUFBUTtRQUNSLCtDQUErQztRQUMvQyxpRkFBaUY7UUFDakYsTUFBTTtRQUdOLDBCQUEwQjtRQUMxQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTztTQUNuQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzFDLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVTtTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBeFBELGtEQXdQQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcHBzeW5jXCI7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1ldmVudHNcIjtcbmltcG9ydCAqIGFzIF9keW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCJcbmltcG9ydCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIENyZWF0ZSBvdXIgZHluYW1vZGIgdGFibGVcblxuICAgIGNvbnN0IHBhY2thZ2VUYWJsZSA9IG5ldyBfZHluYW1vZGIuVGFibGUodGhpcywgXCJQYWNrYWdlVGFibGVcIiwge1xuICAgICAgdGFibGVOYW1lOiBcInBhY2thZ2VUYWJsZVwiLFxuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6IFwiUEtcIixcbiAgICAgICAgdHlwZTogX2R5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICAgICAgfSxcbiAgICAgIHNvcnRLZXk6IHtcbiAgICAgICAgbmFtZTogXCJTS1wiLFxuICAgICAgICB0eXBlOiBfZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICB9LFxuICAgICAgYmlsbGluZ01vZGU6IF9keW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgICBzdHJlYW06IF9keW5hbW9kYi5TdHJlYW1WaWV3VHlwZS5ORVdfSU1BR0UsXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pXG5cbiAgICAvL2NyZWF0ZSBvdXIgQVBJXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCBcIlBhY2thZ2VBUElcIiwge1xuICAgICAgbmFtZTogXCJQYWNrYWdlQVBJXCIsXG4gICAgICBkZWZpbml0aW9uOiBhcHBzeW5jLkRlZmluaXRpb24uZnJvbUZpbGUoXCIuL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbFwiKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGxvZ0NvbmZpZzoge1xuICAgICAgICBmaWVsZExvZ0xldmVsOiBhcHBzeW5jLkZpZWxkTG9nTGV2ZWwuQUxMLFxuICAgICAgfSxcbiAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgYXBpLmFkZEVudmlyb25tZW50VmFyaWFibGUoXCJUQUJMRV9OQU1FXCIsIHBhY2thZ2VUYWJsZS50YWJsZU5hbWUpO1xuXG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgZXZlbnRzLkV2ZW50QnVzKHRoaXMsIFwiUGFja2FnZUV2ZW50QnVzXCIsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogXCJQYWNrYWdlRXZlbnRCdXNcIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhY2thZ2VEYXRhc291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcIlBhY2thZ2VEYXRhc291cmNlXCIsIHBhY2thZ2VUYWJsZSlcbiAgICBjb25zdCBldmVudEJyaWRnZURzID0gYXBpLmFkZEV2ZW50QnJpZGdlRGF0YVNvdXJjZSgnRXZlbnRCcmlkZ2UnLCBldmVudEJ1cyk7XG5cblxuICAgIGNvbnN0IHB1dEV2ZW50ID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKHRoaXMsICdQdXRFdmVudCcsIHtcbiAgICAgIGFwaTogYXBpLFxuICAgICAgbmFtZTogJ1B1dEV2ZW50JyxcbiAgICAgIGRhdGFTb3VyY2U6IGV2ZW50QnJpZGdlRHMsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoJy4vcmVzb2x2ZXJzL3BhY2thZ2UvcHV0RXZlbnQuanMnKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNyZWF0ZVBhY2thZ2VGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbih0aGlzLCBcImNyZWF0ZVBhY2thZ2VGdW5jdGlvblwiLCB7XG4gICAgICBhcGksXG4gICAgICBuYW1lOiBcImNyZWF0ZVBhY2thZ2VGdW5jdGlvblwiLFxuICAgICAgZGF0YVNvdXJjZTogcGFja2FnZURhdGFzb3VyY2UsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGFja2FnZS9jcmVhdGVQYWNrYWdlLmpzXCIpLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGRhdGVQYWNrYWdlRnVuY3Rpb24gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24odGhpcywgXCJ1cGRhdGVQYWNrYWdlRnVuY3Rpb25cIiwge1xuICAgICAgYXBpLFxuICAgICAgbmFtZTogXCJ1cGRhdGVQYWNrYWdlRnVuY3Rpb25cIixcbiAgICAgIGRhdGFTb3VyY2U6IHBhY2thZ2VEYXRhc291cmNlLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BhY2thZ2UvdXBkYXRlUGFja2FnZS5qc1wiKSxcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIH0pO1xuXG5cbiAgICBjb25zdCBhc3NpZ25QYWNrYWdlVG9EZWxpdmVyeUFnZW50RnVuY3Rpb24gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJhc3NpZ25QYWNrYWdlVG9EZWxpdmVyeUFnZW50RnVuY3Rpb25cIixcbiAgICAgIHtcbiAgICAgICAgYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgICAgbmFtZTogXCJhc3NpZ25QYWNrYWdlVG9EZWxpdmVyeUFnZW50RnVuY3Rpb25cIixcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcbiAgICAgICAgICBcIi4vcmVzb2x2ZXJzL3BhY2thZ2UvYXNzaWduUGFja2FnZVRvRGVsaXZlcnlBZ2VudC5qc1wiXG4gICAgICAgICksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBwYWNrYWdlVGltZWxhcHNlRnVuY3Rpb24gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJwYWNrYWdlVGltZWxhcHNlRnVuY3Rpb25cIixcbiAgICAgIHtcbiAgICAgICAgYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgICAgbmFtZTogXCJwYWNrYWdlVGltZWxhcHNlRnVuY3Rpb25cIixcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BhY2thZ2UvcGFja2FnZVRpbWVsYXBzZS5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGdldFBhY2thZ2VGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImdldFBhY2thZ2VGdW5jdGlvblwiLFxuICAgICAge1xuICAgICAgICBhcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IHBhY2thZ2VEYXRhc291cmNlLFxuICAgICAgICBuYW1lOiBcImdldFBhY2thZ2VGdW5jdGlvblwiLFxuICAgICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGFja2FnZS9nZXRQYWNrYWdlLmpzXCIpLFxuICAgICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgZ2V0QWxsUGFja2FnZXNGdW5jdGlvbiA9IG5ldyBhcHBzeW5jLkFwcHN5bmNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImdldEFsbFBhY2thZ2VzRnVuY3Rpb25cIixcbiAgICAgIHtcbiAgICAgICAgYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgICAgbmFtZTogXCJnZXRBbGxQYWNrYWdlc0Z1bmN0aW9uXCIsXG4gICAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL2dldEFsbFBhY2thZ2VzLmpzXCIpLFxuICAgICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIH1cbiAgICApO1xuXG5cbiAgICBjb25zdCBnZXRBbGxQYWNrYWdlc0Jhc2VPblN0YXR1c0Z1bmN0aW9uID0gbmV3IGFwcHN5bmMuQXBwc3luY0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiZ2V0QWxsUGFja2FnZXNCYXNlT25TdGF0dXNGdW5jdGlvblwiLFxuICAgICAge1xuICAgICAgICBhcGksXG4gICAgICAgIGRhdGFTb3VyY2U6IHBhY2thZ2VEYXRhc291cmNlLFxuICAgICAgICBuYW1lOiBcImdldEFsbFBhY2thZ2VzQmFzZU9uU3RhdHVzRnVuY3Rpb25cIixcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BhY2thZ2UvZ2V0QWxsUGFja2FnZXNCYXNlT25TdGF0dXMuanNcIiksXG4gICAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBnZXRDdXJyZW50UGFja2FnZU1vdmVtZW50RnVuY3Rpb24gPSBuZXcgYXBwc3luYy5BcHBzeW5jRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJnZXRDdXJyZW50UGFja2FnZU1vdmVtZW50RnVuY3Rpb25cIixcbiAgICAgIHtcbiAgICAgICAgYXBpLFxuICAgICAgICBkYXRhU291cmNlOiBwYWNrYWdlRGF0YXNvdXJjZSxcbiAgICAgICAgbmFtZTogXCJnZXRDdXJyZW50UGFja2FnZU1vdmVtZW50RnVuY3Rpb25cIixcbiAgICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BhY2thZ2UvZ2V0Q3VycmVudFBhY2thZ2VNb3ZlbWVudC5qc1wiKSxcbiAgICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICB9XG4gICAgKTtcblxuXG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImNyZWF0ZVBhY2thZ2VQaXBlbGluZVJlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY3JlYXRlUGFja2FnZVwiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbY3JlYXRlUGFja2FnZUZ1bmN0aW9uLCBwdXRFdmVudF0sXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcInVwZGF0ZVBhY2thZ2VQaXBlbGluZVJlc29sdmVyXCIsIHtcbiAgICAgIGFwaSxcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwidXBkYXRlUGFja2FnZVwiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbdXBkYXRlUGFja2FnZUZ1bmN0aW9uLCBwdXRFdmVudF0sXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImFzc2lnblBhY2thZ2VUb0RlbGl2ZXJ5UGlwZWxpbmVSZXNvbHZlclwiLCB7XG4gICAgICBhcGksXG4gICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgZmllbGROYW1lOiBcImFzc2lnblBhY2thZ2VUb0RlbGl2ZXJ5QWdlbnRcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW2Fzc2lnblBhY2thZ2VUb0RlbGl2ZXJ5QWdlbnRGdW5jdGlvbiwgcHV0RXZlbnRdLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJwYWNrYWdlVGltZWxhcHNlUmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJwYWNrYWdlVGltZWxhcHNlXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9waXBlbGluZS9kZWZhdWx0LmpzXCIpLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFtwYWNrYWdlVGltZWxhcHNlRnVuY3Rpb25dLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwcHN5bmMuUmVzb2x2ZXIodGhpcywgXCJnZXRQYWNrYWdlUmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRQYWNrYWdlXCIsXG4gICAgICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9waXBlbGluZS9kZWZhdWx0LmpzXCIpLFxuICAgICAgcGlwZWxpbmVDb25maWc6IFtnZXRQYWNrYWdlRnVuY3Rpb25dLFxuICAgIH0pO1xuXG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImdldEFsbFBhY2thZ2VzUmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRBbGxQYWNrYWdlc1wiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbZ2V0QWxsUGFja2FnZXNGdW5jdGlvbl0sXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImdldEFsbFBhY2thZ2VzQmFzZU9uU3RhdHVzUmVzb2x2ZXJcIiwge1xuICAgICAgYXBpLFxuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRBbGxQYWNrYWdlc0Jhc2VPblN0YXR1c1wiLFxuICAgICAgcnVudGltZTogYXBwc3luYy5GdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgICBjb2RlOiBhcHBzeW5jLkNvZGUuZnJvbUFzc2V0KFwiLi9yZXNvbHZlcnMvcGlwZWxpbmUvZGVmYXVsdC5qc1wiKSxcbiAgICAgIHBpcGVsaW5lQ29uZmlnOiBbZ2V0QWxsUGFja2FnZXNCYXNlT25TdGF0dXNGdW5jdGlvbl0sXG4gICAgfSk7XG5cbiAgICBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcImdldEN1cnJlbnRQYWNrYWdlTW92ZW1lbnRSZXNvbHZlclwiLCB7XG4gICAgICBhcGksXG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcImdldEN1cnJlbnRQYWNrYWdlTW92ZW1lbnRcIixcbiAgICAgIHJ1bnRpbWU6IGFwcHN5bmMuRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgICAgY29kZTogYXBwc3luYy5Db2RlLmZyb21Bc3NldChcIi4vcmVzb2x2ZXJzL3BpcGVsaW5lL2RlZmF1bHQuanNcIiksXG4gICAgICBwaXBlbGluZUNvbmZpZzogW2dldEN1cnJlbnRQYWNrYWdlTW92ZW1lbnRGdW5jdGlvbl0sXG4gICAgfSk7XG5cbiAgICAvLyBuZXcgYXBwc3luYy5SZXNvbHZlcih0aGlzLCBcIm9uQ3JlYXRlUGFja2FnZUV2ZW50XCIsIHtcbiAgICAvLyAgIGFwaSxcbiAgICAvLyAgIHR5cGVOYW1lOiBcIlN1YnNjcmlwdGlvblwiLFxuICAgIC8vICAgZmllbGROYW1lOiBcIm9uQ3JlYXRlUGFja2FnZUV2ZW50XCIsXG4gICAgLy8gICBkYXRhU291cmNlOiBuZXcgYXBwc3luYy5Ob25lRGF0YVNvdXJjZSh0aGlzLCAnTm9uZURhdGFTb3VyY2UnLCB7XG4gICAgLy8gICAgIGFwaTogYXBpLFxuICAgIC8vICAgICBuYW1lOiAnb25DcmVhdGVQYWNrYWdlRXZlbnQnLFxuICAgIC8vICAgfSksXG4gICAgLy8gICBydW50aW1lOiBhcHBzeW5jLkZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICAvLyAgIGNvZGU6IGFwcHN5bmMuQ29kZS5mcm9tQXNzZXQoXCIuL3Jlc29sdmVycy9wYWNrYWdlL29uQ3JlYXRlUGFja2FnZUV2ZW50LmpzXCIpLFxuICAgIC8vIH0pO1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiYXBwc3luYyBhcGkga2V5XCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5ISxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiYXBwc3luYyBlbmRwb2ludFwiLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmwsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcImFwcHN5bmMgYXBpSWRcIiwge1xuICAgICAgdmFsdWU6IGFwaS5hcGlJZCxcbiAgICB9KTtcbiAgfVxufSJdfQ==